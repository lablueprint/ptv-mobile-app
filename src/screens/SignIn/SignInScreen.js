import React from 'react';
import {
  StyleSheet, Text, TextInput, View, Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  email: '',
  password: '',
  errorMessage: null,
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

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('HomeScreen'))
      .catch((error) => this.setState({ errorMessage: error.message }));
  }

  render() {
    const { errorMessage, email, password } = this.state;
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
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={(text) => this.setState({ email: text })}
          value={email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={(text) => this.setState({ password: text })}
          value={password}
        />
        <Button title="Login" onPress={this.handleLogin} />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => navigation.navigate('SignUpScreen')}
        />
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
