import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from 'react-navigation-hooks';
import { SingleItemList, MultipleItemList } from './ResourcesComponents';
import { theme } from '../../style';

export default function ResourcesItemListScreen(props) {
  const { navigation } = props;
  const snapshot = navigation.getParam('snapshot');
  const [loading, setLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    setLoading(false);
  }, []));

  function singleOrMultipleDocs() {
    // returns a collapsible if there is only 1 doc
    if (snapshot.docs.length === 1) {
      return (
        <SingleItemList snapshot={snapshot} navigation={navigation} setLoading={setLoading} />
      );
    }
    // otherwise returns an accordion
    return (
      <MultipleItemList snapshot={snapshot} navigation={navigation} setLoading={setLoading} />
    );
  }

  return (
    <ScrollView contentContainerStyle={ResourcesItemListStyle.scrollviewContainer}>
      {loading
      && (
      <ActivityIndicator size="large" />
      )}
      { singleOrMultipleDocs() }
    </ScrollView>
  );
}

const ResourcesItemListStyle = StyleSheet.create({
  scrollviewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

ResourcesItemListScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.getParam('header'),
});

ResourcesItemListScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
