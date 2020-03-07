import React from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import ForumPost from './ForumPost';

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class ForumSubcategoryPostsScreen extends React.Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      posts: [],
      loading: true,
      categoryID: navigation.getParam('categoryID'),
    };
  }

  componentDidMount() {
    const { categoryID } = this.state;
    firestore().collection('forum_posts').where('categoryID', '==', categoryID)
      .get()
      .then((snapshot) => {
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const posts = forumPosts.map((post) => {
          const date = post.createdAt ? post.createdAt.toDate() : null;
          const time = date ? date.toTimeString() : null;
          return (
            // TBD in next sprint
            <ForumPost
              key={post.id}
              name={post.userID}
              time={time}
              numReplies={5}
            >
              {post.title}
            </ForumPost>
          );
        });
        this.setState({ posts });
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message });
        this.setState({ loading: false });
      });
  }

  render() {
    const { posts, loading, errorMessage } = this.state;

    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          {errorMessage && <Text>{errorMessage}</Text>}
          {posts}
          {loading
          && (
          <View style={styles.loading}>
            <ActivityIndicator />
          </View>
          ) }
        </View>
      </ScrollView>
    );
  }
}

ForumSubcategoryPostsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func,
    categoryID: PropTypes.string,
  }).isRequired,
};
