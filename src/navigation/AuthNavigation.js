import { createStackNavigator } from 'react-navigation-stack';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import ForgotPasswordScreen from '../screens/ForgotPassword';

const AuthNavigation = createStackNavigator(
  {
    SignInScreen,
    SignUpScreen,
    ForgotPasswordScreen,
  },
  {
    initialRouteName: 'SignInScreen',
    headerMode: 'none',
  },
);

export default AuthNavigation;
