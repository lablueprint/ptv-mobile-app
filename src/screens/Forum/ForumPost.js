import React, { useState } from 'react';
import {
  Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  Card, Title, ActivityIndicator, IconButton, Menu, Divider,
} from 'react-native-paper';
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
  userID, time, children, postID, navigateToPostScreen, belongsToCurrentUser,
}) {
  const [loading, setLoading] = useState(true);
  const [numReplies, setNumReplies] = useState(0);

  firestore().collection('forum_comments').where('postID', '==', postID)
    .get()
    .then((querySnapshot) => {
      setNumReplies(querySnapshot.size);
      setLoading(false);
    });

  /* Get user w/ this userID from database, the user's display name, and if they are PTV staff */
  const [name, setName] = useState('No name');
  const [isAdmin, setIsAdmin] = useState(false);

  /* ERROR isn't getting user? error w/ queryUser, right userID is passed in */
  firestore().collection('users').where('id', '==', userID)
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        setName(userDoc.name);
        setIsAdmin(userDoc.isAdmin);
      }
    });

  const handlePress = () => {
    // TODO: navigate to reply screen
  };
  const handleEdit = () => {
    // TODO: navigate to edit screen
  };
  const handleDelete = () => {
    // TODO: delete current post
  };

  const [visible, setVisible] = useState(false);
  return (
    <TouchableOpacity onPress={navigateToPostScreen}>
      <Card style={styles.container}>
        <Card.Title
          style={styles.title}
          subtitle={isAdmin ? `${name}(PTV Staff) ${time}` : `${name} ${time}`}
          right={(props) => (belongsToCurrentUser
            ? (
              <Menu
                {...props}
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                  <IconButton icon="dots-horizontal" onPress={() => setVisible(true)}>Show menu</IconButton>
            }
              >
                <Menu.Item icon="pencil" onPress={handleEdit} title="Edit" />
                <Menu.Item icon="delete" onPress={handleDelete} title="Delete" />
                <Divider />
              </Menu>
            )
            : null)}
        />
        <Card.Content>
          <Title>
            {children}
          </Title>
        </Card.Content>
        <Card.Actions style={styles.actionContainer}>
          <TouchableOpacity>
            {loading && <ActivityIndicator /> }
            {!loading && (
            <Text style={styles.text} onPress={handlePress}>
              {`${numReplies} Replies`}
            </Text>
            ) }
          </TouchableOpacity>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );
}

ForumPost.propTypes = {
  belongsToCurrentUser: PropTypes.bool.isRequired,
  userID: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  postID: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  navigateToPostScreen: PropTypes.func.isRequired,
};
