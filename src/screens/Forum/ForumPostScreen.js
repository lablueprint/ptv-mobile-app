import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {
  Avatar, Button, Card, Paragraph,
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

export default function ForumPostScreen({ navigation }) {
  const postId = navigation.getParam('postId');
  const [errorMessage, setErrorMessage] = useState(null);
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    /* Query forum post data from post id passed in through navigation */
    firestore().collection('forum_posts').doc(postId)
      .get()
      .then((postSnap) => {
        const postData = postSnap.data();

        /* Query post author user data */
        const authorSnapshot = firestore().collection('users').doc(postData.userID).get();

        Promise.all([authorSnapshot]).then((authorSnap) => {
          if (authorSnap.length) {
            const authorData = authorSnap[0].data();

            /* Set post hook with post and author data */
            setPost(
              <Card>
                <Card.Title title={postData.title} subtitle={`${authorData.displayName} ${postData.createdAt.toDate().toLocaleTimeString('en-US')}`} left={(props) => <Avatar.Text {...props} label={authorData.displayName.charAt(0).toUpperCase()} />} />
                <Card.Content>
                  <Paragraph>{postData.body}</Paragraph>
                </Card.Content>
                <Card.Actions>
                  <Button>Reply</Button>
                </Card.Actions>
              </Card>,
            );

            /* Query for post comment data */
            firestore().collection('forum_comments').where('postID', '==', postId)
              .get()
              .then((snapshot) => {
                const repliesData = snapshot.docs.map((doc) => doc.data());

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

                Promise.all(userSnapshot).then((userSnap) => {
                  const usersData = userSnap.map((doc) => doc.data());

                  /* Set replies hook with comment and comment author data */
                  setReplies(sortedRepliesData.map((reply, i) => (
                    <Card>
                      <Card.Title subtitle={`${usersData[i].displayName} ${reply.createdAt.toDate().toLocaleTimeString('en-US')}`} />
                      <Card.Content>
                        <Paragraph>{reply.body}</Paragraph>
                      </Card.Content>
                    </Card>
                  )));
                });
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          }
        });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }, [postId]);

  return (
    <View>
      <ScrollView>
        {errorMessage && <Text>{errorMessage}</Text>}
        {post}
        {replies}
      </ScrollView>
    </View>
  );
}

ForumPostScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
