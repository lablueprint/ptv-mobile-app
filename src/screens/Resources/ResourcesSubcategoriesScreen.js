import React, {
  useState, useCallback,
} from 'react';
import {
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';
import {
  Text, Button, ActivityIndicator,
} from 'react-native-paper';
import styles from '../../style';
import { collections, nav } from './variables';


export default function ResourcesSubcategoriesScreen(props) {
  const { navigation } = props;
  const snapshot = navigation.getParam('snapshot');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  return (
    <ScrollView contentContainerStyle={styles.scrollviewContainer}>
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
      {loading
        && (
        <ActivityIndicator size="large" />
        )}
      { snapshot.docs.map((doc) => {
        const { title } = doc.data();
        return (
          <Button
            contentStyle={styles.subcategoryButtonHeight}
            style={styles.subcategoryButton}
            key={doc.id}
            uppercase={false}
            disabled={loading}
            mode="contained"
            color="#ffffff"
            onPress={() => loadScreen(doc.id, title)}
          >
            <Text style={styles.resourceText}>
              {`${title}`}
            </Text>
          </Button>
        );
      })}
    </ScrollView>
  );
}

ResourcesSubcategoriesScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.getParam('header'),
});

ResourcesSubcategoriesScreen.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
