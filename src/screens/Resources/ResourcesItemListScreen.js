import React, { useState, useEffect } from 'react';
import {
  ScrollView, View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import {
  Text, Button, ActivityIndicator,
} from 'react-native-paper';
import styles from '../../style';

export default function ResourcesItemListScreen(props) {
  const [errorMessage, setErrorMessage] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.scrollviewContainer}>
      {errorMessage
        && (
        <Text style={{ color: 'red' }}>
          {errorMessage}
        </Text>
        )}

    </ScrollView>
  );
}

ResourcesItemListScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
