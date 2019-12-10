import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Home'
import Resources from '../screens/Resources'

const AppNavigation = createStackNavigator(
  {
    Home: Home,
    Resources: Resources,
  },
  {
    initialRouteName: 'Resources'
  }
)

export default AppNavigation