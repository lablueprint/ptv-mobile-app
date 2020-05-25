/* eslint-disable */
import React from 'react';
import {
  View, StyleSheet, ScrollView,
  AsyncStorage,
} from 'react-native';
import {
  Title, IconButton, ActivityIndicator, Text, Menu, Divider,
} from 'react-native-paper';
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Notification from './Notification';

const defaultNotifications = (
  <View style={{
    flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: '50%',
  }}
  >
    <IconButton
      icon="bell"
    />
    <Text>No New Notifications</Text>
  </View>
);

export default class ForumNotificationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { notifications: [], loading: true, visible: false };
    this.setNotificationsToViewed = this.setNotificationsToViewed.bind(this);
    this.setVisibleFalse = this.setVisibleFalse.bind(this);
    this.setVisibleTrue = this.setVisibleTrue.bind(this);
    this.onClearFirebaseNotifications = this.onClearFirebaseNotifications.bind(this);
    this.onClearAsyncNotifications = this.onClearAsyncNotifications.bind(this);
  }


  componentDidMount() {
    this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUserID: user.uid });
      }
    });

    this.unsubscribeFromFirestore = firestore().collection('profile_notifications')
      .orderBy('createdAt', 'desc') /* Update this to order by time approved, most to least recent */
      .onSnapshot((snapshot) => {
        const profileNotifications = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        const nonViwedNotifications = profileNotifications.filter((post) => post.viewed === false);
        const viewedNotifications = profileNotifications.filter((post) => post.viewed === true);
        const allNotifications = [...nonViwedNotifications, ...viewedNotifications];
        const { currentUserID } = this.state;


        for (let index = 0; index < allNotifications.length; index += 1) {
          const date = allNotifications[index].createdAt ? allNotifications[index].createdAt.toDate() : null;
          // console.log(allNotifications[index].createdAt.toDate());
          if (date != null) {
            allNotifications[index].createdAt = date.toString();
          }
        }

        // AsyncStorage.removeItem(currentUserID);
        // this.setState({ loading: false });

        console.log('called componentDidMount');
        // We want to add allNotifications to preexisting item
        if (allNotifications.length > 0) {
          AsyncStorage.getItem(currentUserID).then((value) => {
            if (value) {
              console.log('a');
              const storageValue = allNotifications.concat(JSON.parse(value));
              AsyncStorage.setItem(currentUserID, JSON.stringify(storageValue));
              this.onClearFirebaseNotifications();
              console.log(storageValue);
            } else {
              console.log('b');
              const storageValue = allNotifications;
              AsyncStorage.setItem(currentUserID, JSON.stringify(storageValue));
              this.onClearFirebaseNotifications();
              console.log(storageValue);
            }
          });
        }

        AsyncStorage.getItem(currentUserID).then((value) => {
          if (value) {
            console.log('c');
            console.log(value);
            const notifications = JSON.parse(value);
            // const notifications = object.map((notification) => (
            //   <Notification
            //     belongsToCurrentUser={currentUserID === notification.userID}
            //     key={notification.id}
            //             /* Pass in userID  if it exists, other pass in null */
            //     userID={notification.userID}
            //     time={notification.time}
            //     notificationID={notification.id}
            //     replies={notification.replies !== 0 ? notification.replies : null}
            //     message={notification.message}
            //     type={notification.type}
            //     viewed={notification.viewed ? notification.viewed : null}
            //     createdAt={notification.createdAt}
            //   >
            //     {notification.title}
            //   </Notification>
            // ));
            this.setState({ notifications, loading: false });
          } else {
            this.setState({ notifications: [], loading: false });
          }
        });
        // console.log(allNotifications);

        /* Line that connects everything to firestore directly */
        // ------------------------------------------------- //
        // AsyncStorage.setItem(currentUserID, JSON.stringify(allNotifications));
        // --------------------------------------------------//

        // AsyncStorage.removeItem(currentUserID);
        // console.log('start');
        // let notifications;

        // AsyncStorage.getItem(currentUserID).then((value) => {
        //   if (value && allNotifications.length > 0) {
        //     const newValue = allNotifications.concat(JSON.parse(value));
        //     AsyncStorage.setItem(currentUserID, JSON.stringify(newValue)).then(() => {
        //       this.onClearFirebaseNotifications();
        //       console.log('a');
        //     });
        //     // console.log(value);
        //   } else if (allNotifications.length > 0) {
        //     AsyncStorage.setItem(currentUserID, JSON.stringify(allNotifications)).then(() => {
        //       console.log('b');
        //       this.onClearFirebaseNotifications();
        //     });
        //   } else {
        //     console.log('c');
        //     AsyncStorage.getItem(currentUserID).then((nvalue) => {
        //       if (nvalue) {
        //         console.log('ye');
        //         const object = JSON.parse(nvalue);
        //         notifications = object.map((notification) => (
        //           <Notification
        //             belongsToCurrentUser={currentUserID === notification.userID}
        //             key={notification.id}
        //             /* Pass in userID  if it exists, other pass in null */
        //             userID={notification.userID}
        //             time={notification.time}
        //             notificationID={notification.id}
        //             replies={notification.replies !== 0 ? notification.replies : null}
        //             message={notification.message}
        //             type={notification.type}
        //             viewed={notification.viewed ? notification.viewed : null}
        //             createdAt={notification.createdAt}
        //           >
        //             {notification.title}
        //           </Notification>
        //         ));
        //       } else {
        //         notifications = (
        //           <View style={{
        //             flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: '50%',
        //           }}
        //           >
        //             <IconButton
        //               icon="bell"
        //             />
        //             <Text>No New Notifications</Text>
        //           </View>
        //         );
        //       }
        //       this.setState({ notifications, loading: false });
        //     });
        //   }
        //   this.setState({ notifications, loading: true });
        // });


        // AsyncStorage.getItem(currentUserID).then((value) => {
        //   if (value) {
        //     console.log('ye');
        //     const object = JSON.parse(value);
        //     const notifications = object.map((notification) => (
        //       <Notification
        //         belongsToCurrentUser={currentUserID === notification.userID}
        //         key={notification.id}
        //         /* Pass in userID  if it exists, other pass in null */
        //         userID={notification.userID}
        //         time={notification.time}
        //         notificationID={notification.id}
        //         replies={notification.replies !== 0 ? notification.replies : null}
        //         message={notification.message}
        //         type={notification.type}
        //         viewed={notification.viewed ? notification.viewed : null}
        //         createdAt={notification.createdAt}
        //       >
        //         {notification.title}
        //       </Notification>
        //     ));
        //     this.setState({ notifications, loading: false });
        //     console.log('hello');
        //   }
        // });
      }, (error) => { /* Error handler */
        this.setState({ errorMessage: error.message, loading: false });
      });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
    this.unsubscribeFromFirestore();
  }

  onClearFirebaseNotifications() {
    const collRef = firebase.firestore().collection('profile_notifications');
    collRef.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          /* TODO: Once replies and approve gets implemented, make docref specific to a specific person's notifications */
          const docRef = collRef.doc(doc.id);
          docRef.delete();
        });
      });
  }

  onClearAsyncNotifications() {
    const { currentUserID } = this.state;
    AsyncStorage.removeItem(currentUserID);
    this.setState({ notifications: [], loading: false });
  }

  setVisibleFalse() {
    const { visible } = this.state;
    this.setState({ visible: false });
  }


  setVisibleTrue() {
    const { visible } = this.state;
    this.setState({ visible: true });
  }

  setNotificationsToViewed() {
    const collRef = firebase.firestore().collection('profile_notifications');
    const items = collRef.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const docRef = collRef.doc(doc.id);
          docRef.update({ viewed: false });
          docRef.update({ createdAt: firestore.Timestamp.now() });
          docRef.update({ message: 'Hello World' });
          docRef.update({ type: 'reply' });
          docRef.update({ replies: 5 });
        });
      });
  }


  render() {
    const {
      loading, notifications, errorMessage, visible, currentUserID,
    } = this.state;
    return (

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
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
        <ScrollView style={{
          paddingTop: 15,
          paddingBottom: 15,
          backgroundColor: '#E6EFF5',
          flex: 1,
        }}
        >
          {loading && <ActivityIndicator /> }
          {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
          { notifications.length === 0 ? defaultNotifications
            : notifications.map((notification) => (
              <Notification
                belongsToCurrentUser={currentUserID === notification.userID}
                key={notification.id}
                        /* Pass in userID  if it exists, other pass in null */
                userID={notification.userID}
                time={notification.time}
                notificationID={notification.id}
                replies={notification.replies !== 0 ? notification.replies : null}
                message={notification.message}
                type={notification.type}
                viewed={notification.viewed ? notification.viewed : null}
                createdAt={notification.createdAt}
              >
                {notification.title}
              </Notification>
            ))}


        </ScrollView>
      </View>


    );
  }
}

