import React, { useState, useCallback } from 'react';
import {
  View, Text,
} from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {
  Button, TextInput,
} from 'react-native-paper';
import { firebase } from '@react-native-firebase/auth';

export default function CreateForumReplyScreen({ navigation }) {
  const postId = navigation.getParam('postId');
  const userId = navigation.getParam('userId');
  const displayName = navigation.getParam('displayName');
  const [replyText, setReplyText] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const sendData = useCallback(async () => {
    try {
      const currentDate = new Date();
      await firestore().collection('forum_comments').add({
        body: replyText,
        postId,
        userId,
        createdAt: firebase.firestore.Timestamp.fromDate(currentDate),
        updatedAt: firebase.firestore.Timestamp.fromDate(currentDate),
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [replyText, postId, userId]);

  return (
    <View>
      {errorMessage && <Text>{errorMessage}</Text>}
      <View>
        <TextInput
          label={`Replying to ${displayName}'s post`}
          value={replyText}
          mode="outlined"
          placeholder="Type your reply here"
          onChangeText={(t) => {
            setReplyText(t);
          }}
        />
        <Button
          onPress={() => {
            sendData();
          }}
        >
          Send Reply
        </Button>
      </View>
    </View>
  );
}

CreateForumReplyScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
