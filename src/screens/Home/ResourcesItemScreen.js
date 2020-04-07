import React, { useState, useEffect, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {
  Title, Subheading, Text, Paragraph, List, Caption,
} from 'react-native-paper';
import MapView from 'react-native-maps';
import { theme } from '../../style';

/* Resource item screen styles */
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
  map: {
    alignSelf: 'center',
    width: '90%',
    height: 200,
    borderRadius: 20,
  },
  authorName: {
    textAlign: 'right',
  },
});

/* Returns a single list item with appropriate icon */
function ResourceStep({
  stepNumber, title, description,
}) {
  return (
    <List.Item
      title={title}
      description={description}
      left={() => <List.Icon color={theme.colors.accent} icon={`numeric-${stepNumber}-circle`} />}
    />
  );
}

export default function ResourcesItemScreen(props) {
  const { navigation } = props;
  const resourceID = navigation.getParam('resourceID');

  /* Resource item data */
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [type, setType] = useState(null);
  const [body, setBody] = useState(null);
  const [steps, setSteps] = useState(null);
  const [subheader, setSubheader] = useState(null);
  const [authorName, setAuthorName] = useState(null);

  /* Screen state */
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  /* Query data from firestore */
  const getData = useCallback(async () => {
    setLoading(true);

    try {
      /* Query data from resource item collection */
      const resourceSnap = await firestore().collection('resource_items').doc(resourceID).get();
      const resourceData = resourceSnap.data();

      /* Query user data */
      const authorSnapshot = firestore().collection('users').doc(resourceData.userID).get();
      const authorSnap = await Promise.all([authorSnapshot]);

      setAuthorName(authorSnap.length ? authorSnap[0].get('displayName') : null);
      setTitle(resourceData.title);
      setDescription(resourceData.description);
      setType(resourceData.type);
      setSubheader(resourceData.subheader);

      /* Different behavior if resource is of type STEPS or FREEFORM */
      if (type === 'STEPS') {
        firestore().collection('resource_items').doc(resourceID).collection('steps')
          .get()
          .then((stepsList) => {
            const stepsData = stepsList.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

            const sortedStepsData = stepsData.sort((a, b) => {
              if (a.stepNumber > b.stepNumber) {
                return 1;
              }
              if (a.stepNumber < b.stepNumber) {
                return -1;
              }
              return 0;
            });

            setSteps(sortedStepsData.map((step) => (
              <ResourceStep
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.body}
                key={step.id}
              />
            )));
            setLoading(false);
          });
      } else if (type === 'FREEFORM') {
        setBody(resourceData.body);
        setLoading(false);
      }
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
          {title && (<Title>{title}</Title>)}
          {description && (<Paragraph>{description}</Paragraph>)}
          <Text>{'\n'}</Text>
          {steps && (
            <View>
              <List.Section>
                <List.Subheader>{subheader}</List.Subheader>
                {steps}
              </List.Section>
              <List.Subheader>Location</List.Subheader>
            </View>
          )}
          {body && (
          <View>
            <Subheading>{subheader}</Subheading>
            <Paragraph>
              {body}
              {'\n'}
            </Paragraph>
            <Subheading>
              Location
              {'\n'}
            </Subheading>
          </View>
          )}
          <MapView
            style={resourcesStyles.map}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <MapView.Marker
              coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
            />
          </MapView>
          {authorName && (<Caption style={resourcesStyles.authorName}>{`Written by ${authorName}`}</Caption>)}
          {loading && <ActivityIndicator />}
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

ResourceStep.propTypes = {
  stepNumber: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
