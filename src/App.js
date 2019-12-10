/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */

// import React, { Component } from 'react';
// import { Platform, StyleSheet, Image, Text, View } from 'react-native';
// import { createSwitchNavigator, createAppContainer } from 'react-navigation';
// import Loading from './components/Pages/Loading';
// import SignUp from './components/Pages/SignUp';
// import Login from './components/Pages/Login';
// import Main from './components/Pages/Main';

// import firebase from '@react-native-firebase/app';

/////////////////////////////////////////////////////////////
// Raymond Changes
/////////////////////////////////////////////////////////////
 
import React from 'react'
import AppContainer from './navigation'
import Firebase, { FirebaseProvider } from './config/Firebase'

export default function App() {
  return (
    <FirebaseProvider value={Firebase}>
      <AppContainer />
    </FirebaseProvider>
  )
}

/////////////////////////////////////////////////////////////


// TODO(you): import any additional firebase services that you require for your app, e.g for auth:
//    1) install the npm package: `yarn add @react-native-firebase/auth@alpha` - you do not need to
//       run linking commands - this happens automatically at build time now
//    2) rebuild your app via `yarn run run:android` or `yarn run run:ios`
//    3) import the package here in your JavaScript code: `import '@react-native-firebase/auth';`
//    4) The Firebase Auth service is now available to use here: `firebase.auth().currentUser`

// export default createAppContainer(
//   createSwitchNavigator({
//     Loading,
//     SignUp,
//     Login,
//     Main
//   },
//   {
//   initialRouteName: 'Loading'
//   }
// ));