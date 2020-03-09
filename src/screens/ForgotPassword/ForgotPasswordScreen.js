import React, { useState } from 'react';
import {
  View, Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import {
  Text, Title, Button, TextInput, withTheme,
} from 'react-native-paper';
import styles from '../../style';

function ForgotPasswordScreen(props) {
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
    <View style={styles(props).container}>
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
        style={styles(props).textInput}
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
        style={styles(props).button}
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

ForgotPasswordScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default withTheme(ForgotPasswordScreen);
