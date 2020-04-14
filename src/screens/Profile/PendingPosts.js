import React from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';
import ForumPost from '../Forum/ForumPost';

export default class PendingPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
    this.navigateToPostScreen = this.navigateToPostScreen.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ userID: user.uid });
      }
    });
    firestore().collection('forum_posts')
      .get()
      .then((snapshot) => {
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const posts = forumPosts.sort((a, b) => {
          const aMillis = a.createdAt.toMillis();
          const bMillis = b.createdAt.toMillis();
          if (aMillis > bMillis) {
            return -1;
          }
          if (aMillis < bMillis) {
            return 1;
          }
          return 0;
        }).map((post) => {
          const date = post.createdAt ? post.createdAt.toDate() : null;
          const time = date ? date.toTimeString() : null;
          const { userID } = this.state;
          return (
            // TBD in next sprint
            post.approved === false && userID === post.userID && (
            <ForumPost
              belongsToCurrentUser={userID === post.userID}
              key={post.id}
              name={post.userID}
              time={time}
              numReplies={5}
              navigateToPostScreen={this.navigateToPostScreen}
            >
              {post.title}
            </ForumPost>
            )
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

  componentWillUmount() {
    this.unsubscribe();
  }

  navigateToPostScreen() {
    const { navigation } = this.props;
    navigation.navigate('ForumPost');
  }

  render() {
    const { posts, loading, errorMessage } = this.state;

    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          {loading && <ActivityIndicator /> }
          {errorMessage && <Text>{errorMessage}</Text>}
          {posts}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    justifyContent: 'space-between',
  },
  fab: {
    margin: 15,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

PendingPosts.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
