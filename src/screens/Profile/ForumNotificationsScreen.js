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
import { theme } from '../../style';

export default class ForumNotificationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [], loading: true, visible: false };
    this.setNotificationsToViewed = this.setNotificationsToViewed.bind(this);
    this.setButtonVisibleFalse = this.setButtonVisibleFalse.bind(this);
    this.setButtonVisibleTrue = this.setButtonVisibleTrue.bind(this);
    this.onClearAsyncNotifications = this.onClearAsyncNotifications.bind(this);
    this.onViewPress = this.onViewPress.bind(this);
    this.onClearPress = this.onClearPress.bind(this);
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
      .onSnapshot(async (snapshot) => {
        const newNotificationsSnapshot = snapshot.docChanges().filter((change) => change.type === 'added');
        const newNotificationDocs = newNotificationsSnapshot.map((change) => change.doc);
        const filledNotifications = newNotificationDocs.map(
          (doc) => ({ ...doc.data(), id: doc.id }),
        );
        const { currentUserID } = this.state;

        /* Timestamps lose their toDate method when we store them in AsyncStorage,
        so we include it now */
        const newNotifications = filledNotifications.map((notification) => {
          const finalNotification = notification;
          const date = notification.createdAt
            ? notification.createdAt.toDate() : null;
          if (date != null) {
            finalNotification.createdAt = date;
          }
          return finalNotification;
        });

        this.lock.acquire(currentUserID, async () => {
          const prevNotifications = await AsyncStorage.getItem(currentUserID);
          const allNotifications = prevNotifications
            ? newNotifications.concat(JSON.parse(prevNotifications)) : newNotifications;

          if (allNotifications) {
            /* Sorts all of our notifications so unviewed notifications appear first */
            const unviewedNotifications = allNotifications.filter(
              (notification) => notification.viewed === false,
            );
            const viewedNotifications = allNotifications.filter(
              (notification) => notification.viewed === true,
            );
            const allSortedNotifications = [...unviewedNotifications, ...viewedNotifications];
            await AsyncStorage.setItem(currentUserID, JSON.stringify(allSortedNotifications));
            const newNotificationDocRefs = newNotificationsSnapshot.map(
              (change) => change.doc.ref,
            );
            const batch = firestore().batch();
            newNotificationDocRefs.forEach((docRef) => batch.delete(docRef));
            batch.commit();
            this.setState({ notifications: allSortedNotifications, loading: false });
          } else {
            this.setState({ notifications: [], loading: false });
          }
        }).catch((err) => {
          this.setState({ errorMessage: err, loading: false });
        });
      }, (error) => {
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
    this.setButtonVisibleFalse();
  }

  async onViewPress(notificationID) {
    const { currentUserID, notifications } = this.state;
    const matchNotificationID = (element) => element.id === notificationID;
    const index = notifications.findIndex(matchNotificationID);
    if (index > -1) {
      notifications[index].viewed = true;
      await AsyncStorage.setItem(currentUserID, JSON.stringify(notifications));
      this.setState({ notifications });
    }
  }

  async onClearPress(notificationID) {
    const { currentUserID, notifications } = this.state;
    const matchNotificationID = (element) => element.id === notificationID;
    const index = notifications.findIndex(matchNotificationID);
    if (index > -1) {
      notifications.splice(index, 1);
    }
    await AsyncStorage.setItem(currentUserID, JSON.stringify(notifications));
    this.setState({ notifications });
  }

  async setNotificationsToViewed() {
    const { currentUserID, notifications } = this.state;
    const viewedNotifications = notifications.map((notification) => {
      const finalNotification = notification;
      finalNotification.viewed = true;
      return finalNotification;
    });
    await AsyncStorage.setItem(currentUserID, JSON.stringify(viewedNotifications));
    this.setState({ notifications: viewedNotifications });
    this.setButtonVisibleFalse();
  }

  setButtonVisibleFalse() {
    this.setState({ visible: false });
  }

  setButtonVisibleTrue() {
    this.setState({ visible: true });
  }

  render() {
    const {
      loading, notifications, errorMessage, visible, currentUserID,
    } = this.state;
    return (
      <View style={notificationStyles.container}>
        <View style={notificationStyles.headerContainer}>
          <Title style={notificationStyles.headerTitle}>Notifications</Title>
          <Menu
            visible={visible}
            onDismiss={this.setButtonVisibleFalse}
            anchor={(
              <IconButton
                style={notificationStyles.menuButton}
                icon="dots-vertical"
                color="#ffffff"
                onPress={this.setButtonVisibleTrue}
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
        <ScrollView style={notificationStyles.scrollContainer}>
          {loading && <ActivityIndicator /> }
          {errorMessage && <Text style={notificationStyles.errorMessage}>{errorMessage}</Text>}
          { notifications.length === 0 ? !loading && (<DefaultNotifications />)
            : notifications.map((notification) => (
              <Notification
                belongsToCurrentUser={currentUserID === notification.userID}
                key={notification.id}
                viewPress={this.onViewPress}
                clearPress={this.onClearPress}
                userID={notification.userID}
                notificationID={notification.id}
                replies={notification.replies !== 0 ? notification.replies : null}
                postTitle={notification.message}
                type={notification.type}
                viewed={notification.viewed}
                createdAt={notification.createdAt}
              />
            ))}
        </ScrollView>
      </View>
    );
  }
}

const notificationStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    alignSelf: 'center',
    marginLeft: 45,
    marginTop: 20,
    marginBottom: 20,
    color: theme.colors.headerText,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
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
  menuButton: {
    marginTop: 13,
  },
});
