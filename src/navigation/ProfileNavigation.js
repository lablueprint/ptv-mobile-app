import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import React from 'react';
import {
  Header, ProfileHomeScreen, EditProfileScreen,
} from '../screens/Profile';
import { ForumPostScreen } from '../screens/Forum';
import ForumNotificationsScreen from '../screens/Profile/ForumNotificationsScreen';

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
export default ProfileNavigation;
