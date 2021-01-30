import React from 'react';
import {
  Text, View, FlatList, StyleSheet,
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
      postLimit: 10,
      lastReferencedPost: null,
      loading: true,
      loadingMore: false,
      allPostsLoaded: false,
      errorMessage: null,
    };

    this.navigateToPostScreen = this.navigateToPostScreen.bind(this);
    this.navigateToEditScreen = this.navigateToEditScreen.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleEndReached = this.handleEndReached.bind(this);
    this.renderHeaderComponent = this.renderHeaderComponent.bind(this);
  }

  componentDidMount() {
    this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUserID: user.uid });
      }
    });

    const { postLimit } = this.state;
    firestore().collection('forum_posts')
      .orderBy('createdAt', 'desc')
      .limit(postLimit)
      .get()
      .then((snapshot) => {
        // Store data for posts in state
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const lastReferencedPost = forumPosts[forumPosts.length - 1];

        this.setState({ forumPosts, lastReferencedPost, loading: false });
      })
      .catch((error) => this.setState({ errorMessage: error.message, loading: false }));
  }

  componentDidUpdate() {
    const { postLimit } = this.state;
    firestore().collection('forum_posts')
      .orderBy('createdAt', 'desc')
      .limit(postLimit)
      .get()
      .then((snapshot) => {
        // Store data for posts in state
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const lastReferencedPost = forumPosts[forumPosts.length - 1];

        this.setState({ forumPosts, lastReferencedPost, loading: false });
      })
      .catch((error) => this.setState({ errorMessage: error.message, loading: false }));
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  navigateToPostScreen(postID, userID) {
    const { navigation } = this.props;
    navigation.navigate('ForumPost', { postID, userID });
  }

  navigateToEditScreen(postID, userID) {
    const { navigation } = this.props;
    // navigation.navigate('ForumPost', { postID, userID });
    navigation.navigate('EditForumPost', { postID, userID });
  }

  // Calls loadMore fx to load more posts when end of screen has been reached
  handleEndReached() {
    const { allPostsLoaded } = this.state;

    if (!allPostsLoaded) {
      this.loadMore();
    }
  }

  // Fetch more data from firestore to load next posts for infinite scrolling
  loadMore() {
    this.setState({ loadingMore: true });
    const { postLimit, forumPosts, lastReferencedPost } = this.state;

    firestore().collection('forum_posts')
      .orderBy('createdAt', 'desc')
      .startAfter(lastReferencedPost.createdAt)
      .limit(postLimit)
      .get()
      .then((snapshot) => {
        const newForumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const newLastReferenced = newForumPosts[newForumPosts.length - 1];

        if (newForumPosts.length === 0) {
          this.setState({ allPostsLoaded: true, loadingMore: false });
        } else {
          this.setState({ // Store/append updated data for next postLimit# of posts in state
            forumPosts: [...forumPosts, ...newForumPosts],
            lastReferencedPost: newLastReferenced,
          });
        }
      })
      .catch((error) => this.setState({ errorMessage: error.message, loadingMore: false }));
  }

  // Fx to render the error message and loading, since directly rendering causes an error
  renderHeaderComponent() {
    const { loading, errorMessage } = this.state;

    if (loading && !errorMessage) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator />
        </View>
      );
    }
    if (errorMessage && !loading) {
      return (
        <Text style={{ color: 'red' }}>
          {errorMessage}
        </Text>
      );
    }
    if (errorMessage && loading) {
      return (
        <View>
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
          <Text style={{ color: 'red' }}>
            {errorMessage}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const {
      forumPosts, currentUserID, loadingMore,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.mainContainer}>
        <FlatList
          ListHeaderComponent={this.renderHeaderComponent}
          data={forumPosts.map((post) => {
            const time = post.createdAt ? post.createdAt.toDate().toTimeString() : null;
            const belongsToCurrentUser = (currentUserID === post.userID);

            return {
              ...post,
              time,
              belongsToCurrentUser,
            };
          })}
          keyExtractor={(post) => post.id}
          renderItem={({ item }) => (
            <ForumPost
              belongsToCurrentUser={item.belongsToCurrentUser}
              userID={item.userID ? item.userID : null}
              time={item.time}
              postID={item.id}
              navigateToPostScreen={this.navigateToPostScreen}
              navigateToEditScreen={this.navigateToEditScreen}
            >
              {item.title}
            </ForumPost>
          )}
          onEndReachedThreshold={0.25}
          onEndReached={this.handleEndReached}
          ListFooterComponent={(loadingMore
            && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
            )
          )}
        />
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
  mainContainer: {
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
    justifyContent: 'center',
    color: theme.colors.primary,
  },
});

ForumHomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
