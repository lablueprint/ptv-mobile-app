import React from 'react';
import { View, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import {
  TextInput, Title, Text, Button,
} from 'react-native-paper';
import { theme } from '../../style';

const INITIAL_STATE = {
  email: '',
  password: '',
  errorMessage: null,
  loading: false,
};

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const { email, password } = this.state;
    const { navigation } = this.props;
    this.setState({ loading: true });

    if (email.length <= 0 || password.length <= 0) {
      this.setState({ errorMessage: 'All fields are required!', loading: false });
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.setState({ loading: false });
          navigation.navigate('Home');
        }).catch((error) => {
          this.setState({ loading: false, errorMessage: error.message });
        });
    }
  }

  render() {
    const {
      errorMessage, email, password, loading,
    } = this.state;
    const { navigation } = this.props;
    return (
      <View style={SignInStyles.container}>
        <Title>Login</Title>
        {errorMessage
          && (
          <Text style={{ color: 'red' }}>
            {errorMessage}
          </Text>
          )}
        <TextInput
          autoFocus
          blurOnSubmit={false}
          disabled={loading}
          style={SignInStyles.textInput}
          autoCapitalize="none"
          keyboardType="email-address"
          label="Email"
          mode="outlined"
          onChangeText={(text) => this.setState({ email: text })}
          value={email}
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
        />
        <TextInput
          disabled={loading}
          secureTextEntry
          style={SignInStyles.textInput}
          autoCapitalize="none"
          label="Password"
          mode="outlined"
          onChangeText={(text) => this.setState({ password: text })}
          value={password}
          ref={(input) => { this.passwordInput = input; }}
          returnKeyType="go"
          onSubmitEditing={this.handleLogin}
        />
        <Button
          loading={loading}
          disabled={loading}
          style={SignInStyles.button}
          mode="contained"
          onPress={this.handleLogin}
        >
          Login
        </Button>
        <Button
          style={SignInStyles.button}
          disabled={loading}
          mode="contained"
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          Don&apos;t have an account? Sign Up
        </Button>
        <Button
          disabled={loading}
          mode="text"
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
        >
          Forgot Password?
        </Button>
      </View>
    );
  }
}

const SignInStyles = StyleSheet.create({
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

SignInScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default SignInScreen;
