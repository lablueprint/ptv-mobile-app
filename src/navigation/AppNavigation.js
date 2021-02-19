import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import ProfileNavigation from './ProfileNavigation';
import ForumNavigation from './ForumNavigation';
import HomeNavigation from './HomeNavigation';
import EventsNavigation from './EventsNavigation';
import forumIcon from '../assets/Icons/Forum.png';
import homeIcon from '../assets/Icons/Home.png';
import personIcon from '../assets/Icons/Person.png';
import { theme } from '../style';

const AppNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigation,
      navigationOptions: () => ({
        tabBarIcon: () => (
          <Image style={{ width: 20, height: 20 }} source={homeIcon} />
        ),
      }),
    },
    Forum: {
      screen: ForumNavigation,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.routes[navigation.state.index].routeName !== 'ForumPost',
        tabBarIcon: () => (
          <Image style={{ width: 20, height: 20 }} source={forumIcon} />
        ),
      }),
    },
    Events: {
      screen: EventsNavigation,
    },

    Profile: {
      screen: ProfileNavigation,
      navigationOptions: () => ({
        tabBarIcon: () => (
          <Image style={{ width: 20, height: 20 }} source={personIcon} />
        ),
      }),
    },
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: theme.colors.headerText,
      inactiveTintColor: theme.colors.inactiveHeader,
      labelStyle: {
        textAlign: 'center',
        fontFamily: theme.fonts.regular.fontFamily,
        fontWeight: theme.fonts.regular.fontWeight,
      },
      indicatorStyle: {
        backgroundColor: theme.colors.headerText,
        height: '9%',
      },
      style: { backgroundColor: theme.colors.primary },
    },
  },
);

export default AppNavigation;
