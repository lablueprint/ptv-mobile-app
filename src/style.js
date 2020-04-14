import { StyleSheet } from 'react-native';
import { DefaultTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

export const theme = {
  ...DefaultTheme,
  roundness: 20,
  fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    primary: '#1F7FC0',
    accent: '#8EAEC3',
    background: '#E6EFF5',
    text: '#194261',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  container2: {
    /* TODO: Fix container 2 so that we can align all items inside of a container
    instead of mannually doing that in ForumHomeScreen */
    flex: 1,
    justifyContent: 'center',
    /* alignItems: 'center', */
    backgroundColor: theme.colors.background,

  },


  textInput: {
    marginTop: 0,
    height: 40,
    width: '90%',
    backgroundColor: '#ffffff',
  },
  textInputMedium: {
    height: 40,
    width: '45%',
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  button: {
    width: '90%',
    marginTop: 10,
  },
});

export default styles;
