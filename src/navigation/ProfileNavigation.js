
import { createStackNavigator } from 'react-navigation-stack';
import {
  ProfileHomeScreen, EditProfileScreen,
} from '../screens/Profile';

const ProfileNavigation = createStackNavigator(
  {
    ProfileHome: {
      screen: ProfileHomeScreen,
    },
    EditProfile: {
      screen: EditProfileScreen,
    },
  },
  {
    initialRouteName: 'ProfileHome',
  },
);


export default ProfileNavigation;
