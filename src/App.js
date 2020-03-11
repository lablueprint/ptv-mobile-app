import React from 'react';
import { Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import AppContainer from './navigation';

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

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(fontConfig),
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppContainer />
    </PaperProvider>
  );
}
