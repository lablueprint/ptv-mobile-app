import React, { useState } from 'react';
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

  const usersRef = firestore().collection('users');

  firestore().collection('forum_posts').doc(postId)
    .get()
    .then((snapshot) => {
      const postData = snapshot.data();

      usersRef.doc(postData.userID)
        .get()
        .then((userSnapshot) => {
          const userData = userSnapshot.data();

          setPost(
            <Card>
              <Card.Title title={postData.title} subtitle={`${userData.displayName} ${postData.createdAt.toDate().toLocaleTimeString('en-US')}`} left={(props) => <Avatar.Text {...props} label={userData.displayName.charAt(0).toUpperCase()} />} />
              <Card.Content>
                <Paragraph>{postData.body}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button>Reply</Button>
              </Card.Actions>
            </Card>,
          );
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    })
    .catch((error) => {
      setErrorMessage(error.message);
    });

  return (
    <View>
      <ScrollView>
        {errorMessage && <Text>{errorMessage}</Text>}
        {post}
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
