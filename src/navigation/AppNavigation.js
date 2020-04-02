import { createBottomTabNavigator } from 'react-navigation-tabs';
import EditProfileScreen from '../screens/Profile';
import ForumNavigation from './ForumNavigation';
import HomeNavigation from './HomeNavigation';

const AppNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigation,
    },
    Forum: {
      screen: ForumNavigation,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.routes[navigation.state.index].routeName !== 'ForumPost',
      }),
    },
    Profile: {
      screen: EditProfileScreen,
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
