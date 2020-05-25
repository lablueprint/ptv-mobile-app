/* eslint-disable */
import React from 'react';
import {
  View, StyleSheet, AsyncStorage,
} from 'react-native';
import {
  Card,
  Button, Paragraph,
} from 'react-native-paper';
import auth, { firebase } from '@react-native-firebase/auth';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import PropTypes from 'prop-types';
import { not } from 'react-native-reanimated';


export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    const { viewed } = this.props;
    const INITIAL_STATE = {
      viewed,
    };
    this.state = INITIAL_STATE;
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

  onViewPress() {
    const { notificationID } = this.props;
    const { currentUserID } = this.state;
    AsyncStorage.getItem(currentUserID).then((value) => {
      console.log(currentUserID);
      console.log(notificationID);
      const notificationArray = JSON.parse(value);
      console.log(notificationArray);
      const notif = notificationArray.find((el) => el.id === notificationID); // Possibly returns `undefined`
      if (notif.viewed === false) {
        const updatedArray = notificationArray.filter((notif) => notif.id !== notificationID);
        console.log('YEEEEEEEEEEEEEEEE');
        console.log(updatedArray);
        console.log('YEEEEEEEEEEEEEEEE');
        notif.viewed = true;
        console.log(updatedArray);
        updatedArray.push(notif);
        console.log(updatedArray);
        AsyncStorage.setItem(currentUserID, JSON.stringify(updatedArray));
        this.setState({ viewed: true });
      }
    // value = el && el.id; // so check result is truthy and extract `id
    });
    // const el = data.find((el) => el.email === email); // Possibly returns `undefined`
    // value = el && el.id; // so check result is truthy and extract `id
    // // const user = firebase.auth().currentUser;
    // // if (user != null) {
    // //   const db = firebase.firestore();
    // //   db.collection('profile_notifications').doc(notificationID).update({ viewed: true });
    // // }
  }


  onClearPress() {
    const { notificationID } = this.props;
    firebase.firestore().collection('profile_notifications').doc(notificationID).delete();

    // const collRef = firebase.firestore().collection('profile_notifications');
    // const items = collRef.get()
    //   .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //       const docRef = collRef.doc(doc.id);
    //       docRef.update({ viewed: true });
    //     });
    //   });

    //     const { notificationID } = this.props;
    //     const user = firebase.auth().currentUser;
    //     if (user != null) {
    //       const db = firebase.firestore();
    //       db.collection('profile_notifications').doc(notificationID).update({ viewed: true });
    //     }
    // }
  }


  render() {
    const {
      message, type, replies,
    } = this.props;
    const { viewed } = this.state;
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
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Button onPress={this.onClearPress} style={{ backgroundColor: '#ffffff', marginLeft: 5 }}>Clear</Button>
        {/* <Button onPress={this.onViewPress} style={{ backgroundColor: '#ffffff', marginBottom: 10, marginLeft: 5 }}>View</Button> */}
      </View>
    );
    return (
      <View
        style={viewed ? {
          flex: 1, paddingLeft: 10, paddingRight: 10, paddingBottom: 10,
        } : {
          flex: 1, paddingBottom: 10, paddingLeft: 10, paddingRight: 10,
          // backgroundColor: '#cce6ff'
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
  Cardcontainer: {
  },
});


Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  viewed: PropTypes.bool.isRequired,
  replies: PropTypes.number.isRequired,
  notificationID: PropTypes.string.isRequired,
};


// /* Alternate Copy */
// import React from 'react';
// import {
//   View, StyleSheet,
// } from 'react-native';
// import {
//   Card,
//   Button, Paragraph,
// } from 'react-native-paper';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
// import PropTypes from 'prop-types';
// import { firebase } from '@react-native-firebase/auth';

// const INITIAL_STATE = {
//   visible: true,
// };

