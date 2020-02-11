import React from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';

class LoadingScreen extends React.Component {
  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      navigation.navigate(user ? 'App' : 'Auth');
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
