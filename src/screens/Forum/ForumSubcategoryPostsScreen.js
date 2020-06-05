import React from 'react';
import {
  Text, View, FlatList, StyleSheet,
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
      postLimit: 10,
      lastReferencedPost: null,
      loading: true,
      loadingMore: false,
      allPostsLoaded: false,
      categoryID: navigation.getParam('categoryID'),
    };

    /* Function to navigate to post when post pressed, fx passed to ForumPost */
    this.navigateToPostScreen = this.navigateToPostScreen.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleEndReached = this.handleEndReached.bind(this);
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
    firestore().collection('forum_posts')
      .where('categoryID', '==', categoryID)
      .orderBy('createdAt', 'desc')
      .limit(postLimit)
      .get()
      .then((snapshot) => {
        // Store data for posts in state
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const lastReferencedPost = forumPosts[forumPosts.length - 1];

        this.setState({ forumPosts, lastReferencedPost, loading: false });
      })
      .catch((error) => this.setState({ errorMessage: error.message, loadingMore: false }));
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  navigateToPostScreen(postID, userID) {
    const { navigation } = this.props;
    navigation.navigate('ForumPost', { postID, userID });
  }

  handleEndReached() {
    const { allPostsLoaded } = this.state;

    if (!allPostsLoaded) {
      this.setState({ loadingMore: true });
      this.loadMore();
    } else { this.setState({ loadingMore: false }); }
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
      .get()
      .then((snapshot) => {
        const newForumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const newLastReferenced = newForumPosts[newForumPosts.length - 1];

        if (newForumPosts.length === 0) { // All posts loaded
          this.setState({ allPostsLoaded: true, loadingMore: false });
        }

        this.setState({ // Store/append updated data for next postLimit# of posts in state
          forumPosts: [...forumPosts, ...newForumPosts],
          lastReferencedPost: newLastReferenced,
        });
      })
      .catch((error) => this.setState({ errorMessage: error.message, loadingMore: false }));
  }

  render() {
    const {
      forumPosts, loading, loadingMore, errorMessage, currentUserID,
    } = this.state;

    return (
      <View style={styles.mainContainer}>
        <FlatList
          ListHeaderComponent={(loading
            && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator />
            </View>
            )
          )}
          {...errorMessage && (
          <Text style={{ color: 'red' }}>
            {errorMessage}
          </Text>
          )}
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
              navigate={this.navigateToPostScreen}
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
  activityIndicator: {
    marginVertical: 15,
    color: theme.colors.primary,
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
