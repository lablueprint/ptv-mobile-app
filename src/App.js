import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from './navigation';
import { theme } from './style';


export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppContainer />
    </PaperProvider>
  );
}
