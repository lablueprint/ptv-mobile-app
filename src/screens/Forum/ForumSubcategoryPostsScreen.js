import React from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import ForumPost from './ForumPost';
import { theme } from '../../style';

export default class ForumSubcategoryPostsScreen extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      forumPosts: [],
      postLimit: 15,
      lastReferencedPost: null,
      loading: true,
      paddingToBottom: 25,
      categoryID: navigation.getParam('categoryID'),
    };

    /* Function to navigate to post when post pressed, fx passed to ForumPost */
    this.navigateToPostScreen = this.navigateToPostScreen.bind(this);
    this.reachedEnd = this.reachedEnd.bind(this);
  }

  componentDidMount() {
    const { categoryID } = this.state;
    const { navigation } = this.props;

    // Get the name of the category w/ this ID, pass the name to navigation
    firestore().collection('forum_categories').doc(categoryID)
      .get()
      .then((snapshot) => {
        const categoryData = snapshot.data();
        navigation.setParams(
          { subcategoryName: categoryData.title ? categoryData.title : 'Uncategorized' },
        );
      })
      .catch((error) => this.setState({ errorMessage: error.message, loading: false }));

    this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUserID: user.uid });
      }
    });

    const { postLimit } = this.state;

    /* Only query posts w/ categoryID matching categoryID passed in from navigation */
    this.unsubscribeFromFirestore = firestore().collection('forum_posts')
      .where('categoryID', '==', categoryID)
      .orderBy('createdAt', 'desc')
      .limit(postLimit)
      .onSnapshot((snapshot) => {
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
    const {
      categoryID, postLimit, forumPosts, lastReferencedPost,
    } = this.state;

    firestore().collection('forum_posts')
      .where('categoryID', '==', categoryID)
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
        this.setState({ errorMessage: error.message, loading: false });
      });
  }

  render() {
    const {
      forumPosts, loading, errorMessage, currentUserID,
    } = this.state;

    return (
      <View style={styles.mainContainer}>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (this.reachedEnd(nativeEvent)) { // If reached end, load more posts
              this.setState({ loading: true });
              this.loadMore();
            }
          }}
          scrollEventThrottle={200}
          style={styles.scrollContainer}
        >
          {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
          {loading
          && (
          <View>
            <ActivityIndicator />
          </View>
          ) }
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
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  postContainer: {
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    height: '100%',
    backgroundColor: theme.colors.background,
  },
});

ForumSubcategoryPostsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    categoryID: PropTypes.string,
  }).isRequired,
};
