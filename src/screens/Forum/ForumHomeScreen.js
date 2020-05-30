import React from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator, FAB } from 'react-native-paper';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';
import ForumPost from './ForumPost';
import { theme } from '../../style';

export default class ForumHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forumPosts: [],
      postLimit: 15,
      lastReferencedPost: null,
      loading: true,
      loadingMore: false,
      paddingToBottom: 30,
    };
    this.navigateToPostScreen = this.navigateToPostScreen.bind(this);
    this.reachedEnd = this.reachedEnd.bind(this);
  }

  componentDidMount() {
    this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUserID: user.uid });
      }
    });

    const { postLimit } = this.state;
    this.unsubscribeFromFirestore = firestore().collection('forum_posts')
      .orderBy('createdAt', 'desc')
      .limit(postLimit)
      .onSnapshot((snapshot) => {
        // Store data for posts in state
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const lastReferencedPost = forumPosts[forumPosts.length - 1];

        this.setState({ forumPosts, lastReferencedPost, loading: false });
      }, (error) => {
        this.setState({ errorMessage: error.message, loading: false });
      });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
    this.unsubscribeFromFirestore();
  }

  navigateToPostScreen(postID, userID) {
    const { navigation } = this.props;
    navigation.navigate('ForumPost', { postID, userID });
  }

  // Return whether user has scrolled to or near the end of the screen
  reachedEnd({ layoutMeasurement, contentOffset, contentSize }) {
    const { paddingToBottom } = this.state;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  }

  // Fetch more data from firestore to load next posts
  loadMore() {
    const { postLimit, forumPosts, lastReferencedPost } = this.state;

    firestore().collection('forum_posts')
      .orderBy('createdAt', 'desc')
      .startAfter(lastReferencedPost.createdAt)
      .limit(postLimit)
      .onSnapshot((snapshot) => {
        const newForumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const newLastReferenced = forumPosts[forumPosts.length - 1];

        this.setState({ // Store/append updated data for next postLimit# of posts in state
          forumPosts: [...forumPosts, ...newForumPosts],
          lastReferencedPost: newLastReferenced,
          loading: false,
        });
      }, (error) => {
        this.setState({ errorMessage: error.message, loadingMore: false });
      });
  }

  render() {
    const {
      forumPosts, loading, loadingMore, errorMessage, currentUserID,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.homeContainer}>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (this.reachedEnd(nativeEvent)) { // If reached end, load more posts
              this.setState({ loadingMore: true });
              this.loadMore();
            }
          }}
          scrollEventThrottle={200}
          style={styles.scrollContainer}
        >
          {loading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
          )}
          {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
          {forumPosts.map((post) => {
            const date = post.createdAt ? post.createdAt.toDate() : null;
            const time = date ? date.toTimeString() : null;

            return (
              <ForumPost
                belongsToCurrentUser={currentUserID === post.userID}
                key={post.id}
                userID={post.userID ? post.userID : null}
                time={time}
                postID={post.id}
                navigateToPostScreen={this.navigateToPostScreen}
              >
                {post.title}
              </ForumPost>
            );
          })}
          {loadingMore && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
          )}
        </ScrollView>
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('CreateForumPost')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  homeContainer: {
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    height: '100%',
    backgroundColor: theme.colors.background,
  },
  fab: {
    margin: 15,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  activityIndicator: {
    marginVertical: 15,
    color: theme.colors.primary,
  },
});

ForumHomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
