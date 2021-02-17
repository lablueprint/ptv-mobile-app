import { createBottomTabNavigator } from 'react-navigation-tabs';
import ProfileNavigation from './ProfileNavigation';
import ForumNavigation from './ForumNavigation';
import HomeNavigation from './HomeNavigation';
import { theme } from '../style';

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
    Profile: {
      screen: ProfileNavigation,
    },
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: theme.colors.headerText,
      inactiveTintColor: theme.colors.inactiveHeader,
      labelStyle: {
        textAlign: 'center',
        fontFamily: theme.fonts.regular.fontFamily,
        fontWeight: theme.fonts.regular.fontWeight,
      },
      indicatorStyle: {
        backgroundColor: theme.colors.headerText,
        height: '9%',
      },
      style: { backgroundColor: theme.colors.primary },
    },
  },
);

export default AppNavigation;
