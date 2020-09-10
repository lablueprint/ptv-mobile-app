import React, { useState, useEffect } from 'react';
import {
  Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  Card, Title, ActivityIndicator, IconButton, Menu, Divider,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { theme } from '../../style';

const styles = StyleSheet.create({
  postContainer: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    borderRadius: 15,
  },
  actionContainer: {
    width: '100%',
    marginHorizontal: '1%',
    justifyContent: 'space-between',
  },
  bodyText: {
    color: theme.colors.text,
    fontFamily: theme.fonts.medium.fontFamily,
    fontWeight: theme.fonts.medium.fontWeight,
  },
  sideText: {
    color: theme.colors.accent,
    fontFamily: theme.fonts.regular.fontFamily,
    fontWeight: theme.fonts.regular.fontWeight,
  },
});

export default function ForumPost({
  userID, time, children, postID, navigateToPostScreen, belongsToCurrentUser,
}) {
  const [loading, setLoading] = useState(true);
  const [numReplies, setNumReplies] = useState(0);

  useEffect(() => {
    firestore().collection('forum_comments').where('postID', '==', postID)
      .get()
      .then((querySnapshot) => {
        setNumReplies(querySnapshot.size);
        setLoading(false);
      });
  }, [postID]);

  const [name, setName] = useState('Name unset');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userErrorMessage, setUserErrorMessage] = useState();

  useEffect(() => {
    /* Get user w/ this userID from database, the user's display name, and if they are PTV staff */
    firestore().collection('users').doc(userID)
      .get()
      .then((snapshot) => {
        const data = snapshot.data();
        setName(data.displayName ? data.displayName : 'No name');
        setIsAdmin(data.isAdmin);
      })
      .catch((error) => setUserErrorMessage(error.message));
  }, [userID]); // [name, userID] caused memory leak

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
    <TouchableOpacity onPress={() => navigateToPostScreen(postID, userID)}>
      {userErrorMessage && <Text style={{ color: 'red' }}>{userErrorMessage}</Text>}
      <Card style={styles.postContainer}>
        <Card.Title
          subtitleStyle={styles.sideText}
          subtitle={isAdmin ? `${name} (PTV Staff) ${time}` : `${name} ${time}`}
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
          <Title style={styles.bodyText}>
            {children}
          </Title>
        </Card.Content>
        <Card.Actions style={styles.actionContainer}>
          <TouchableOpacity>
            {loading && <ActivityIndicator /> }
            {!loading && (
            <Text style={styles.sideText} onPress={handlePress}>
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
