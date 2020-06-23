import React, { useState } from 'react';
import {
  View, Alert, StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import {
  Text, Title, Button, TextInput,
} from 'react-native-paper';
import { theme } from '../../style';

export default function ForgotPasswordScreen(props) {
  const { navigation } = props;
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleForgotPassword() {
    setLoading(true);
    if (email.length <= 0) {
      setLoading(false);
      setErrorMessage('Email must be filled out!');
    } else {
      auth()
        .sendPasswordResetEmail(email, null)
        .then(() => {
          Alert.alert('Password reset email has been sent!');
          setEmail('');
          setErrorMessage(null);
          setLoading(false);
        }).catch((error) => {
          setLoading(false);
          setErrorMessage(error.message);
        });
    }
  }

  return (
    <View style={ForgotPasswordStyles.container}>
      <Title>Forgot Password?</Title>
      {errorMessage
        && (
        <Text style={{ color: 'red' }}>
          {errorMessage}
        </Text>
        )}
      <TextInput
        autoFocus
        disabled={loading}
        style={ForgotPasswordStyles.textInput}
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email"
        mode="outlined"
        onChangeText={(text) => setEmail(text)}
        value={email}
        returnKeyType="go"
        onSubmitEditing={handleForgotPassword}
      />
      <Button
        loading={loading}
        disabled={loading}
        style={ForgotPasswordStyles.button}
        mode="contained"
        onPress={handleForgotPassword}
      >
        Reset Password
      </Button>
      <Button
        disabled={loading}
        mode="text"
        onPress={() => navigation.navigate('SignInScreen')}
      >
        Back to Login
      </Button>
    </View>
  );
}

const ForgotPasswordStyles = StyleSheet.create({
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
  button: {
    width: '90%',
    marginTop: 10,
  },
});

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
