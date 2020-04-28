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
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#A7D4F4',
      labelStyle: {
        textAlign: 'center',
        fontFamily: theme.fonts.regular.fontFamily,
        fontWeight: theme.fonts.regular.fontWeight,
      },
      indicatorStyle: { backgroundColor: '#FFFFFF' },
      style: { backgroundColor: theme.colors.primary },
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
      navigationOptions: ({ navigation }) => ({
        // title passed in from ForumSubcategoryPostsScreen
        title: `${navigation.state.params.subcategoryName}`,
      }),
    },
    CreateForumPost: {
      screen: CreateForumPostScreen,
      navigationOptions: () => ({ title: 'New Post' }),
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: '#FFFFFF', // #FFFFFF not in theme colours
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: theme.fonts.regular.fontFamily,
        fontWeight: theme.fonts.regular.fontWeight,
      },
    },
  },
  {
    initialRouteName: 'ForumHome',
  },
);

export default ForumNavigation;
