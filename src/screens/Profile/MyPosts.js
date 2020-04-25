import React, { Component } from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';
import { withNavigation } from 'react-navigation';
import ForumPost from '../Forum/ForumPost';
import { theme } from '../../style';


class MyPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    };
    this.navigateToPostScreen = this.navigateToPostScreen.bind(this);
  }

  componentDidMount() {
    const { approvalBoolean } = this.props;
    this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ userID: user.uid });
      }
    });

    this.unsubscribeFromFirestore = firestore().collection('forum_posts')
      .orderBy('createdAt', 'desc') /* Update this to order by time approved, most to least recent */
      .onSnapshot((snapshot) => {
        const forumPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const posts = forumPosts.map((post) => {
          const date = post.createdAt ? post.createdAt.toDate() : null;
          const time = date ? date.toTimeString() : null;
          const { userID } = this.state;

          return (
            post.approved === approvalBoolean && userID === post.userID && (
            <ForumPost
              belongsToCurrentUser={userID === post.userID}
              key={post.id}
              /* Pass in userID  if it exists, other pass in null */
              userID={post.userID ? post.userID : null}
              time={time}
              postID={post.id}
              navigateToPostScreen={this.navigateToPostScreen}
            >
              {post.title}
            </ForumPost>
            )
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

  navigateToPostScreen() {
    const { navigation } = this.props;
    navigation.navigate('ForumPost');
  }

  render() {
    const { posts, loading, errorMessage } = this.state;


    return (
      <View style={styles.homeContainer}>
        <ScrollView>
          {loading && <ActivityIndicator /> }
          {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
          {posts}
        </ScrollView>
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
});

MyPosts.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
  approvalBoolean: PropTypes.bool.isRequired,
};

export default withNavigation(MyPosts);
