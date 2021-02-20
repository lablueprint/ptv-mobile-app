import React from 'react';
import {
  View, StyleSheet, Image,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Text, Button,
} from 'react-native-paper';
import community from './community.png';

export default function JoinScreen({ navigation }) {
  return (
    <View style={JoinScreenStyles.container}>

      <Text style={JoinScreenStyles.textInput}>Join the community </Text>
      <Image
        style={JoinScreenStyles.Image}
        source={community}
      />

      <Button
        style={JoinScreenStyles.button}
        mode="contained"
        onPress={() => navigation.navigate('SignUpScreen')}
      >
        Sign Up
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

const JoinScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    width: '80%',
    marginTop: -20,
    fontSize: 35,
  },
  button: {
    width: '70%',
    marginTop: 60,
  },
  Image:
  {
    width: '75%',
    padding: 0,
  },
});

JoinScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
