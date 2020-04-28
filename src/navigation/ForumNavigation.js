import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import {
  ForumHomeScreen, ForumCategoriesScreen, ForumPostScreen, ForumSubcategoryPostsScreen,
  CreateForumPostScreen,
} from '../screens/Forum';
import { theme } from '../style';

const ForumHomeTopTabNavigation = createMaterialTopTabNavigator(
  {
    ForumHome: {
      screen: ForumHomeScreen,
      navigationOptions: () => ({
        title: 'All Posts',
      }),
    },
    ForumCategories: {
      screen: ForumCategoriesScreen,
      navigationOptions: () => ({
        title: 'Categories',
      }),
    },
  },
  {
    defaultNavigationOptions: {
    },
  },
);

const ForumNavigation = createStackNavigator(
  {
    ForumHome: {
      screen: ForumHomeTopTabNavigation,
      navigationOptions: () => ({ title: 'Home' }),
    },
    ForumPost: {
      screen: ForumPostScreen,
      navigationOptions: () => ({ title: 'Post' }),
    },
    ForumSubcategoryPosts: {
      screen: ForumSubcategoryPostsScreen,
      navigationOptions: () => ({ title: 'Category' }),
    },
    CreateForumPost: {
      screen: CreateForumPostScreen,
      navigationOptions: () => ({ title: 'New Post' }),
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#3190D0',
      },
      headerTintColor: '#FFFFFF',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        /* Change these to match theme */
        fontFamily: theme.fonts.regular.fontFamily,
        fontWeight: '600',
        fontSize: 20,
      },
    },
  },
  {
    initialRouteName: 'ForumHome',
  },
);

export default ForumNavigation;
