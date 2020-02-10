import React from 'react';
import {
  StyleSheet, Text, View, Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  name: '',
  errorMessage: null,
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ name: user.displayName });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleSignOut() {
    const { navigation } = this.props;
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('SignUpScreen');
      }).catch((error) => {
        this.setState({ errorMessage: error.message });
      });
  }

  render() {
    const { name, errorMessage } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        {errorMessage
          && (
          <Text style={{ color: 'red' }}>
            {errorMessage}
          </Text>
          )}
        <Button title="Sign out" onPress={this.handleSignOut} />
        <Text>
          Hi
          {' '}
          {name}
          !
        </Text>
        <Button title="Edit profile" onPress={() => navigation.navigate('EditProfileScreen')} />
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
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default HomeScreen;