const NotificationStyles = StyleSheet.create({
  headerTitle: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },

});

/* BACKUP */


// import React from 'react';
// import {
//   View, StyleSheet, ScrollView,
//   AsyncStorage,
// } from 'react-native';
// import {
//   Title, IconButton, ActivityIndicator, Text, Menu, Divider,
// } from 'react-native-paper';
// import auth, { firebase } from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import { NavigationEvents } from 'react-navigation';
// import Notification from './Notification';


// export default class ForumNotificationsScreen extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { notifications: [], loading: true, visible: false };
//     this.setNotificationsToViewed = this.setNotificationsToViewed.bind(this);
//     this.setVisibleFalse = this.setVisibleFalse.bind(this);
//     this.setVisibleTrue = this.setVisibleTrue.bind(this);
//     this.onClearFirebaseNotifications = this.onClearFirebaseNotifications.bind(this);
//   }

//   componentDidMount() {
//     this.unsubscribeFromAuth = auth().onAuthStateChanged((user) => {
//       if (user) {
//         this.setState({ currentUserID: user.uid });
//       }
//     });

//     this.unsubscribeFromFirestore = firestore().collection('profile_notifications')
//       .orderBy('createdAt', 'desc') /* Update this to order by time approved, most to least recent */
//       .onSnapshot((snapshot) => {
//         const profileNotifications = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//         const nonViwedNotifications = profileNotifications.filter((post) => post.viewed === false);
//         const viewedNotifications = profileNotifications.filter((post) => post.viewed === true);
//         const allNotifications = [...nonViwedNotifications, ...viewedNotifications];
//         const { currentUserID } = this.state;


