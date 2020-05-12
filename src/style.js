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
  scrollviewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  textInput: {
    height: 40,
    width: '90%',
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  button: {
    width: '90%',
    marginTop: 10,
  },
  signOutButton: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  resourceText: {
    fontWeight: 'bold',
  },
  subcategoryButton: {
    width: '90%',
    marginTop: 20,
  },
  subcategoryButtonHeight: {
    height: 125,
  },
  categoryScrollView: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  categoryButton: {
    aspectRatio: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  categoryButtonView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryImage: {
    width: '40%',
    aspectRatio: 1,
  },
  accordionHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  accordionHeaderText: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  accordionHeaderIcon: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  accordionContent: {
    padding: 15,
    paddingTop: 0,
    backgroundColor: '#ffffff',
  },
  moreButton: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
});

export default styles;
