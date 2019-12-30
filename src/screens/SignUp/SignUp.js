// SignUp.js
import React from 'react'
import { StyleSheet, Text, TextInput, View, Button } from 'react-native'
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

class SignUp extends React.Component {
  state = { email: '', password: '', name: '', errorMessage: null }

  handleSignUp = async() => {
    auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => this.setState({ errorMessage: error.message }));
    auth().onAuthStateChanged(async function(user) {
      if (user) {
        const ref = firestore().collection('users').doc(user.uid);
        try {
          await ref.set({
            email: this.state.email,
            id: user.uid,
            isAdmin: false,
            name: this.state.name,
            role: "UNAUTHORIZED",
            updatedAt: new Date()
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        console.log("No users logged in");
      }
    });
    try {
      await ref.set({
        email: this.state.email,
        id: user.uid,
        isAdmin: false,
        name: this.state.name,
        role: "UNAUTHORIZED",
        updatedAt: new Date()
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const ref = firestore().collection('users').doc('DnDen00gYAfRT31g23HNVBsVslh1').get();
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="Name"
          autoCapitalize="words"
          style={styles.textInput}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button title="Sign Up" onPress={this.handleSignUp} />
        <Button
          title="Already have an account? Login"
          onPress={() => this.props.navigation.navigate('Login')}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 8
  },
})

export default SignUp;
