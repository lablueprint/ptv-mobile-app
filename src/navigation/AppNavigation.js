import { createStackNavigator } from 'react-navigation-stack';
import Home from '../screens/Home';
import EditProfile from '../screens/EditProfile';

const AppNavigation = createStackNavigator(
  {
    Home,
    EditProfile,
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
