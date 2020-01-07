// SignUp.js
import React from 'react';
import {
  StyleSheet, Text, TextInput, View, Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const INITAL_STATE = {
  email: '',
  password: '',
  name: '',
  errorMessage: null,
  unmount: null,
};

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITAL_STATE;
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  async componentDidMount() {
    const self = this;
    this.state.unmount = auth().onAuthStateChanged(async (user) => {
      if (user) {
        user.updateProfile({ displayName: self.state.name })
          .then(() => self.props.navigation.navigate('Home'))
          .catch((error) => console.log(error));
        const ref = firestore().collection('users').doc(user.uid);
        try {
          await ref.set({
            email: self.state.email,
            id: user.uid,
            isAdmin: false,
            name: self.state.name,
            role: 'UNAUTHORIZED',
            updatedAt: new Date(),
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log('No users logged in');
      }
    });
  }

  componentWillUnmount() {
    const { unmount } = this.state;
    unmount();
  }

  async handleSignUp() {
    const { email, password } = this.state;
    auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => this.setState({ errorMessage: error.message }));
  }

  render() {
    const {
      errorMessage, name, email, password,
    } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {errorMessage
          && (
          <Text style={{ color: 'red' }}>
            {errorMessage}
          </Text>
          )}
        <TextInput
          placeholder="Name"
          autoCapitalize="words"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ name: text })}
          value={name}
        />
        <TextInput
          keyboardType="email-address"
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ email: text })}
          value={email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ password: text })}
          value={password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => navigation.navigate('SignIn')}
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

SignUp.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default SignUp;
