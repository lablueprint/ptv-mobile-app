import React from 'react';
import {
  Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Card, Button, Title } from 'react-native-paper';
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
  name, time, numReplies, children,
}) {
  const handlePress = () => {
    // TODO: navigate to reply screen
  };

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
          <Text style={styles.text}>
            {`${numReplies} Replies`}
          </Text>
        </TouchableOpacity>
        <Button onPress={handlePress}>
          Reply
        </Button>
      </Card.Actions>
    </Card>
  );
}

ForumPost.propTypes = {
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  numReplies: PropTypes.number.isRequired,
  children: PropTypes.string.isRequired,
};
