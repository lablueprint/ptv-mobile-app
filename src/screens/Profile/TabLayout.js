import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ApprovedPosts from './ApprovedPosts';
import PendingPosts from './PendingPosts';

const TabNavigator = createMaterialTopTabNavigator({
  Approved: ApprovedPosts,
  Pending: PendingPosts,
},
{
  initialRouteName: 'Pending',
  tabBarOptions: {
    style: {
    },
  },
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,

});

const TabLayout = createAppContainer(TabNavigator);
export default TabLayout;
