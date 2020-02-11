import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { ForumHomeScreen, ForumCategoriesScreen, ForumPostScreen } from '../screens/Forum';

const ForumHomeTopTabNavigation = createMaterialTopTabNavigator(
  {
    ForumHome: {
      screen: ForumHomeScreen,
    },
    ForumCategories: {
      screen: ForumCategoriesScreen,
    },
  },
);

const ForumNavigation = createStackNavigator(
  {
    ForumHome: {
      screen: ForumHomeTopTabNavigation,
    },
    ForumPost: {
      screen: ForumPostScreen,
    },
  },
  {
    initialRouteName: 'ForumHome',
  },
);

export default ForumNavigation;
