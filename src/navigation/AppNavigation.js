import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import HomeScreen from '../screens/Home';
import EditProfileScreen from '../screens/Profile';

const AppNavigation = createMaterialBottomTabNavigator(
  {
    HomeScreen,
    EditProfileScreen,
  },
  {
    initialRouteName: 'HomeScreen',
  },
);

export default AppNavigation;
