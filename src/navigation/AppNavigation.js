import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from '../screens/Home';
import ForumNavigation from './ForumNavigation';
import ProfileNavigation from './ProfileNavigation';


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
      screen: ProfileNavigation,
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