// export default class Notification extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = INITIAL_STATE;
//     this.onClearPress = this.onClearPress.bind(this);
//     this.onViewPress = this.onViewPress.bind(this);
//   }

//   onViewPress() {
//     const { notificationID } = this.props;
//     const user = firebase.auth().currentUser;
//     if (user != null) {
//       const db = firebase.firestore();
//       db.collection('profile_notifications').doc(notificationID).update({ viewed: true });
//     }
//   }


//   onClearPress() {
//     const { notificationID } = this.props;
//     firebase.firestore().collection('profile_notifications').doc(notificationID).delete();

//     // const collRef = firebase.firestore().collection('profile_notifications');
//     // const items = collRef.get()
//     //   .then((snapshot) => {
//     //     snapshot.forEach((doc) => {
//     //       const docRef = collRef.doc(doc.id);
//     //       docRef.update({ viewed: true });
//     //     });
//     //   });

//     //     const { notificationID } = this.props;
//     //     const user = firebase.auth().currentUser;
//     //     if (user != null) {
//     //       const db = firebase.firestore();
//     //       db.collection('profile_notifications').doc(notificationID).update({ viewed: true });
//     //     }
//     // }
//   }


//   render() {
//     const { visible } = this.state;
//     const {
//       message, type, replies, viewed,
//     } = this.props;
//     const active = viewed ? notificationStyles.inactiveNotification
//       : notificationStyles.activeNotification;
//     const replyText = ` has received ${replies} replies. Click to go to post`;
//     const approvedText = ' has been approved. Click to go to post';
//     let text;
//     if (type === 'reply') {
//       text = replyText;
//     } else if (type === 'approve') {
//       text = approvedText;
//     }
//     const RightActions = () => (
//       <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
//         <Button onPress={this.onClearPress} style={{ backgroundColor: '#ffffff', marginLeft: 5 }}>Clear</Button>
//         {/* <Button onPress={this.onViewPress} style={{ backgroundColor: '#ffffff', marginBottom: 10, marginLeft: 5 }}>View</Button> */}
//       </View>
//     );
//     return (
//       <View
//         style={viewed ? {
//           flex: 1, paddingLeft: 10, paddingRight: 10, paddingBottom: 10,
//         } : {
//           flex: 1, paddingBottom: 10, paddingLeft: 10, paddingRight: 10,
//           // backgroundColor: '#cce6ff'
//         }}
//       >

//         <Swipeable renderRightActions={RightActions} onRightActionRelease={this.onClearPress}>
//           <Card
//             style={notificationStyles.Cardcontainer}
//             onPress={this.onViewPress}
//           >
//             <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
//               <Button icon={viewed ? 'bell' : 'bell-ring'} style={{ marginRight: 0 }} color={viewed ? '#808080' : '#000000'} />
//               <Paragraph style={active}>
//                 Your Post &quot;
//                 {message}
//                 ...
//                 &quot;
//                 {text}
//               </Paragraph>
//             </View>
//           </Card>
//         </Swipeable>
//       </View>

//     );
//   }
// }

// const notificationStyles = StyleSheet.create({
//   activeNotification: {
//     fontSize: 10.5,
//     flex: 1,
//     fontWeight: 'bold',
//   },
//   inactiveNotification: {
//     fontSize: 9,
//     flex: 1,
//     color: '#808080',
//   },
//   textInput: {
//     height: 40,
//     width: '90%',
//     marginTop: 0,
//     backgroundColor: '#ffffff',
//   },
//   textInputMedium: {
//     height: 40,
//     width: '45%',
//     marginTop: 0,
//     backgroundColor: '#ffffff',
//   },
//   Cardcontainer: {
//   },
// });


// Notification.propTypes = {
//   message: PropTypes.string.isRequired,
//   type: PropTypes.string.isRequired,
//   viewed: PropTypes.bool.isRequired,
//   replies: PropTypes.number.isRequired,
//   notificationID: PropTypes.string.isRequired,
// };
