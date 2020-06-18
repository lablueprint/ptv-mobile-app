import React from 'react';
import {
  View, Alert, ScrollView, StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  TextInput, Button, Text,
} from 'react-native-paper';
import styles from '../../style';

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
            style={editProfileStyles.button}
            mode="contained"
            onPress={this.onSavePress}
          >
            Save
          </Button>
        </ScrollView>
      </View>
    );
  }
}

const editProfileStyles = StyleSheet.create({
  scrollView: {
    marginLeft: '5%',
    marginTop: '2%',
  },
  text: {
    marginTop: 10,
    marginBottom: 0,
  },
  textInput: {
    height: 40,
    width: '90%',
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  textInputMedium: {
    height: 40,
    width: '45%',
    marginTop: 0,
    backgroundColor: '#ffffff',
  },

  button: {
    width: '90%',
    marginTop: 30,

  },
});
