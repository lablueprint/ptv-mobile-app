import { createBottomTabNavigator } from 'react-navigation-tabs';
import ProfileNavigation from './ProfileNavigation';
import ForumNavigation from './ForumNavigation';
import HomeNavigation from './HomeNavigation';
import EventsNavigation from './EventsNavigation';

const AppNavigation = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigation,
    },
    Forum: {
      screen: ForumNavigation,
      navigationOptions: ({ navigation }) => ({
        tabBarVisible: navigation.state.routes[navigation.state.index].routeName !== 'ForumPost',
      }),
    },
    Events: {
      screen: EventsNavigation,
    },

    Profile: {
      screen: ProfileNavigation,
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default AppNavigation;
