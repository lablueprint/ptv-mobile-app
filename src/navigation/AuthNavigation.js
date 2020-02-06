import { createStackNavigator } from 'react-navigation-stack';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';

const AuthNavigation = createStackNavigator(
  {
    SignInScreen,
    SignUpScreen,
  },
  {
    initialRouteName: 'SignInScreen',
    headerMode: 'none',
  },
);

export default AuthNavigation;
