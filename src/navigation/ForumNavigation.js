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
      activeTintColor: theme.colors.headerText,
      inactiveTintColor: theme.colors.inactiveHeader,
      labelStyle: {
        textAlign: 'center',
        fontFamily: theme.fonts.regular.fontFamily,
        fontWeight: theme.fonts.regular.fontWeight,
      },
      indicatorStyle: {
        backgroundColor: theme.colors.headerText,
        height: 5,
      },
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
        /* Gets rid of line btw Home and All Posts/Category headers */
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
      },
      headerTintColor: theme.colors.headerText,
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
