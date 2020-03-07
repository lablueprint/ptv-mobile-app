import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {
  ForumHomeScreen, ForumCategoriesScreen, ForumPostScreen, ForumSubcategoryPostsScreen, 
  CreateForumPostScreen,
} from '../screens/Forum';

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
    ForumSubcategoryPosts: {
      screen: ForumSubcategoryPostsScreen,
    },
    CreateForumPost: {
      screen: CreateForumPostScreen,
    },
  },
  {
    initialRouteName: 'ForumHome',
  },
);

export default ForumNavigation;
