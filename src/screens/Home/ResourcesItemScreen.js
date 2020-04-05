import React, { useState, useEffect, useCallback } from 'react';
import {
  View, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import {
  Title, Subheading, Text, Paragraph, List, Caption,
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
  authorName: {
    textAlign: 'right',
  },
});

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

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [type, setType] = useState(null);
  const [body, setBody] = useState(null);
  const [steps, setSteps] = useState(null);
  const [subheader, setSubheader] = useState(null);
  const [authorName, setAuthorName] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const getData = useCallback(async () => {
    setLoading(true);

    try {
      const resourceSnap = await firestore().collection('resource_items').doc(resourceID).get();
      const resourceData = resourceSnap.data();

      const authorSnapshot = firestore().collection('users').doc(resourceData.userID).get();
      const authorSnap = await Promise.all([authorSnapshot]);

      setAuthorName(authorSnap.length ? authorSnap[0].get('displayName') : null);

      setTitle(resourceData.title);
      setDescription(resourceData.description);
      setType(resourceData.type);
      setSubheader(resourceData.subheader);
      if (type === 'STEPS') {
        const stepsList = await firestore().collection('resource_items').doc(resourceID).collection('steps')
          .get();
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

        setSteps(sortedStepsData.map((step) => ({
          ...(<ResourceStep
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.body}
          />),
          key: step.id,
        })));
      } else if (type === 'FREEFORM') {
        setBody(resourceData.body);
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
          {steps != null
            ? (
              <List.Section>
                <List.Subheader>{subheader}</List.Subheader>
                {steps}
              </List.Section>
            )
            : (
              <View>
                <Subheading>{subheader}</Subheading>
                <Paragraph>{body}</Paragraph>
              </View>
            )}
          <Caption style={resourcesStyles.authorName}>{`Written by ${authorName}`}</Caption>
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
