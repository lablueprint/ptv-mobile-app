import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, RefreshControl, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {
  Avatar, Button, Card, Paragraph,
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'azure',
  },
  post: {
    borderRadius: 15,
    margin: 20,
  },
  card: {
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  cardBackground: {
    borderRadius: 15,
    paddingVertical: 15,
    backgroundColor: 'lavender',
  },
});

function ForumPost({
  title, name, date, body,
}) {
  return (
    <Card style={styles.post}>
      <Card.Title title={title} subtitle={`${name} ${date}`} left={(props) => <Avatar.Text {...props} label={name.charAt(0).toUpperCase()} />} />
      <Card.Content>
        <Paragraph>{body}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button>Reply</Button>
      </Card.Actions>
    </Card>
  );
}

function ForumReply({
  name, date, body,
}) {
  return (
    <Card style={styles.card}>
      <Card.Title subtitle={`${name} ${date}`} />
      <Card.Content>
        <Paragraph>{body}</Paragraph>
      </Card.Content>
    </Card>
  );
}

export default function ForumPostScreen({ navigation }) {
  const postId = navigation.getParam('postId');
  const [errorMessage, setErrorMessage] = useState(null);
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(() => {
    setLoading(true);

    /* Query forum post data from post id passed in through navigation */
    return firestore().collection('forum_posts').doc(postId)
      .get()
      .then((postSnap) => {
        const postData = postSnap.data();

        /* Query post author user data */
        const authorSnapshot = firestore().collection('users').doc(postData.userID).get();

        return Promise.all([authorSnapshot]).then((authorSnap) => {
          /* Set post hook with post and author data */
          setPost(<ForumPost title={postData.title} name={authorSnap.length ? authorSnap[0].get('displayName') : null} date={postData.createdAt.toDate().toLocaleTimeString('en-US')} body={postData.body} />);

          /* Query for post comment data */
          return firestore().collection('forum_comments').where('postID', '==', postId)
            .get()
            .then((snapshot) => {
              const repliesData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

              /* Sort comments by created at timestamp, from oldest to youngest */
              const sortedRepliesData = repliesData.sort((a, b) => {
                const aMillis = a.createdAt.toMillis();
                const bMillis = b.createdAt.toMillis();
                if (aMillis > bMillis) {
                  return 1;
                }
                if (aMillis < bMillis) {
                  return -1;
                }
                return 0;
              });

              /* Query comment author user data */
              const userSnapshot = sortedRepliesData.map((reply) => firestore().collection('users').doc(reply.userID).get());

              return Promise.all(userSnapshot).then((userSnap) => {
                const usersData = userSnap.map((doc) => doc.data());

                /* Set replies hook with comment and comment author data */
                setReplies(sortedRepliesData.map((reply, i) => ({
                  ...(
                    <ForumReply name={usersData[i].displayName} date={reply.createdAt.toDate().toLocaleTimeString('en-US')} body={reply.body} />
                  ),
                  key: reply.id,
                }
                )));

                setLoading(false);
              });
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [postId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  }, [getData]);

  useEffect(() => {
    getData();
  }, [getData, postId]);

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {errorMessage && <Text>{errorMessage}</Text>}
        {post}
        <View style={styles.cardBackground}>
          {replies}
          {loading && <ActivityIndicator />}
        </View>
      </ScrollView>
    </View>
  );
}

ForumPost.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

ForumReply.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

ForumPostScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
