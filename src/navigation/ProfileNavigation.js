import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import React from 'react';
import { firebase } from '@react-native-firebase/auth';
import {
  Header, ProfileHomeScreen, EditProfileScreen, ForumNotifcationsScreen,
} from '../screens/Profile';
import { ForumPostScreen } from '../screens/Forum';
import ForumNotificationsScreen from '../screens/Profile/ForumNotificationsScreen';


// const ProfileNavigation = createStackNavigator(
//   {
//     ProfileHome: {
//       screen: ProfileHomeScreen,n
//     },
//     EditProfile: {
//       screen: EditProfileScreen,
//     },
//     ForumPost: {
//       screen: ForumPostScreen,
//     },
//   },
//   {
//     initialRouteName: 'ProfileHome',
//   },
// );

const ProfileHomeStackNavigator = createStackNavigator(
  {
    Home: {
      screen: ProfileHomeScreen,
    },
  },
);

const EditProfileScreenStackNavigator = createStackNavigator(
  {
    EditProfile: {
      screen: EditProfileScreen,
      navigationOptions: {
        header: () => (
          <Header headerTitle="Edit Profile" />
        ),
      },
    },
  },
);

const ForumPostStackNavigator = createStackNavigator(
  {
    ForumPost: {
      screen: ForumPostScreen,
      navigationOptions: {
        header: () => (
          <Header headerTitle="Forum Post" />
        ),
      },
    },
  },
);


const ProfileNavigation = createDrawerNavigator(
  {
    ProfileHome: {
      screen: ProfileHomeStackNavigator,
    },
    EditProfile: {
      screen: EditProfileScreenStackNavigator,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
    ForumPost: {
      screen: ForumPostStackNavigator,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
      },
    },
  },
  {
    initialRouteName: 'ProfileHome',
    contentComponent: ForumNotificationsScreen,
    drawerPosition: 'right',
  },
);

// const defaultGetStateForAction = ProfileNavigation.router.getStateForAction;
// ProfileNavigation.router.getStateForAction = (action, state) => {
//   if (state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerClose') {
//     const collRef = firebase.firestore().collection('profile_notifications');
//     const items = collRef.get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           const docRef = collRef.doc(doc.id);
//           docRef.update({ viewed: false });
//         });
//       });
//   }


//   return defaultGetStateForAction(action, state);
// };

export default ProfileNavigation;
