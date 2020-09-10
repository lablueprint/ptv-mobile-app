import { StyleSheet } from 'react-native';
import { DefaultTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
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
    primary: '#0F7AC3', // header background
    headerText: '#FFFFFF',
    inactiveHeader: '#E4F2FC',
    background: '#E6EFF5', // light blue secondary background for categories, etc
    text: '#194261', // post main text
    accent: '#5A7A8F', // accents and post side text
    postBackground: '#FFFFFF',
    extendedBackground: '#D8E5EE', // replies bg, slightly darker than secondary bg

    alertText: '#242424', // dialog pop-ups, alerts
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  textInput: {
    height: 40,
    width: '90%',
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
});

export default styles;
