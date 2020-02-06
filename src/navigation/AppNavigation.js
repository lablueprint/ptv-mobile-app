import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/Profile';

const AppNavigation = createStackNavigator(
  {
    HomeScreen,
    EditProfileScreen,
  },
  {
    initialRouteName: 'HomeScreen',
  },
);

export default AppNavigation;
