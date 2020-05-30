import React from 'react';
import {
<<<<<<< HEAD
  View, Alert, StyleSheet,
=======
  View, Alert, ScrollView, StyleSheet,
>>>>>>> master
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  TextInput, Button, Text,
} from 'react-native-paper';
import { theme } from '../../style';

const INITIAL_STATE = {
  /* TODO: currently, we have two text inputs that correspond with the first name and last name.
  Fix Backend to incorporated these components upon account creation */
  currentPassword: '',
  passwordLoading: false,
  newDisplayName: '',
  newFirstName: '',
  newLastName: '',
  newPassword: '',
  retypeNewPassword: '',
  errorMessagePassword: '',
  errorMessageCurrentPassword: '',
  saveLoading: false,
};

export default class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.onSavePress = this.onSavePress.bind(this);
    this.reauthenticate = this.reauthenticate.bind(this);
  }

  onSavePress() {
    const {
      newPassword, retypeNewPassword, newDisplayName, currentPassword,
    } = this.state;
    if (currentPassword.length === 0) {
      this.setState({ errorMessageCurrentPassword: 'Please Enter Current Password' });
    }
    if (newPassword !== retypeNewPassword) {
      this.setState({ errorMessagePassword: 'Please make sure both passwords match' });
    }
    if (newPassword === retypeNewPassword && currentPassword.length > 0) {
      if (newPassword.length > 0 && newDisplayName.length > 0) {
        this.setState({ saveLoading: true });
        this.reauthenticate()
          .then(() => {
            auth().currentUser
              .updateProfile({
                displayName: newDisplayName,
              })
              .then(() => {
                Alert.alert('Display Name was changed successfully!');
              })
              .catch((error) => {
                Alert.alert(error.message);
                this.setState(INITIAL_STATE);
              });
            auth().currentUser
              .updatePassword(newPassword)
              .then(() => {
                this.setState(INITIAL_STATE);
                Alert.alert('Password changed successfully!');
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
      } else if (newPassword.length > 0) {
        this.setState({ saveLoading: true });
        this.reauthenticate()
          .then(() => {
            auth().currentUser
              .updatePassword(newPassword)
              .then(() => {
                this.setState(INITIAL_STATE);
                Alert.alert('Password was changed successfully!');
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
      } else if (newDisplayName.length > 0) {
        this.setState({ saveLoading: true });
        this.reauthenticate()
          .then(() => {
            auth().currentUser
              .updateProfile({
                displayName: newDisplayName,
              })
              .then(() => {
                this.setState(INITIAL_STATE);
                Alert.alert('Display Name was changed successfully!');
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
    }
  }

  reauthenticate() {
    const { currentPassword } = this.state;
    const cred = auth.EmailAuthProvider.credential(auth().currentUser.email, currentPassword);
    return auth().currentUser
      .reauthenticateWithCredential(cred);
  }

  render() {
    const {
      currentPassword, newPassword, retypeNewPassword, saveLoading,
      errorMessagePassword, newDisplayName, newFirstName, newLastName,
      errorMessageCurrentPassword,
    } = this.state;
    const isDisabled = currentPassword.length === 0
    || (newDisplayName.length === 0 && newFirstName.length === 0
      && newLastName.length === 0 && newPassword.length === 0
      && retypeNewPassword.length === 0)
    || (newPassword.length !== 0 && retypeNewPassword.length === 0)
    || (newPassword.length === 0 && retypeNewPassword.length !== 0);
    return (
<<<<<<< HEAD
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
=======
      <View style={styles.container}>
        <ScrollView style={editProfileStyles.scrollView}>
          <Text style={editProfileStyles.text}>
            Display Name
          </Text>
          <TextInput
            autoFocus
            blurOnSubmit={false}
            autoCapitalize="none"
            mode="outlined"
            style={editProfileStyles.textInput}
            onChangeText={(text) => this.setState({ newDisplayName: text })}
            value={newDisplayName}
            returnKeyType="next"
            onSubmitEditing={() => this.newFirstNameInput.focus()}
            disabled={saveLoading}
          />
          <Text style={editProfileStyles.text}>Name</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              /* TODO: this text input does not change anything in backend
              because we do not store user's first name */
              blurOnSubmit={false}
              label="First"
              autoCapitalize="none"
              mode="outlined"
              style={editProfileStyles.textInputMedium}
              onChangeText={(text) => this.setState({ newFirstName: text })}
              value={newFirstName}
              returnKeyType="next"
              ref={(input) => { this.newFirstNameInput = input; }}
              onSubmitEditing={() => this.newLastNameInput.focus()}
              disabled={saveLoading}
            />
            <TextInput
              /* TODO: this text input does not change anything in backend because
               we do not store user's last name */
              blurOnSubmit={false}
              label="Last"
              autoCapitalize="none"
              mode="outlined"
              style={editProfileStyles.textInputMedium}
              onChangeText={(text) => this.setState({ newLastName: text })}
              value={newLastName}
              returnKeyType="next"
              ref={(input) => { this.newLastNameInput = input; }}
              onSubmitEditing={() => this.newPasswordInput.focus()}
              disabled={saveLoading}
            />
          </View>
          <Text style={editProfileStyles.text}>New Password</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            mode="outlined"
            style={editProfileStyles.textInput}
            onChangeText={(text) => this.setState({ newPassword: text })}
            value={newPassword}
            ref={(input) => { this.newPasswordInput = input; }}
            returnKeyType="next"
            onSubmitEditing={() => this.retypeNewPasswordInput.focus()}
            disabled={saveLoading}
          />
          {errorMessagePassword !== ''
        && (
          <Text style={{ color: 'red' }}>
            {errorMessagePassword}
          </Text>
        )}
          <Text style={editProfileStyles.text}>Retype New Password</Text>
          <TextInput
            secureTextEntry
            autoCapitalize="none"
            mode="outlined"
            style={editProfileStyles.textInput}
            onChangeText={(text) => this.setState({ retypeNewPassword: text })}
            value={retypeNewPassword}
            ref={(input) => { this.retypeNewPasswordInput = input; }}
            returnKeyType="go"
            onSubmitEditing={() => this.currentPasswordInput.focus()}
            disabled={saveLoading}
          />
          {errorMessagePassword !== ''
        && (
          <Text style={{ color: 'red' }}>
            {errorMessagePassword}
          </Text>
        )}
          <Text style={editProfileStyles.text}>Current Password</Text>
          <TextInput
            blurOnSubmit={false}
            secureTextEntry
            autoCapitalize="none"
            mode="outlined"
            style={editProfileStyles.textInput}
            onChangeText={(text) => this.setState({ currentPassword: text })}
            value={currentPassword}
            returnKeyType="go"
            ref={(input) => { this.currentPasswordInput = input; }}
            onSubmitEditing={this.onSavePress}
            disabled={saveLoading}
          />
          {errorMessageCurrentPassword !== ''
        && (
          <Text style={{ color: 'red' }}>
            {errorMessageCurrentPassword}
          </Text>
        )}
          <Button
            disabled={isDisabled || saveLoading}
            loading={saveLoading}
            style={styles.button}
            mode="contained"
            onPress={this.onSavePress}
          >
            Save
          </Button>
        </ScrollView>
>>>>>>> master
      </View>
    );
  }
}

<<<<<<< HEAD
const EditProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
=======
const editProfileStyles = StyleSheet.create({
  scrollView: {
    marginLeft: '5%',
    marginTop: '2%',
  },
  text: {
    marginTop: 10,
    marginBottom: 0,
>>>>>>> master
  },
  textInput: {
    height: 40,
    width: '90%',
<<<<<<< HEAD
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  button: {
    width: '90%',
    marginTop: 10,
  },
});

export default EditProfileScreen;
=======
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  textInputMedium: {
    height: 40,
    width: '45%',
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
});
>>>>>>> master
