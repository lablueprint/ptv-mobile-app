import React from 'react';
import {
  StyleSheet, View, ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import {
  Button, TextInput, Text, Title,
} from 'react-native-paper';

const INITAL_STATE = {
  email: '',
  password: '',
  name: '',
  errorMessage: null,
  loading: false,
};

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITAL_STATE;
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  handleSignUp() {
    const { name, email, password } = this.state;
    const { navigation } = this.props;
    this.setState({ loading: true });

    if (name.length <= 0 || email.length <= 0 || password.length <= 0) {
      this.setState({ errorMessage: 'All fields are required!', loading: false });
    } else {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const ref = firestore().collection('users').doc(userCredential.uid);
          ref.set({
            email,
            id: userCredential.uid,
            isAdmin: false,
            name,
            role: 'UNAUTHORIZED',
            updatedAt: firestore.Timestamp.now(),
          }).then(() => {
            userCredential.user.updateProfile({
              displayName: name,
            }).then(() => {
              navigation.navigate('Home');
            }).catch((error) => {
              this.setState({ loading: false, errorMessage: error.message });
            });
          }).catch((error) => {
            this.setState({ loading: false, errorMessage: error.message });
          });
        }).catch((error) => {
          this.setState({ loading: false, errorMessage: error.message });
        });
    }
  }

  render() {
    const {
      errorMessage, name, email, password, loading,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Title>Sign Up</Title>
        {errorMessage
          && (
          <Text style={{ color: 'red' }}>
            {errorMessage}
          </Text>
          )}
        <TextInput
          editable={!loading}
          autoFocus
          placeholder="Name"
          autoCapitalize="words"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ name: text })}
          value={name}
          onSubmitEditing={() => this.emailInput.focus()}
          returnKeyType="next"
        />
        <TextInput
          editable={!loading}
          keyboardType="email-address"
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ email: text })}
          value={email}
          ref={(input) => { this.emailInput = input; }}
          onSubmitEditing={() => this.passwordInput.focus()}
          returnKeyType="next"
        />
        <TextInput
          editable={!loading}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ password: text })}
          value={password}
          ref={(input) => { this.passwordInput = input; }}
          onSubmitEditing={this.handleSignUp}
          returnKeyType="go"
        />
        {loading
          ? <ActivityIndicator />
          : (
            <>
              <Button
                style={styles.button}
                mode="contained"
                onPress={this.handleSignUp}
              >
                Sign Up
              </Button>
              <Button
                style={styles.button}
                mode="contained"
                onPress={() => navigation.navigate('SignInScreen')}
              >
                Already have an account? Login
              </Button>
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
  button: {
    width: '90%',
    marginTop: 10,
  },
});

SignUpScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default SignUpScreen;
