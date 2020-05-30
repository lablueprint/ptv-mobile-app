import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Button, Paragraph } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import PropTypes from 'prop-types';

export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    const { postTitle, replies } = this.props;
    this.onClearPress = this.onClearPress.bind(this);
    this.onViewPress = this.onViewPress.bind(this);
    this.notificationDescriptions = {
      reply: `Your post '${postTitle}' has recieved ${replies} replies. Click to go to post.`,
      approve: `Your post '${postTitle}' has been approved. Click to go to post.`,
    };
  }

  onViewPress() {
    const { notificationID, viewPress } = this.props;
    viewPress(notificationID);
  }

  onClearPress() {
    const { notificationID, clearPress } = this.props;
    clearPress(notificationID);
  }

  render() {
    const { type, viewed } = this.props;
    const viewStatus = viewed ? notificationStyles.inactiveNotification
      : notificationStyles.activeNotification;
    const notificationDescription = this.notificationDescriptions[type];
    const RightActions = () => (
      <View style={notificationStyles.rightSwipeable}>
        <Button onPress={this.onClearPress} style={notificationStyles.clearButton}>Clear</Button>
      </View>
    );
    return (
      <View
        style={notificationStyles.container}
      >
        <Swipeable renderRightActions={RightActions}>
          <Card
            onPress={this.onViewPress}
          >
            <View style={notificationStyles.notificationCard}>
              <Button icon={viewed ? 'bell' : 'bell-ring'} color={viewed ? '#808080' : '#000000'} />
              <Paragraph style={viewStatus}>
                {notificationDescription}
              </Paragraph>
            </View>
          </Card>
        </Swipeable>
      </View>
    );
  }
}

const notificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  activeNotification: {
    fontSize: 10.5,
    flex: 1,
    fontWeight: 'bold',
  },
  inactiveNotification: {
    fontSize: 9,
    flex: 1,
    color: '#808080',
  },
  textInput: {
    height: 40,
    width: '90%',
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  textInputMedium: {
    height: 40,
    width: '45%',
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  rightSwipeable: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  clearButton: {
    backgroundColor: '#ffffff',
    marginLeft: 5,
  },
});

Notification.propTypes = {
  postTitle: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  viewed: PropTypes.bool.isRequired,
  replies: PropTypes.number.isRequired,
  notificationID: PropTypes.string.isRequired,
  viewPress: PropTypes.func.isRequired,
  clearPress: PropTypes.func.isRequired,
};
