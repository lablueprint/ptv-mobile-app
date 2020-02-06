// HomeScreen.js
import React from 'react';
import {
  StyleSheet, Text, View, Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  name: '',
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  async componentDidMount() {
    const { currentUser } = auth();
    const name = currentUser.displayName;
    this.setState({ name });
  }

  handleSignOut() {
    const { navigation } = this.props;
    auth()
      .signOut()
      .then(() => navigation.navigate('SignUpScreen'))
      .catch((error) => console.log(error));
  }

  render() {
    const { name } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
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
