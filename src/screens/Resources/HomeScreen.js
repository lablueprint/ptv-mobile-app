import React, {
  useState, useEffect,
} from 'react';
import {
  ScrollView, View, StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import {
  Text, Button, ActivityIndicator,
} from 'react-native-paper';
import { theme } from '../../style';
import { collections } from '../../constants';
import { HomeIcons } from './ResourcesComponents';
import useLoadScreen from './LoadScreen';

export default function HomeScreen(props) {
  const { navigation } = props;
  const [loadingNextScreen, err, loadScreen] = useLoadScreen(navigation);
  const [errorMessage, setErrorMessage] = useState(err);
  const [snapshot, setSnapshot] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    firestore()
      .collection(collections.categories)
      .get()
      .then((querySnapshot) => {
        setSnapshot(querySnapshot);
        setInitialLoad(false);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setInitialLoad(false);
      });
  }, []);

  useEffect(() => {
    setErrorMessage(err);
  }, [err]);

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
    <ScrollView contentContainerStyle={HomeStyles.scrollviewContainer}>
      {errorMessage
        && (
        <Text style={{ color: 'red' }}>
          {errorMessage}
        </Text>
        )}
      { (loadingNextScreen || initialLoad)
        && (
        <ActivityIndicator size="large" />
        )}
      <View style={HomeStyles.categoryButtonView}>
        { !initialLoad
          && <HomeIcons snapshot={snapshot} loading={loadingNextScreen} loadScreen={loadScreen} /> }
      </View>
      <Button
        style={HomeStyles.button}
        mode="contained"
        onPress={handleSignOut}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const HomeStyles = StyleSheet.create({
  scrollviewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  categoryButtonView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
  },
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
