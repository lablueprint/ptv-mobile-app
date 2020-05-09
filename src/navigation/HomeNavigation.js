import { createStackNavigator } from 'react-navigation-stack';
import {
  HomeScreen, ResourcesItemScreen, ResourcesSubcategoriesScreen, ResourcesItemListScreen,
} from '../screens/Resources';

const HomeNavigation = createStackNavigator(
  {
    HomeDefault: {
      screen: HomeScreen,
      navigationOptions: () => ({
        headerTitle: 'Resources',
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
  },
);

export default HomeNavigation;
