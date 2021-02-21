import { createStackNavigator } from 'react-navigation-stack';
import SignInScreen from '../screens/SignIn';
import SignUpScreen from '../screens/SignUp';
import WelcomeScreen from '../screens/WelcomeScreen';
import ForgotPasswordScreen from '../screens/ForgotPassword';
// import IntroScreen from '../screens/IntroScreen';
import JoinScreen from '../screens/JoinScreen';

const AuthNavigation = createStackNavigator(
  {
    WelcomeScreen,
    SignInScreen,
    SignUpScreen,
    ForgotPasswordScreen,
    // IntroScreen,
    JoinScreen,
  },
  {
    initialRouteName: 'WelcomeScreen',
    headerMode: 'none',
  },
);

export default AuthNavigation;
