import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { Card, Button, Paragraph } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import PropTypes from 'prop-types';

export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    const { viewed } = this.props;
    this.state = { viewed, visible: true };
    this.onClearPress = this.onClearPress.bind(this);
    this.onViewPress = this.onViewPress.bind(this);
  }

  componentDidMount() {
    this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUserID: user.uid });
      }
    });
  }

  async onViewPress() {
    const { notificationID } = this.props;
    const { currentUserID } = this.state;
    await AsyncStorage.getItem(currentUserID).then((value) => {
      const notificationArray = JSON.parse(value);
      const notif = notificationArray.find((el) => el.id === notificationID);
      if (notif.viewed === false) {
        const updatedArray = notificationArray.filter((val) => val.id !== notificationID);
        notif.viewed = true;
        updatedArray.push(notif);
        AsyncStorage.setItem(currentUserID, JSON.stringify(updatedArray));
        this.setState({ viewed: true });
      }
    });
  }

  async onClearPress() {
    const { notificationID } = this.props;
    const { currentUserID } = this.state;
    await AsyncStorage.getItem(currentUserID).then(async (value) => {
      if (value) {
        const notificationArray = JSON.parse(value);
        const updatedArray = notificationArray.filter((val) => val.id !== notificationID);
        await AsyncStorage.setItem(currentUserID, JSON.stringify(updatedArray));
        this.setState({ visible: false });
      }
    });
  }

  render() {
    const { message, type, replies } = this.props;
    const { viewed, visible } = this.state;
    const active = viewed ? notificationStyles.inactiveNotification
      : notificationStyles.activeNotification;
    const replyText = ` has received ${replies} replies. Click to go to post`;
    const approvedText = ' has been approved. Click to go to post';
    let text;
    if (type === 'reply') {
      text = replyText;
    } else if (type === 'approve') {
      text = approvedText;
    }
    const RightActions = () => (
      <View style={notificationStyles.rightSwipeable}>
        <Button onPress={this.onClearPress} style={{ backgroundColor: '#ffffff', marginLeft: 5 }}>Clear</Button>
      </View>
    );
    return (
      visible && (
      <View
        style={{
          flex: 1, paddingLeft: 10, paddingRight: 10, paddingBottom: 10,
        }}
      >
        <Swipeable renderRightActions={RightActions} onRightActionRelease={this.onClearPress}>
          <Card
            style={notificationStyles.Cardcontainer}
            onPress={this.onViewPress}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Button icon={viewed ? 'bell' : 'bell-ring'} style={{ marginRight: 0 }} color={viewed ? '#808080' : '#000000'} />
              <Paragraph style={active}>
                Your Post &quot;
                {message}
                ...
                &quot;
                {text}
              </Paragraph>
            </View>
          </Card>
        </Swipeable>
      </View>
      )

    );
  }
}

const notificationStyles = StyleSheet.create({
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
});

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  viewed: PropTypes.bool.isRequired,
  replies: PropTypes.number.isRequired,
  notificationID: PropTypes.string.isRequired,
};
