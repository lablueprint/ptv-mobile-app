import React from 'react';
import {
  Text, View, ScrollView, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator, FAB } from 'react-native-paper';
import PropTypes from 'prop-types';
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
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

ForumHomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
