import React, { useState, useEffect } from 'react';
import {
  ScrollView, Image, View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import {
  Text, Button, ActivityIndicator,
} from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../../style';

export default function HomeScreen(props) {
  const { navigation } = props;
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    setLoading(true);
    firestore().collection('resource_categories').get().then((querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((doc) => {
        const {
          id, title, description, thumbnail,
        } = doc.data();
        temp.push(
          <TouchableOpacity style={styles.categoryButton} key={id}>
            <Image source={{ uri: thumbnail.src }} style={styles.categoryImage} />
            <Text style={{ marginTop: 10 }}>
              {`${title}`}
            </Text>
          </TouchableOpacity>,
        );
      });

      setResources(temp);
      setLoading(false);
    })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  }, []);

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('Auth');
      }).catch((error) => {
        setErrorMessage(error.message);
      });
  }

  function loadSubcategories() {

  }

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollviewContainer}>
      {errorMessage
        && (
        <Text style={{ color: 'red' }}>
          {errorMessage}
        </Text>
        )}
      <View style={styles.categoryButtonView}>
        { resources }
      </View>
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSignOut}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
