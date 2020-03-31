import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/Profile';
import ForumNavigation from './ForumNavigation';

const AppNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
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
