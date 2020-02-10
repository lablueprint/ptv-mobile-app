import React from 'react';
import {
  StyleSheet, Text, TextInput, View, Button, ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';

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
          navigation.navigate('HomeScreen');
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
      <View style={styles.container}>
        <Text>Login</Text>
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
          onChangeText={(text) => this.setState({ email: text })}
          value={email}
          returnKeyType="next"
          onSubmitEditing={() => this.passwordInput.focus()}
        />
        <TextInput
          editable={!loading}
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={(text) => this.setState({ password: text })}
          value={password}
          ref={(input) => { this.passwordInput = input; }}
          returnKeyType="go"
          onSubmitEditing={this.handleLogin}
        />
        {loading
          ? <ActivityIndicator />
          : (
            <>
              <Button title="Login" onPress={this.handleLogin} />
              <Button
                title="Don't have an account? Sign Up"
                onPress={() => navigation.navigate('SignUpScreen')}
              />
            </>
          )}
      </View>
    );
  }
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
});

SignInScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default SignInScreen;
