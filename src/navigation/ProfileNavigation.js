import { createStackNavigator } from 'react-navigation-stack';
import {
  ProfileHomeScreen, EditProfileScreen,
} from '../screens/Profile';
import { ForumPostScreen } from '../screens/Forum';

const ProfileNavigation = createStackNavigator(
  {
    ProfileHome: {
      screen: ProfileHomeScreen,
    },
    EditProfile: {
      screen: EditProfileScreen,
    },
    ForumPost: {
      screen: ForumPostScreen,
    },
  },
  {
    initialRouteName: 'ProfileHome',
  },
);

export default ProfileNavigation;
