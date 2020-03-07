import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {
  Avatar, Button, Card, Paragraph, TextInput, Portal, Dialog, IconButton,
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { firebase } from '@react-native-firebase/auth';

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
  contentContainer: {
    flex: 1,
  },
  replyBox: {
    height: 72,
    flexDirection: 'row',
  },
  expandedReplyBox: {
    height: 600,
    flexDirection: 'column',
  },
  replyInput: {
    flex: 1,
    backgroundColor: 'azure',
  },
  submit: {
    right: 0,
    top: 0,
    position: 'absolute',
    backgroundColor: 'red',
  },
  expand: {
    zIndex: 1,
    right: 64,
    top: 0,
    position: 'absolute',
    backgroundColor: 'green',
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
  /* User & post id */
  const postID = navigation.getParam('postID');
  const userID = navigation.getParam('userID');

  /* Displayed error message */
  const [errorMessage, setErrorMessage] = useState(null);

  /* Post data */
  const [post, setPost] = useState(null);
  const [authorName, setAuthorName] = useState(null);

  /* Reply data */
  const [replies, setReplies] = useState([]);

  /* Data retreival state */
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Reply box state */
  const [expandReply, setExpandReply] = useState(false);
  const [replyText, setReplyText] = useState(null);

  /* Dialog box state */
  const [dialogVisible, setDialogVisible] = useState(false);

  /* Retreives data from Firebase/Firestore */
  const getData = useCallback(async () => {
    setLoading(true);

    /* Query forum post data from post id passed in through navigation */
    try {
      const postSnap = await firestore().collection('forum_posts').doc(postID)
        .get();
      const postData = postSnap.data();

      /* Query post author user data */
      const authorSnapshot = firestore().collection('users').doc(postData.userID).get();
      const authorSnap = await Promise.all([authorSnapshot]);

      setAuthorName(authorSnap.length ? authorSnap[0].get('displayName') : null);

      /* Set post hook with post and author data */
      setPost(<ForumPost
        title={postData.title}
        name={authorSnap.length ? authorSnap[0].get('displayName') : null}
        date={postData.createdAt.toDate().toLocaleTimeString('en-US')}
        body={postData.body}
      />);

      try {
        const snapshot = await firestore().collection('forum_comments').where('postID', '==', postID)
          .get();
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
        const userSnap = await Promise.all(userSnapshot);
        const usersData = userSnap.map((doc) => doc.data());

        /* Set replies hook with comment and comment author data */
        setReplies(sortedRepliesData.filter((reply) => reply.body != null).map((reply, i) => ({
          ...(<ForumReply
            name={usersData[i].displayName}
            date={reply.createdAt.toDate().toLocaleTimeString('en-US')}
            body={reply.body}
          />),
          key: reply.id,
        })));
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }, [postID]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  }, [getData]);

  /* Writes reply data to Firebase/Firestore */
  const sendData = useCallback(async () => {
    try {
      const currentDate = new Date();
      await firestore().collection('forum_comments').add({
        body: replyText,
        postID,
        userID,
        createdAt: firebase.firestore.Timestamp.fromDate(currentDate),
        updatedAt: firebase.firestore.Timestamp.fromDate(currentDate),
      });

      setReplyText('');
      setExpandReply(false);
      Keyboard.dismiss();
      setDialogVisible(true);
      onRefresh();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [onRefresh, postID, replyText, userID]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={!expandReply} keyboardVerticalOffset={86}>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => {
            setDialogVisible(false);
          }}
        >
          <Dialog.Title>Thanks!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Thank you for contributing to our community!
              Your reply is being sent to our team for approval.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => {
              setDialogVisible(false);
            }}
            >
              OK

            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
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
      <View style={expandReply ? styles.expandedReplyBox : styles.replyBox}>
        <IconButton
          style={styles.expand}
          onPress={() => {
            setExpandReply(!expandReply);
          }}
        />
        <TextInput
          style={styles.replyInput}
          label={`Replying to ${authorName}'s post`}
          multiline={expandReply}
          value={replyText}
          onChangeText={(t) => {
            setReplyText(t);
          }}
        />
        <IconButton
          style={styles.submit}
          disabled={replyText == null || replyText === ''}
          onPress={() => {
            sendData();
          }}
        />
      </View>
    </KeyboardAvoidingView>
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
