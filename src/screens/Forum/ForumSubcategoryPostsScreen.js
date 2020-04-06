import React from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import ForumPost from './ForumPost';
import { theme } from '../../style';

export default class ForumSubcategoryPostsScreen extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      posts: [],
      loading: true,
      categoryID: navigation.getParam('categoryID'),
    };

    /* Function to navigate to post when post pressed, fx passed to ForumPost */
    this.navigateToPostScreen = this.navigateToPostScreen.bind(this);
  }

  componentDidMount() {
    const { categoryID } = this.state;
    /* Only query posts w/ categoryID matching categoryID passed in from navigation */
    this.snapshotUnsubscribe = firestore().collection('forum_posts').where('categoryID', '==', categoryID)
      .onSnapshot((snapshot) => {
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const posts = forumPosts.map((post) => {
          const date = post.createdAt ? post.createdAt.toDate() : null;
          const time = date ? date.toTimeString() : null;

          return (
          // TBD: replies
            <ForumPost
              key={post.id}
              userID={post.userID ? post.userID : null}
              time={time}
              postID={post.id}
              navigateToPostScreen={this.navigateToPostScreen}
            >
              {post.title}
            </ForumPost>
          );
        });
        this.setState({ posts, loading: false });
      }, (error) => {
        this.setState({ errorMessage: error.message, loading: false });
      });
  }

  componentWillUnmount() {
    this.snapshotUnsubscribe();
  }

  navigateToPostScreen() {
    const { navigation } = this.props;
    navigation.navigate('ForumPost');
  }

  render() {
    const { posts, loading, errorMessage } = this.state;

    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollContainer}>
          {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
          {posts}
          {loading
          && (
          <View>
            <ActivityIndicator />
          </View>
          ) }
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
    categoryID: PropTypes.string,
  }).isRequired,
};
