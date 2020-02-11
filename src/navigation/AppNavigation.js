import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/Profile';
import ForumNavigation from './ForumNavigation';

const AppNavigation = createMaterialBottomTabNavigator(
  {
    Home: { screen: HomeScreen },
    Forum: { screen: ForumNavigation },
    Profile: { screen: EditProfileScreen },
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
