import React, { useState } from 'react';
import {
  Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import {
  Card, Button, Title, IconButton, Menu, Divider,
} from 'react-native-paper';
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
  name, time, numReplies, children, navigateToPostScreen, belongsToCurrentUser,
}) {
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
          subtitle={`${name} ${time}`}
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
          <Text style={styles.text}>
            {`${numReplies} Replies`}
          </Text>
          <Button onPress={handlePress}>
            Reply
          </Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );
}

ForumPost.propTypes = {
  belongsToCurrentUser: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  numReplies: PropTypes.number.isRequired,
  children: PropTypes.string.isRequired,
  navigateToPostScreen: PropTypes.func.isRequired,
};
