import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen, ResourcesItemScreen } from '../screens/Home';

const HomeNavigation = createStackNavigator(
  {
    HomeDefault: {
      screen: HomeScreen,
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
