import React, { useState } from 'react';
import {
  Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Card, Title, ActivityIndicator } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 15,
  },
  title: {
  },
  actionContainer: {
    width: '100%',
    marginHorizontal: '1%',
    justifyContent: 'space-between',
  },
  text: {
  },
});

export default function ForumPost({
  name, time, children, postID,
}) {
  const [loading, setLoading] = useState(true);
  const [numReplies, setNumReplies] = useState(0);

  firestore().collection('forum_comments').where('postID', '==', postID)
    .get()
    .then((querySnapshot) => {
      setNumReplies(querySnapshot.size);
      setLoading(false);
    });

  return (
    <Card style={styles.container}>
      <Card.Title style={styles.title} subtitle={`${name} ${time}`} />
      <Card.Content>
        <TouchableOpacity>
          <Title>
            {children}
          </Title>
        </TouchableOpacity>
      </Card.Content>
      <Card.Actions style={styles.actionContainer}>
        <TouchableOpacity>
          {loading && <ActivityIndicator /> }
          {!loading && (
          <Text style={styles.text}>
            {`${numReplies} Replies`}
          </Text>
          ) }
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );
}

ForumPost.propTypes = {
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};
