/* eslint-disable no-console */
import React from 'react';
import { View, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ForumPost from './ForumPost';

export default class ForumHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { posts: [] };
  }

  componentDidMount() {
    firestore().collection('forum_posts')
      .get()
      .then((snapshot) => {
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const posts = forumPosts.map((post) => {
          console.log(post);
          const date = post.createdAt ? post.createdAt.toDate() : null;
          const time = date ? date.toTimeString() : null;
          return (
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
        console.log(this.state);
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message });
      });
  }

  render() {
    const { posts } = this.state;

    return (
      <ScrollView style={{ backgroundColor: 'lightcyan' }}>
        <View>
          <ForumPost name="mr smallb" time="1:11 pm" numReplies={100}>
            LEGALHELP??
          </ForumPost>
        </View>
        <View>
          {posts}
        </View>
      </ScrollView>
    );
  }
}
