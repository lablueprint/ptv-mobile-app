import React, { useState, useEffect } from 'react';
import {
  Text, TouchableOpacity, StyleSheet, // KeyboardAvoidingView, Platform,
} from 'react-native';
import {
  Card, Title, ActivityIndicator, IconButton, Menu, Divider, Portal, Dialog, Paragraph, Button,
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
  deleteDialogParagraph: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const deletePost = (id) => {
  firestore().collection('forum_posts').doc(id).delete();
};

function DeleteDialog({
  visible, setVisible, confirmedDelete,
}) {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        style={styles.deleteDialog}
      >
        <Dialog.Content>
          <Paragraph style={styles.alertText}>
            Are you sure you would like to delete this post?
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setVisible(false);
              confirmedDelete(true);
            }}
          >
            Delete
          </Button>
          <Button
            onPress={() => {
              setVisible(false);
            }}
            color="black"
          >
            Cancel
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

function DeleteConfirmationDialog({
  visible, setVisible, id, refreshHomeScreen,
}) {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        style={styles.deleteDialogParagraph}
      >
        <Dialog.Content>
          <Paragraph style={styles.alertText}>
            Your post has been deleted.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => {
            deletePost(id);
            setVisible(false);
            refreshHomeScreen();
          }}
          >
            Close
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

export default function ForumPost({
  userID,
  time,
  children,
  postID,
  navigateToPostScreen,
  navigateToEditScreen,
  belongsToCurrentUser,
  refreshHomeScreen,
}) {
  const [loading, setLoading] = useState(true);
  const [numReplies, setNumReplies] = useState(0);
  const [userErrorMessage, setUserErrorMessage] = useState();

  useEffect(() => {
    firestore().collection('forum_comments').where('postID', '==', postID)
      .get()
      .then((querySnapshot) => {
        setNumReplies(querySnapshot.size);
        setLoading(false);
      })
      .catch((error) => setUserErrorMessage(error.message));
  }, [postID]);

  const [name, setName] = useState('Name unset');
  const [isAdmin, setIsAdmin] = useState(false);

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
  }, [userID]);

  const handleEdit = () => {
    // TODO: add ability to edit post if belongsToCurrentUser]
    navigateToEditScreen(postID, userID);
  };

  const [deleteWarningDialogVisible, setDeleteWarningDialogVisible] = useState(false);
  const [deleteConfirmationDialogVisible, setDeleteConfirmationDialogVisible] = useState(false);

  const handleDelete = () => {
    // Pop up confirmation
    setDeleteWarningDialogVisible(true);
  };

  const [visible, setVisible] = useState(false);

  return (
    <TouchableOpacity onPress={() => navigateToPostScreen(postID, userID)}>
      {userErrorMessage && <Text style={{ color: 'red' }}>{userErrorMessage}</Text>}
      <Card style={styles.postContainer}>
        <Card.Title
          subtitleStyle={styles.sideText}
          subtitle={isAdmin ? `${name} (PTV Staff) ${time}` : `${name} ${time}`}
          right={(props) => (belongsToCurrentUser && navigateToPostScreen && navigateToEditScreen && refreshHomeScreen
            ? (
              <Menu
                {...props}
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                  <IconButton icon="dots-horizontal" onPress={() => setVisible(true)}>Show menu</IconButton>
            }
              >
                <Menu.Item icon="pencil" onPress={() => { handleEdit(); }} title="Edit" />
                <Menu.Item icon="delete" onPress={() => { handleDelete(); }} title="Delete" />
                <DeleteDialog
                  visible={deleteWarningDialogVisible}
                  setVisible={setDeleteWarningDialogVisible}
                  confirmedDelete={setDeleteConfirmationDialogVisible}
                />
                <DeleteConfirmationDialog
                  visible={deleteConfirmationDialogVisible}
                  setVisible={setDeleteConfirmationDialogVisible}
                  id={postID}
                  refreshHomeScreen={refreshHomeScreen}
                />
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
            <Text style={styles.sideText}>
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
  navigateToPostScreen: PropTypes.func,
  navigateToEditScreen: PropTypes.func,
  refreshHomeScreen: PropTypes.func,
};


ForumPost.defaultProps = {
  navigateToPostScreen: null,
  navigateToEditScreen: null,
  refreshHomeScreen: null,
};

DeleteDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  confirmedDelete: PropTypes.func.isRequired,
};

DeleteConfirmationDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  refreshHomeScreen: PropTypes.func.isRequired,
};
