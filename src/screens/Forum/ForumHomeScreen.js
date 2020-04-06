import React from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator, FAB } from 'react-native-paper';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';
import ForumPost from './ForumPost';


export default class ForumHomeScreen extends React.Component {
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
    this.snapshotUnsubscribe = firestore().collection('forum_posts')
      .onSnapshot((snapshot) => {
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
            <ForumPost
              belongsToCurrentUser={userID === post.userID}
              key={post.id}
              /* Pass in userID if it exists, other pass in null */
              userID={post.userID ? post.userID : null}
              time={time}
              postID={post.id}
              navigateToPostScreen={this.navigateToPostScreen}
            >
              {post.title}
            </ForumPost>
          );
        });
        this.setState({ posts });
        this.setState({ loading: false });
      }, (error) => { /* Error handler */
        this.setState({ errorMessage: error.message });
        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.snapshotUnsubscribe();
  }

  navigateToPostScreen() {
    const { navigation } = this.props;
    navigation.navigate('ForumPost');
  }

  render() {
    const { posts, loading, errorMessage } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          {loading && <ActivityIndicator /> }
          {errorMessage && <Text>{errorMessage}</Text>}
          {posts}
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

ForumHomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
