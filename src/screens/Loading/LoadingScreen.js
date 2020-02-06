// LoadingScreen.js
import React from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';

class LoadingScreen extends React.Component {
  componentDidMount() {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      unsubscribe();
      const { navigation } = this.props;
      navigation.navigate(user ? 'HomeScreen' : 'SignUpScreen');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
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

LoadingScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default LoadingScreen;
