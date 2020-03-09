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

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppContainer />
    </PaperProvider>
  );
}
