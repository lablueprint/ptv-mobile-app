import React, { useState, useEffect, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {
  Title, Subheading, Text, Paragraph,
} from 'react-native-paper';
import { theme } from '../../style';


const resourcesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: 'white',
    top: 400,
    width: '100%',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 420,
  },
});

export default function ResourcesItemScreen(props) {
  const { navigation } = props;
  const resourceID = navigation.getParam('resourceID');

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [type, setType] = useState(null);
  const [body, setBody] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const getData = useCallback(async () => {
    setLoading(true);

    try {
      const resourceSnap = await firestore().collection('resource_items').doc(resourceID).get();
      const resourceData = resourceSnap.data();

      setTitle(resourceData.title);
      setDescription(resourceData.description);
      setType(resourceData.type);
      switch (type) {
        case 'STEPS':
          // TODO
          break;
        case 'FREEFORM':
          setBody(resourceData.body);
          break;
        default:
          // TODO
          break;
      }

      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }, [resourceID, type]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <View style={resourcesStyles.container}>
      <ScrollView style={resourcesStyles.container}>
        <View style={resourcesStyles.itemContainer}>
          {errorMessage && <Text>{errorMessage}</Text>}
          {loading && <ActivityIndicator />}
          <Title>{title}</Title>
          <Paragraph>{description}</Paragraph>
          <Text>{'\n'}</Text>
          <Subheading>Body/Steps</Subheading>
          <Paragraph>{body}</Paragraph>
        </View>
      </ScrollView>
    </View>
  );
}

ResourcesItemScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
