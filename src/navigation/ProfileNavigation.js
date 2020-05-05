import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import React from 'react';
import {
  Header, ProfileHomeScreen, EditProfileScreen,
} from '../screens/Profile';
import { ForumPostScreen } from '../screens/Forum';


// const ProfileNavigation = createStackNavigator(
//   {
//     ProfileHome: {
//       screen: ProfileHomeScreen,
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
          <Header headerTitle="Edit Profile" backDestination="ProfileHome" />
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
          <Header headerTitle="Forum Post" backDestination="ProfileHome" />
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
    contentComponent: EditProfileScreen,
    drawerPosition: 'right',
  },
);

export default ProfileNavigation;
