import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, RefreshControl, ActivityIndicator, KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {
  Avatar, Button, Card, Paragraph, TextInput,
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
    flexDirection: 'row',
  },
  replyInput: {
    flex: 5,
  },
  submit: {
    flex: 1,
    height: 32,
    backgroundColor: 'red',
  },
  expand: {
    flex: 1,
    height: 32,
    backgroundColor: 'green',
  },
});

function ForumPost({
  title, name, date, body, navigation,
}) {
  return (
    <Card style={styles.post}>
      <Card.Title title={title} subtitle={`${name} ${date}`} left={(props) => <Avatar.Text {...props} label={name.charAt(0).toUpperCase()} />} />
      <Card.Content>
        <Paragraph>{body}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          onPress={() => navigation.push('CreateForumReply', {
            postId: 'gLnZ0pHHDY9sj8Jh8mPw',
            userId: '4qfP5OCV6q2LLAMZYLF4',
            displayName: name,
          })}
        >
          Reply
        </Button>
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
  const [expandReply, setExpandReply] = useState(false);
  const [replyText, setReplyText] = useState(null);

  const getData = useCallback(async () => {
    setLoading(true);

    /* Query forum post data from post id passed in through navigation */
    try {
      const postSnap = await firestore().collection('forum_posts').doc(postId)
        .get();
      const postData = postSnap.data();

      /* Query post author user data */
      const authorSnapshot = firestore().collection('users').doc(postData.userID).get();
      const authorSnap = await Promise.all([authorSnapshot]);

      /* Set post hook with post and author data */
      setPost(<ForumPost
        title={postData.title}
        name={authorSnap.length ? authorSnap[0].get('displayName') : null}
        date={postData.createdAt.toDate().toLocaleTimeString('en-US')}
        body={postData.body}
        navigation={navigation}
      />);

      try {
        const snapshot = await firestore().collection('forum_comments').where('postID', '==', postId)
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
        setReplies(sortedRepliesData.map((reply, i) => ({
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
  }, [navigation, postId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData().then(() => setRefreshing(false));
  }, [getData]);

  const sendData = useCallback(async () => {
    try {
      const currentDate = new Date();
      await firestore().collection('forum_comments').add({
        body: replyText,
        postID: 'gLnZ0pHHDY9sj8Jh8mPw',
        userID: '4qfP5OCV6q2LLAMZYLF4',
        createdAt: firebase.firestore.Timestamp.fromDate(currentDate),
        updatedAt: firebase.firestore.Timestamp.fromDate(currentDate),
      });

      setExpandReply(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [replyText]);

  useEffect(() => {
    getData();
  }, [getData, postId]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled={!expandReply} keyboardVerticalOffset={86}>
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
        <TextInput
          style={styles.replyInput}
          label="hello world"
          multiline={expandReply}
          onChangeText={(t) => {
            setReplyText(t);
          }}
        />
        <Button
          style={styles.submit}
          onPress={() => {
            sendData();
          }}
        />
        <Button
          style={styles.expand}
          onPress={() => {
            setExpandReply(!expandReply);
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
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
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
