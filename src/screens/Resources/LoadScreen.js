import firestore from '@react-native-firebase/firestore';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'react-navigation-hooks';
import PropTypes from 'prop-types';
import { collections, nav } from '../../constants';

export default function useLoadScreen(navigation) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function firestoreQuery(collection, id) {
    return firestore()
      .collection(collection)
      .where('parent', '==', id)
      .get();
  }

  async function loadScreen(id, title) {
    setLoading(true);

    try {
      const subcategorySnapshot = await firestoreQuery(collections.subcategories, id);
      if (!subcategorySnapshot.empty) {
        navigation.push(nav.subcategories, { snapshot: subcategorySnapshot, header: title });
      } else {
        const itemSnapshot = await firestoreQuery(collections.items, id);
        navigation.push(nav.itemList, { snapshot: itemSnapshot, header: title });
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    setLoading(false);
  }, []));

  return [loading, errorMessage, loadScreen];
}

useLoadScreen.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
