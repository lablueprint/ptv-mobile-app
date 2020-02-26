import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import ForumPost from './ForumPost';

export default class ForumHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
  }

  componentDidMount() {
    firestore().collection('forum_posts')
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
        <View>
          {loading && <ActivityIndicator /> }
          {errorMessage && <Text>{errorMessage}</Text>}
          {posts}
        </View>
      </ScrollView>
    );
  }
}
