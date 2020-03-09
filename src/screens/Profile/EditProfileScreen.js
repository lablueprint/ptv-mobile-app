import React from 'react';
import {
  View, Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Title, TextInput, Button, withTheme,
} from 'react-native-paper';
import styles from '../../style';

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
      <View style={styles(this.props).container}>
        <Title>Edit Profile</Title>
        <TextInput
          autoFocus
          blurOnSubmit={false}
          disabled={passwordLoading || emailLoading}
          secureTextEntry
          label="Current Password"
          autoCapitalize="none"
          mode="outlined"
          style={styles(this.props).textInput}
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
          style={styles(this.props).textInput}
          onChangeText={(text) => this.setState({ newPassword: text })}
          value={newPassword}
          ref={(input) => { this.newPasswordInput = input; }}
          returnKeyType="go"
          onSubmitEditing={this.onChangePasswordPress}
        />
        <Button
          loading={passwordLoading}
          disabled={passwordLoading || emailLoading}
          style={styles(this.props).button}
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
          style={styles(this.props).textInput}
          onChangeText={(text) => this.setState({ newEmail: text })}
          value={newEmail}
          returnKeyType="go"
          onSubmitEditing={this.onChangeEmailPress}
        />
        <Button
          loading={emailLoading}
          disabled={passwordLoading || emailLoading}
          style={styles(this.props).button}
          mode="contained"
          onPress={this.onChangeEmailPress}
        >
          Change Email
        </Button>
      </View>
    );
  }
}

export default withTheme(EditProfileScreen);
