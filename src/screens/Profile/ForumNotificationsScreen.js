import React from 'react';
import {
  View, StyleSheet, ScrollView,
  AsyncStorage,
} from 'react-native';
import {
  Title, IconButton, ActivityIndicator, Text, Menu, Divider,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncLock from 'async-lock';
import Notification from './Notification';
import DefaultNotifications from './DefaultNotifications';

export default class ForumNotificationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [], loading: true, visible: false };
    this.setNotificationsToViewed = this.setNotificationsToViewed.bind(this);
    this.setVisibleFalse = this.setVisibleFalse.bind(this);
    this.setVisibleTrue = this.setVisibleTrue.bind(this);
    this.onClearAsyncNotifications = this.onClearAsyncNotifications.bind(this);
    this.lock = new AsyncLock();
  }

  componentDidMount() {
    /* TODO: Make each notification connected to the userID for who it should be sent to */
    this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUserID: user.uid });
      }
    });

    this.unsubscribeFromFirestore = firestore().collection('profile_notifications')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const newNotificationsSnapshot = snapshot.docChanges().filter((change) => change.type === 'added');
        const newNotificationDocs = newNotificationsSnapshot.map((change) => change.doc);
        const allNotifications = newNotificationDocs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const { currentUserID } = this.state;


        for (let index = 0; index < allNotifications.length; index += 1) {
          const date = allNotifications[index].createdAt
            ? allNotifications[index].createdAt.toDate() : null;
          if (date != null) {
            allNotifications[index].createdAt = date.toString();
          }
        }
        if (allNotifications.length > 0) {
          this.lock.acquire(currentUserID, async () => {
            await AsyncStorage.getItem(currentUserID).then(async (value) => {
              if (value) {
                const storageValue = allNotifications.concat(JSON.parse(value));
                await AsyncStorage.setItem(currentUserID, JSON.stringify(storageValue));
                const newNotificationDocRefs = newNotificationsSnapshot.map(
                  (change) => change.doc.ref,
                );
                newNotificationDocRefs.forEach((docRef) => docRef.delete());
              } else {
                const storageValue = allNotifications;
                await AsyncStorage.setItem(currentUserID, JSON.stringify(storageValue));
                const newNotificationDocRefs = newNotificationsSnapshot.map(
                  (change) => change.doc.ref,
                );
                newNotificationDocRefs.forEach((docRef) => docRef.delete());
              }
            });
          }, (err) => {
            this.setState({ errorMessage: err, loading: false });
          });
        }

        AsyncStorage.getItem(currentUserID).then(async (value) => {
          if (value) {
            const notifications = JSON.parse(value);
            this.setState({ notifications, loading: false });
          } else {
            this.setState({ notifications: [], loading: false });
          }
        });
      }, (error) => { /* Error handler */
        this.setState({ errorMessage: error.message, loading: false });
      });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
    this.unsubscribeFromFirestore();
  }

  async onClearAsyncNotifications() {
    const { currentUserID } = this.state;
    await AsyncStorage.removeItem(currentUserID);
    this.setState({ notifications: [], loading: false });
    this.setVisibleFalse();
  }

  setVisibleFalse() {
    this.setState({ visible: false });
  }

  setVisibleTrue() {
    this.setState({ visible: true });
  }

  async setNotificationsToViewed() {
    const { currentUserID } = this.state;
    this.setVisibleFalse();
    await AsyncStorage.getItem(currentUserID).then((value) => {
      const notificationArray = JSON.parse(value);
      if (notificationArray.length !== 0) {
        for (let i = 0; i < notificationArray.length; i += 1) {
          notificationArray[i].viewed = true;
        }
        AsyncStorage.setItem(currentUserID, JSON.stringify(notificationArray));
        this.setState({ notifications: [] });
        this.setState({ notifications: notificationArray });
      }
    });
  }

  render() {
    const {
      loading, notifications, errorMessage, visible, currentUserID,
    } = this.state;
    return (
      /* TODO: Find way to make Notifcation Top a separate component */
      <View style={NotificationStyles.container}>
        <View style={NotificationStyles.headerContainer}>
          <Title style={NotificationStyles.headerTitle}>Notifications</Title>
          <Menu
            alignSelf="flex-end"
            visible={visible}
            onDismiss={this.setVisibleFalse}
            anchor={(
              <IconButton
                icon="dots-vertical"
                onPress={this.setVisibleTrue}
              >
                Show menu
              </IconButton>
)}
          >
            <Menu.Item icon="pencil" onPress={this.setNotificationsToViewed} title="Mark All Read" />
            <Divider />
            <Menu.Item icon="delete" onPress={this.onClearAsyncNotifications} title="Clear All" />
          </Menu>
        </View>
        <ScrollView style={NotificationStyles.scrollContainer}>
          {loading && <ActivityIndicator /> }
          {errorMessage && <Text style={NotificationStyles.errorMessage}>{errorMessage}</Text>}
          { notifications.length === 0 ? <DefaultNotifications />
            : notifications.map((notification) => (
              <Notification
                belongsToCurrentUser={currentUserID === notification.userID}
                key={notification.id}
                        /* TODO: Incorporate userID */
                userID={notification.userID}
                notificationID={notification.id}
                replies={notification.replies !== 0 ? notification.replies : null}
                message={notification.message}
                type={notification.type}
                viewed={notification.viewed ? notification.viewed : null}
                createdAt={notification.createdAt}
              />
            ))}
        </ScrollView>
      </View>
    );
  }
}

const NotificationStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#E6EFF5',
    flex: 1,
  },
  errorMessage: {
    color: 'red',
  },
});
