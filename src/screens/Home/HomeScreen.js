import React, { useState } from 'react';
import {
  Text, View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import PropTypes from 'prop-types';
import { Title, Button, withTheme } from 'react-native-paper';
import styles from '../../style';

function HomeScreen(props) {
  const { navigation } = props;
  const [name] = useState(auth().currentUser ? auth().currentUser.displayName : '');
  const [errorMessage, setErrorMessage] = useState(null);

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('Auth');
      }).catch((error) => {
        setErrorMessage(error.message);
      });
  }

  return (
    <View style={styles(props).container}>
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
        style={styles(props).button}
        mode="contained"
        onPress={handleSignOut}
      >
        Sign Out
      </Button>
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default withTheme(HomeScreen);
