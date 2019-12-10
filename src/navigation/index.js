  
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import Landing from '../screens/Landing'
import AuthNavigation from './AuthNavigation'
import AppNavigation from './AppNavigation'

const SwitchNavigator = createSwitchNavigator(
  {
    Landing: Landing,
    Auth: AuthNavigation,
    App: AppNavigation
  },
  {
    initialRouteName: 'Landing'
  }
)

const AppContainer = createAppContainer(SwitchNavigator)

export default AppContainer