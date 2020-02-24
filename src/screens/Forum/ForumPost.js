import React from 'react';
import {
  View, Text, TouchableOpacity,
} from 'react-native';
import { Card, Button, Title } from 'react-native-paper';
import PropTypes from 'prop-types';

export default function ForumPost({
  name, time, numReplies, children,
}) {
  const handlePress = () => {
  // do something to reply
    // console.log('i have been pressed');
  };

  return (
    <Card style={{
      marginTop: '3%',
      backgroundColor: 'whitesmoke',
      width: '92%',
      alignSelf: 'center',
      borderRadius: 15,
    }}
    >
      <Card.Title style={{ color: 'blue' }} subtitle={`${name} ${time}`} />
      <Card.Content>
        <TouchableOpacity>
          <Title>
            {children}
          </Title>
        </TouchableOpacity>
      </Card.Content>
      <View style={{ width: '100%' }}>
        <Card.Actions style={{ marginHorizontal: '1%', justifyContent: 'space-between' }}>
          <TouchableOpacity>
            <Text style={{ color: 'blue' }}>
              {numReplies}
              {' '}
              Replies
            </Text>
          </TouchableOpacity>
          <Button icon="arrow-left" color="blue" onPress={handlePress}>
            Reply
          </Button>
        </Card.Actions>
      </View>
    </Card>
  );
}

ForumPost.propTypes = {
  name: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  numReplies: PropTypes.number.isRequired,
  children: PropTypes.string.isRequired,
};
