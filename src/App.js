import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import AppContainer from './navigation';
import { theme } from './style';

export default function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => auth().onAuthStateChanged(() => {
    setAuthLoading(false);
  }), []);

  return (
    <PaperProvider theme={theme}>
      {!authLoading && <AppContainer />}
    </PaperProvider>
  );
}