//         // AsyncStorage.setItem(currentUserID, JSON.stringify(allNotifications));
//         // AsyncStorage.getItem(currentUserID).then((value) => {
//         //   if (value) {
//         //     console.log(value);
//         //   }
//         // });


//         // const _storeData = async () => {
//         //   try {
//         //     AsyncStorage.setItem(
//         //       currentUserID,
//         //       'I like to save it.',
//         //     );
//         //   } catch (error) {
//         //     // Error saving data
//         //   }
//         // };

//         // const _retrieveData = async () => {
//         //   try {
//         //     const value = AsyncStorage.getItem(currentUserID);
//         //     if (value !== null) {
//         //       // We have data!!
//         //       console.log(value);
//         //     }
//         //   } catch (error) {
//         //     // Error retrieving data
//         //   }
//         // };

//         const notifications = allNotifications.map((notification) => {
//           const date = notification.createdAt ? notification.createdAt.toDate() : null;
//           const time = date ? date.toTimeString() : null;

//           return (
//             <Notification
//               belongsToCurrentUser={currentUserID === notification.userID}
//               key={notification.id}
//             /* Pass in userID  if it exists, other pass in null */
//               userID={notification.userID ? notification.userID : null}
//               time={time}
//               notificationID={notification.id}
//               replies={notification.replies !== 0 ? notification.replies : null}
//               message={notification.message ? notification.message : null}
//               type={notification.type ? notification.type : null}
//               viewed={notification.viewed ? notification.viewed : null}
//             >
//               {notification.title}
//             </Notification>
//           );
//         });
//         this.setState({ notifications, loading: false });
//       }, (error) => { /* Error handler */
//         this.setState({ errorMessage: error.message, loading: false });
//       });
//   }

