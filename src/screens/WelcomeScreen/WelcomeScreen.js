import React from 'react';
import {
  View, StyleSheet, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-paper';
import logo from './logo.png';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={WelcomeScreenStyles.container}>
      <Image
        source={logo}
      />
      <Button
        style={WelcomeScreenStyles.button}
        mode="contained"
        onPress={() => navigation.navigate('JoinScreen')}
      >
        Get started
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('SignUpScreen')}
      >
        Already have an account? Sign in
      </Button>
    </View>
  );
}


const WelcomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    height: 40,
    width: '90%',
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  button: {
    width: '70%',
    marginTop: 200,
  },
});

WelcomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
