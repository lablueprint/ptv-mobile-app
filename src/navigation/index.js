import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import LoadingScreen from '../screens/Loading';
import AuthNavigation from './AuthNavigation';
import AppNavigation from './AppNavigation';

const SwitchNavigator = createSwitchNavigator(
  {
    LoadingScreen,
    Auth: AuthNavigation,
    App: AppNavigation,
  },
  {
    initialRouteName: 'LoadingScreen',
  },
);

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;