//   componentWillUnmount() {
//     this.unsubscribeFromAuth();
//     this.unsubscribeFromFirestore();
//   }

//   setVisibleFalse() {
//     const { visible } = this.state;
//     this.setState({ visible: false });
//   }


//   setVisibleTrue() {
//     const { visible } = this.state;
//     this.setState({ visible: true });
//   }

//   setNotificationsToViewed() {
//     const collRef = firebase.firestore().collection('profile_notifications');
//     const items = collRef.get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           const docRef = collRef.doc(doc.id);
//           docRef.update({ viewed: true });
//           // docRef.update({ createdAt: firestore.Timestamp.now() });
//           // docRef.update({ message: 'Hello World' });
//           // docRef.update({ type: 'reply' });
//           // docRef.update({ replies: 5 });
//           // docRef.update({ viewed: false });
//         });
//       });
//   }

//   onClearFirebaseNotifications() {
//     const collRef = firebase.firestore().collection('profile_notifications');
//     const items = collRef.get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           const docRef = collRef.doc(doc.id);
//           docRef.delete();
//         });
//       });
//   }

//   render() {
//     const {
//       loading, notifications, errorMessage, visible,
//     } = this.state;
//     return (

//       <View style={{ flex: 1 }}>
//         <NavigationEvents
//           onDidBlur={this.setNotificationsToViewed}
//         />
//         <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
//           <Title style={NotificationStyles.headerTitle}>Notifications</Title>
//           {/* <IconButton
//             icon="delete"
//             style={{
//               borderWidth: 1,
//               borderColor: 'rgba(0,0,0,0.2)',
//               position: 'absolute',
//               right: 10,
//               bottom: 5,
//             }}
//           /> */}
//           <Menu
//             alignSelf="flex-end"
//             visible={visible}
//             onDismiss={this.setVisibleFalse}
//             anchor={(
//               <IconButton
//                 icon="dots-vertical"
//                 onPress={this.setVisibleTrue}
//               >
//                 Show menu
//               </IconButton>
//             )}
//           >
//             <Menu.Item icon="pencil" onPress={this.setNotificationsToViewed} title="Mark All Read" />
//             <Divider />
//             <Menu.Item icon="delete" onPress={this.onClearFirebaseNotifications} title="Clear All" />
//           </Menu>
//         </View>
//         <ScrollView style={{
//           paddingTop: 15,
//           paddingBottom: 15,
//           backgroundColor: '#E6EFF5',
//           flex: 1,
//         }}
//         >
//           {/* <IconButton
//             icon="close"
//             style={{
//               borderWidth: 1,
//               borderColor: 'rgba(0,0,0,0.2)',
//               alignSelf: 'flex-end',
//             }}
//           /> */}
//           {/* <Card>
//           <Card.Title subtitle="Your Post where can I find has been approved" left={LeftContent} />
//           <Card.Content>
//             <Title>Card title</Title>
//             <View style={{
//               flexDirection: 'row',
//               justifyContent: 'flex-start',

//             }}
//             >
//               <Button icon="bell" style={{ marginRight: 0 }} />
//               <Paragraph left={LeftContent} style={{ width: '95%', fontSize: 10 }}>Your Post "Where Can I find..." has been approved. Click to go to post</Paragraph>
//             </View>
//           </Card.Content>
//           <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
//           <Card.Actions>
//             <Button style={{ width: '80%' }}>Cancel</Button>
//             <Button>Ok</Button>
//           </Card.Actions>
//         </Card> */}
//           {/* <Notification viewed={false} />
//           <Notification viewed />
//           <Notification viewed />
//           <Notification viewed />
//           <Notification viewed />
//           <Notification viewed />
//           <Notification viewed /> */}
//           {loading && <ActivityIndicator /> }
//           {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}
//           {notifications}


//         </ScrollView>
//       </View>


//     );
//   }
// }

// const NotificationStyles = StyleSheet.create({
//   headerTitle: {
//     alignSelf: 'center',
//     marginTop: 20,
//     marginBottom: 20,
//     backgroundColor: '#ffffff',
//     textAlign: 'center',
//   },

// });
