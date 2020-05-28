import React from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator, FAB, Button } from 'react-native-paper';
import PropTypes from 'prop-types';

import ForumPost from './ForumPost';
import { theme } from '../../style';

export default class ForumHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
    this.navigateToPostScreen = this.navigateToPostScreen.bind(this);
    this.createNotification = this.createNotification.bind(this);
  }

  componentDidMount() {
    this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUserID: user.uid });
      }
    });

    this.unsubscribeFromFirestore = firestore().collection('forum_posts')
      .orderBy('createdAt', 'desc') /* Update this to order by time approved, most to least recent */
      .onSnapshot((snapshot) => {
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const posts = forumPosts.map((post) => {
          const date = post.createdAt ? post.createdAt.toDate() : null;
          const time = date ? date.toTimeString() : null;
          const { currentUserID } = this.state;
          return (
            <ForumPost
              belongsToCurrentUser={currentUserID === post.userID}
              key={post.id}
              /* Pass in userID  if it exists, other pass in null */
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
      }, (error) => { /* Error handler */
        this.setState({ errorMessage: error.message, loading: false });
      });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
    this.unsubscribeFromFirestore();
  }

  createNotification() {
    /* TODO: Emulates notification being sent.
    Remove this and Send Notification button eventually.
    Emulate this structure for creation of notification
    Note: userID should denote the receiver of the notification,
    not the sender */
    const { currentUserID } = this.state;
    firestore().collection('profile_notifications')
      .add({
        userID: currentUserID,
        viewed: false,
        createdAt: firestore.Timestamp.now(),
        message: 'Hello World',
        type: 'approve',
        replies: 5,
      });
  }

  navigateToPostScreen() {
    const { navigation } = this.props;
    navigation.navigate('ForumPost');
  }

  render() {
    const { posts, loading, errorMessage } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.homeContainer}>
        <Button
          onPress={this.createNotification}
          disabled={loading}
        >
          Send Notification
        </Button>
        <ScrollView>
          {loading && <ActivityIndicator /> }
          {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
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
  homeContainer: {
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
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
