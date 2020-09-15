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
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: 'cyan',
    // backgroundColor: theme.colors.postBackground,
  },
  postContainer: {
    borderRadius: 15,
    margin: 20,
    fontSize: 20,
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
    backgroundColor: theme.colors.postBackground,
  },
  postTitleText: {
    color: theme.colors.accent,
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
    backgroundColor: theme.colors.background,
  },
  replyBox: {
    height: '15%',
    flexDirection: 'row',
    backgroundColor: theme.colors.postBackground,
  },
  expandedReplyBox: {
    height: '80%',
    backgroundColor: theme.colors.postBackground,
    flexDirection: 'column',
  },
  replyInput: {
    flex: 1,
    backgroundColor: theme.colors.postBackground,
    color: '#000000',
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: theme.fonts.medium.fontWeight,
    fontSize: 15,
  },
  submitButton: {
    right: '2%',
    top: 0,
    position: 'absolute',
    backgroundColor: theme.colors.postBackground,
  },
  expandedSubmitButton: {
    right: '2%',
    top: '84%',
    position: 'absolute',
  },
  expandButton: {
    zIndex: 1,
    right: '11%',
    top: '1%',
    position: 'absolute',
  },
  expandedExpandButton: {
    zIndex: 1,
    right: '2%',
    top: '2%',
    position: 'absolute',
  },
});

function ForumPost({
  title, name, date, body,
}) {
  return (
    <Card style={styles.postContainer}>
      <Card.Title
        title={`${name} ${date}`} // Name and date go above post title
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
  expandedReply,
  setExpandedReply,
  authorName,
  replyText,
  setReplyText,
  sendData,
}) {
  return (
    <View style={expandedReply ? styles.expandedReplyBox : styles.replyBox}>
      <IconButton
        // icon="arrow-expand"
        icon={expandedReply ? 'arrow-collapse' : 'arrow-expand'}
        style={expandedReply ? styles.expandedExpandButton : styles.expandButton}
        size={22}
        onPress={() => {
          setExpandedReply(!expandedReply);
        }}
      />
      <TextInput
        style={styles.replyInput}
        label="Type your reply here"
        multiline //= {expandedReply}
        placeholder={`Replying to ${authorName}'s post`}
        underlineColorAndroid="transparent" // remove underline and border line
        theme={{ colors: { primary: styles.replyInput.color } }} // make label grey
        onChangeText={(t) => {
          setReplyText(t);
        }}
        value={replyText}
      />
      <IconButton
        icon="send"
        size={22}
        style={expandedReply ? styles.expandedSubmitButton : styles.submitButton}
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

  /* Reply box state, expandedReply is true when the reply box is expanded */
  const [expandedReply, setExpandedReply] = useState(false);
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
      setExpandedReply(false);
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
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior="padding"
      enabled={!expandedReply}
      keyboardVerticalOffset={5}
    >
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
        {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
        {post}
        <View
          style={styles.cardBackground}
        >
          {replies}
          {loading && <ActivityIndicator />}
        </View>
      </ScrollView>
      <ReplyBox
        expandedReply={expandedReply}
        setExpandedReply={setExpandedReply}
        authorName={authorName || 'Name unset'}
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
  expandedReply: PropTypes.bool.isRequired,
  setExpandedReply: PropTypes.func.isRequired,
  authorName: PropTypes.string.isRequired,
  replyText: PropTypes.string.isRequired,
  setReplyText: PropTypes.func.isRequired,
  sendData: PropTypes.func.isRequired,
};
