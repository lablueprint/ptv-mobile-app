import React from 'react';
import {
  View, Alert, StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Title, TextInput, Button,
} from 'react-native-paper';
import { theme } from '../../style';

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
      <View style={EditProfileStyles.container}>
        <Title>Edit Profile</Title>
        <TextInput
          autoFocus
          blurOnSubmit={false}
          disabled={passwordLoading || emailLoading}
          secureTextEntry
          label="Current Password"
          autoCapitalize="none"
          mode="outlined"
          style={EditProfileStyles.textInput}
          onChangeText={(text) => this.setState({ currentPassword: text })}
          value={currentPassword}
          returnKeyType="next"
          onSubmitEditing={() => this.newPasswordInput.focus()}
        />
        <TextInput
          secureTextEntry
          disabled={passwordLoading || emailLoading}
          label="New Password"
          autoCapitalize="none"
          mode="outlined"
          style={EditProfileStyles.textInput}
          onChangeText={(text) => this.setState({ newPassword: text })}
          value={newPassword}
          ref={(input) => { this.newPasswordInput = input; }}
          returnKeyType="go"
          onSubmitEditing={this.onChangePasswordPress}
        />
        <Button
          loading={passwordLoading}
          disabled={passwordLoading || emailLoading}
          style={EditProfileStyles.button}
          mode="contained"
          onPress={this.onChangePasswordPress}
        >
          Change Password
        </Button>

        <TextInput
          disabled={passwordLoading || emailLoading}
          keyboardType="email-address"
          label="New Email"
          autoCapitalize="none"
          mode="outlined"
          style={EditProfileStyles.textInput}
          onChangeText={(text) => this.setState({ newEmail: text })}
          value={newEmail}
          returnKeyType="go"
          onSubmitEditing={this.onChangeEmailPress}
        />
        <Button
          loading={emailLoading}
          disabled={passwordLoading || emailLoading}
          style={EditProfileStyles.button}
          mode="contained"
          onPress={this.onChangeEmailPress}
        >
          Change Email
        </Button>
      </View>
    );
  }
}

const EditProfileStyles = StyleSheet.create({
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

export default EditProfileScreen;
