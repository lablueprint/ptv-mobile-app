import React, { useState } from 'react';
import {
  StyleSheet, View, Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import {
  Text, Title, Button, TextInput,
} from 'react-native-paper';

export default function ForgotPasswordScreen({ navigation }) {
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
    <View style={styles.container}>
      <Title>Forgot Password?</Title>
      {errorMessage
        && (
        <Text style={{ color: 'red' }}>
          {errorMessage}
        </Text>
        )}
      <TextInput
        autoFocus
        editable={!loading}
        style={styles.textInput}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        returnKeyType="go"
        onSubmitEditing={handleForgotPassword}
      />
      <Button
        loading={loading}
        disabled={loading}
        style={styles.button}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8,
  },
  button: {
    width: '90%',
    marginTop: 10,
  },
});

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
