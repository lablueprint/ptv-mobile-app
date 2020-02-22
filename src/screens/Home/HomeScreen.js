import React from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import { Title, Button } from 'react-native-paper';

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
        <Title>
          Hi
          {' '}
          {name}
          !
        </Title>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => navigation.navigate('EditProfileScreen')}
        >
          Edit profile
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={this.handleSignOut}
        >
          Sign Out
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
  button: {
    width: '90%',
    marginTop: 10,
  },
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default HomeScreen;
