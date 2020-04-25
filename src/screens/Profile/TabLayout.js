import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { ForumPostScreen } from '../Forum';
import MyPosts from './MyPosts';


const TabNavigator = createMaterialTopTabNavigator({
  Approved: () => <MyPosts approvalBoolean />,
  Pending: () => <MyPosts approvalBoolean={false} />,
},
{
  initialRouteName: 'Pending',
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
});


const TabNav = createStackNavigator(
  {
    PendingAppovedHome: {
      screen: TabNavigator,
    },
    ForumPost: {
      screen: ForumPostScreen,
    },
    initialRouteName: 'PendingApprovedHome',
  },
);

// StackNavigator:
// Home  TabNavigator
// Screen  We want to go to

const TabLayout = createAppContainer(TabNav);
export default TabLayout;
