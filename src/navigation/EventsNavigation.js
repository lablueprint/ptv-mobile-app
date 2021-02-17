import { createStackNavigator } from 'react-navigation-stack';
import EventsHomeScreen from '../screens/Events';
import { theme } from '../style';

const EventsNavigation = createStackNavigator(
  {
    EventsHome: {
      screen: EventsHomeScreen,
      navigationOptions: () => ({ title: 'Events' }),
    },
   
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: theme.colors.primary,
        /* Gets rid of line btw Home and All Posts/Category headers */
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
      },
      headerTintColor: theme.colors.headerText,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: theme.fonts.regular.fontFamily,
        fontWeight: theme.fonts.regular.fontWeight,
      },
    },
  },
  {
    initialRouteName: 'EventsHome',
  },
);


export default EventsNavigation;
