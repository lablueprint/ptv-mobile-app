import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ProfileHomeTop from './ProfileHomeTop';
import MyPosts from './MyPosts';


const ProfileHomeScreen = createMaterialTopTabNavigator({
  Approved: () => <MyPosts approvalBoolean />,
  Pending: () => <MyPosts approvalBoolean={false} />,
},
{
  initialRouteName: 'Pending',
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
  navigationOptions: {
    header: ProfileHomeTop,
  },
});


export default ProfileHomeScreen;
