import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ProfileHomeTop from './ProfileHomeTop';
import MyPosts from './MyPosts';
import { theme } from '../../style';

const ProfileHomeScreen = createMaterialTopTabNavigator({
  Approved: () => <MyPosts approved />,
  Pending: () => <MyPosts approved={false} />,
},
{
  initialRouteName: 'Pending',
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
  navigationOptions: {
    header: () => (
      <ProfileHomeTop />
    ),
  },
  tabBarOptions: {
    activeTintColor: theme.colors.headerText,
    inactiveTintColor: theme.colors.inactiveHeader,
    labelStyle: {
      textAlign: 'center',
      fontFamily: theme.fonts.regular.fontFamily,
      fontWeight: theme.fonts.regular.fontWeight,
    },
    indicatorStyle: { backgroundColor: theme.colors.headerText },
    style: { backgroundColor: theme.colors.primary },
  },
});


export default ProfileHomeScreen;
