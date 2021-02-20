import { createStackNavigator } from 'react-navigation-stack';
import {
  HomeScreen, ResourcesItemScreen, ResourcesSubcategoriesScreen, ResourcesItemListScreen,
} from '../screens/Resources';
import { theme } from '../style';

const HomeNavigation = createStackNavigator(
  {
    HomeDefault: {
      screen: HomeScreen,
      navigationOptions: () => ({
        headerTitle: 'Resources',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleStyle: {
          textAlign: 'center',
          fontFamily: theme.fonts.regular.fontFamily,
          fontWeight: theme.fonts.regular.fontWeight,
        },
      }),
    },
    ResourcesSubcategories: {
      screen: ResourcesSubcategoriesScreen,
    },
    ResourcesItemList: {
      screen: ResourcesItemListScreen,
    },
    ResourcesItem: {
      screen: ResourcesItemScreen,
      navigationOptions: () => ({
        headerTitle: '',
        headerTransparent: true,
        headerStyle: {
          borderBottomWidth: 0,
        },
      }),
    },
  },
  {
    initialRouteName: 'HomeDefault',
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

export default HomeNavigation;
