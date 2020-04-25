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

export default function ResourcesSubcategoriesScreen(props) {
  const { navigation } = props;
}

ResourcesSubcategoriesScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
