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
import { theme } from '../../style';

const styles = StyleSheet.create({
  secondaryBackground: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  postContainer: {
    borderRadius: 15,
    margin: 20,
    backgroundColor: theme.colors.postBackground,
  },
  postTitleText: {
    color: theme.colors.accent,
    fontSize: 18,
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: 'bold',
  },
  sidePostText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontFamily: theme.fonts.regular.fontFamily,
    fontWeight: theme.fonts.regular.fontWeight,
  },
  mainPostText: {
    color: theme.colors.text,
    fontSize: 15,
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: theme.fonts.medium.fontWeight,
  },
  alertText: {
    color: theme.colors.alertText,
    fontSize: 14,
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: theme.fonts.medium.fontWeight,
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
    height: '15%',
    flexDirection: 'row',
  },
  expandedReplyBox: {
    height: '80%',
    flexDirection: 'column',
  },
  replyInput: {
    flex: 1,
    backgroundColor: 'azure',
  },
  submit: {
    right: 0,
    top: 0,
    width: '5%',
    height: '15%',
    position: 'absolute',
    backgroundColor: 'red',
  },
  expandedSubmit: {
    right: 0,
    top: 0,
    width: '5%',
    height: '2%',
    position: 'absolute',
    backgroundColor: 'red',
  },
  expand: {
    zIndex: 1,
    right: '7%',
    top: 0,
    width: '5%',
    height: '15%',
    position: 'absolute',
    backgroundColor: 'green',
  },
  expandedExpand: {
    zIndex: 1,
    right: '7%',
    top: 0,
    width: '5%',
    height: '2%',
    position: 'absolute',
    backgroundColor: 'green',
  },
});

function ForumPost({
  title, name, date, body,
}) {
  return (
    <Card style={styles.postContainer}>
      <Card.Title
        title={`${name} ${date}`} // Name and date go above post title
        /* title={(
          <View>
            <Text style={{ fontWeight: 'bold' }}>{name}</Text>
            <Text>
              {' '}
              {date}
            </Text>
          </View>
        )} */
        titleStyle={styles.sidePostText}
        subtitle={title}
        subtitleStyle={styles.postTitleText}
        style={{ alignItems: 'center' }}
        left={(props) => <Avatar.Text {...props} label={name.charAt(0).toUpperCase()} />}
      />
      <Card.Content>
        <Paragraph style={styles.mainPostText}>{body}</Paragraph>
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

function ReplyDialog({
  visible, setVisible,
}) {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Dialog.Content>
          <Paragraph style={styles.alertText}>
            Thank you for contributing to our community!
            Your reply is being sent to our team for approval.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => {
            setVisible(false);
          }}
          >
            OK

          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

function ReplyBox({
  expandReply,
  setExpandReply,
  authorName,
  replyText,
  setReplyText,
  sendData,
}) {
  return (
    <View style={expandReply ? styles.expandedReplyBox : styles.replyBox}>
      <IconButton
        style={expandReply ? styles.expandedExpand : styles.expand}
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
        style={expandReply ? styles.expandedSubmit : styles.submit}
        disabled={replyText == null || replyText === ''}
        onPress={() => {
          sendData();
        }}
      />
    </View>
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

  /* Data retrieval state */
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Reply box state */
  const [expandReply, setExpandReply] = useState(false);
  const [replyText, setReplyText] = useState(null);

  /* Dialog box state */
  const [dialogVisible, setDialogVisible] = useState(false);

  /* Retrieves data from Firebase/Firestore */
  const getData = useCallback(async () => {
    setLoading(true);

    /* Query forum post data from postid passed in through navigation */
    const postSnap = await firestore().collection('forum_posts').doc(postID)
      .get();
    const postData = postSnap.data();

    /* Query post author's user data */
    const authorSnapshot = firestore().collection('users').doc(postData.userID).get();
    const authorSnap = await Promise.all([authorSnapshot]);
    setAuthorName(authorSnap.length ? authorSnap[0].get('displayName') : null);

    /* Get rest of post data; set post hook w/ post and author data */
    const postTitle = postData.title || 'Title unset';
    const postName = authorName || 'Name unset';
    const postDate = postData.createdAt ? postData.createdAt.toDate().toLocaleTimeString('en-US') : 'Date unset';
    const postBody = postData.body || 'Body unset';
    setPost(<ForumPost
      title={postTitle}
      name={postName}
      date={postDate}
      body={postBody}
    />);

    try {
      /* Get replies/comments, sorted by createdAt timestamp from oldest to youngest */
      const snapshot = await firestore().collection('forum_comments')
        .where('postID', '==', postID)
        .orderBy('createdAt')
        .get();
      const sortedRepliesData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      /* Get comment author's user data */
      const userSnapshot = sortedRepliesData.map((reply) => firestore().collection('users').doc(reply.userID).get());
      const userSnap = await Promise.all(userSnapshot);
      const usersData = userSnap.map((doc) => doc.data());

      /* Set replies hook with comment and comment author data */
      setReplies(sortedRepliesData.filter((reply) => reply.body != null).map((reply, i) => ({
        ...(<ForumReply
          name={usersData[i].displayName || 'Name unset'}
          date={reply.createdAt ? reply.createdAt.toDate().toLocaleTimeString('en-US') : 'Date unset'}
          body={reply.body || 'Body unset'}
        />),
        key: reply.id,
      })));
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }, [authorName, postID]);

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
    <KeyboardAvoidingView style={styles.secondaryBackground} behavior="padding" enabled={!expandReply} keyboardVerticalOffset={86}>
      <ReplyDialog
        visible={dialogVisible}
        setVisible={setDialogVisible}
      />
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
      <ReplyBox
        expandReply={expandReply}
        setExpandReply={setExpandReply}
        authorName={authorName || ''}
        replyText={replyText || ''}
        setReplyText={setReplyText}
        sendData={sendData}
      />
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

ReplyDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

ReplyBox.propTypes = {
  expandReply: PropTypes.bool.isRequired,
  setExpandReply: PropTypes.func.isRequired,
  authorName: PropTypes.string.isRequired,
  replyText: PropTypes.string.isRequired,
  setReplyText: PropTypes.func.isRequired,
  sendData: PropTypes.func.isRequired,
};
