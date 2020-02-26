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
  passwordLoading: false,
  emailLoading: false,
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
    this.setState({ passwordLoading: true });
    this.reauthenticate()
      .then(() => {
        auth().currentUser
          .updatePassword(newPassword)
          .then(() => {
            Alert.alert('Password was changed successfully!');
            this.setState(INITIAL_STATE);
          })
          .catch((error) => {
            Alert.alert(error.message);
            this.setState(INITIAL_STATE);
          });
      })
      .catch((error) => {
        Alert.alert(error.message);
        this.setState(INITIAL_STATE);
      });
  }

  onChangeEmailPress() {
    const { newEmail } = this.state;
    this.setState({ emailLoading: true });
    this.reauthenticate()
      .then(() => {
        auth().currentUser
          .updateEmail(newEmail)
          .then(() => {
            Alert.alert('Email was changed successfully!');
            this.setState(INITIAL_STATE);
          })
          .catch((error) => {
            Alert.alert(error.message);
            this.setState(INITIAL_STATE);
          });
      })
      .catch((error) => {
        Alert.alert(error.message);
        this.setState(INITIAL_STATE);
      });
  }

  reauthenticate() {
    const { currentPassword } = this.state;
    const cred = auth.EmailAuthProvider.credential(auth().currentUser.email, currentPassword);
    return auth().currentUser
      .reauthenticateWithCredential(cred);
  }

  render() {
    const {
      currentPassword, newPassword, newEmail, passwordLoading, emailLoading,
    } = this.state;
    return (
      <View style={styles.container}>
        <Title>Edit Profile</Title>
        <TextInput
          autoFocus
          editable={!passwordLoading && !emailLoading}
          secureTextEntry
          placeholder="Current Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ currentPassword: text })}
          value={currentPassword}
          returnKeyType="next"
          onSubmitEditing={() => this.newPasswordInput.focus()}
        />
        <TextInput
          secureTextEntry
          editable={!passwordLoading && !emailLoading}
          placeholder="New Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ newPassword: text })}
          value={newPassword}
          ref={(input) => { this.newPasswordInput = input; }}
          returnKeyType="go"
          onSubmitEditing={this.onChangePasswordPress}
        />
        <Button
          loading={passwordLoading}
          style={styles.button}
          mode="contained"
          onPress={this.onChangePasswordPress}
        >
          Change Password
        </Button>

        <TextInput
          editable={!passwordLoading && !emailLoading}
          keyboardType="email-address"
          placeholder="New Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={(text) => this.setState({ newEmail: text })}
          value={newEmail}
          returnKeyType="go"
          onSubmitEditing={this.onChangeEmailPress}
        />
        <Button
          loading={emailLoading}
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
