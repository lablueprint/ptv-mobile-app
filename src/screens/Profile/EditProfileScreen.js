import React from 'react';
import {
  StyleSheet, View, Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Title, TextInput, Button,
} from 'react-native-paper';

const INITIAL_STATE = {
  newPassword: '',
  newEmail: '',
  currentPassword: '',
};

class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.onChangePasswordPress = this.onChangePasswordPress.bind(this);
    this.onChangeEmailPress = this.onChangeEmailPress.bind(this);
    this.reauthenticate = this.reauthenticate.bind(this);
  }

  onChangePasswordPress() {
    const { newPassword } = this.state;
    this.reauthenticate()
      .then(() => {
        auth().currentUser
          .updatePassword(newPassword)
          .then(() => Alert.alert('Password was changed successfully!'))
          .catch((error) => Alert.alert(error.message));
      })
      .catch((error) => Alert.alert(error.message));
  }

  onChangeEmailPress() {
    const { newEmail } = this.state;
    this.reauthenticate()
      .then(() => {
        auth().currentUser
          .updateEmail(newEmail)
          .then(() => Alert.alert('Email was changed successfully!'))
          .catch((error) => Alert.alert(error.message));
      })
      .catch((error) => Alert.alert(error.message));
  }

  reauthenticate() {
    const { currentPassword } = this.state;
    const cred = auth.EmailAuthProvider.credential(auth().currentUser.email, currentPassword);
    return auth().currentUser
      .reauthenticateWithCredential(cred);
  }

  render() {
    const { currentPassword, newPassword, newEmail } = this.state;
    return (
      <View style={styles.container}>
        <Title>Edit Profile</Title>
        <TextInput
          secureTextEntry
          placeholder="Current Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ currentPassword: text })}
          value={currentPassword}
        />
        <TextInput
          secureTextEntry
          placeholder="New Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ newPassword: text })}
          value={newPassword}
        />
        <Button
          style={styles.button}
          mode="contained"
          onPress={this.onChangePasswordPress}
        >
          Change Password
        </Button>

        <TextInput
          keyboardType="email-address"
          placeholder="New Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ newEmail: text })}
          value={newEmail}
        />
        <Button
          style={styles.button}
          mode="contained"
          onPress={this.onChangeEmailPress}
        >
          Change Email
        </Button>
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

export default EditProfileScreen;
