import React, {
  useState, useEffect, useCallback,
} from 'react';
import {
  ScrollView, Image, View, StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import {
  Text, Button, ActivityIndicator,
} from 'react-native-paper';
import { NavigationEvents } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { theme } from '../../style';
import { collections, nav } from './variables';

export default function HomeScreen(props) {
  const { navigation } = props;
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadScreen = useCallback((id, title) => {
    setLoading(true);
    firestore()
      .collection(collections.subcategories)
      .where('parent', '==', id)
      .get()
      .then((subcategorySnapshot) => {
        if (!subcategorySnapshot.empty) {
          navigation.push(nav.subcategories, { snapshot: subcategorySnapshot, header: title });
        } else {
          firestore()
            .collection(collections.items)
            .where('parent', '==', id)
            .get()
            .then((itemSnapshot) => {
              navigation.push(nav.itemList, { snapshot: itemSnapshot, header: title });
            })
            .catch((error) => {
              setErrorMessage(error.message);
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setLoading(false);
      });
  }, [navigation]);

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
      <NavigationEvents
        onWillFocus={() => {
          setLoading(false);
        }}
      />
      {errorMessage
        && (
        <Text style={{ color: 'red' }}>
          {errorMessage}
        </Text>
        )}
      { (loading || initialLoad)
        && (
        <ActivityIndicator size="large" />
        )}
      <View style={HomeStyles.categoryButtonView}>
        { !initialLoad
          && (snapshot.docs.map((doc) => {
            const {
              title, thumbnail,
            } = doc.data();

            return (
              <TouchableOpacity
                style={HomeStyles.categoryButton}
                key={doc.id}
                disabled={loading}
                onPress={() => loadScreen(doc.id, title)}
              >
                <Image source={{ uri: thumbnail.src }} style={HomeStyles.categoryImage} />
                <Text style={HomeStyles.categoryText}>
                  {`${title}`}
                </Text>
              </TouchableOpacity>
            );
          }))}
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
  categoryButton: {
    aspectRatio: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  categoryImage: {
    width: '40%',
    aspectRatio: 1,
  },
  categoryText: {
    fontWeight: 'bold',
    marginTop: 10,
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
