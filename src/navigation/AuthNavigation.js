import { createStackNavigator } from 'react-navigation-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
// import ForgotPassword from '../screens/ForgotPassword'

const AuthNavigation = createStackNavigator(
  {
    SignIn,
    SignUp,
    // ForgotPassword: { screen: ForgotPassword }
  },
  {
    initialRouteName: 'SignIn',
    headerMode: 'none',
  },
);

export default AuthNavigation;
