import React, { useState } from 'react';
import {
  ScrollView, View, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Text, ActivityIndicator,
} from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationEvents } from 'react-navigation';
import { theme } from '../../style';
import { nav } from './variables';

export default function ResourcesItemListScreen(props) {
  const { navigation } = props;
  const snapshot = navigation.getParam('snapshot');
  const [loading, setLoading] = useState(false);
  const [activeSections, setActiveSections] = useState([]);
  const [singleActive, setSingleActive] = useState(false);

  function renderHeader(doc, _, isActive) {
    return (
      <View style={ItemListStyles.accordionHeader}>
        <View style={ItemListStyles.accordionHeaderText}>
          <Text style={ItemListStyles.resourceText}>
            {doc.data().title}
          </Text>
        </View>
        <View style={ItemListStyles.accordionHeaderIcon}>
          <Icon name={isActive ? 'chevron-up' : 'chevron-down'} />
        </View>
      </View>
    );
  }

  function renderContent(doc) {
    return (
      <View style={ItemListStyles.accordionContent}>
        <Text>
          {doc.data().description}
        </Text>

        <View style={ItemListStyles.moreButton}>
          <Text
            style={ItemListStyles.resourceText}
            onPress={() => {
              setLoading(true);
              navigation.push(nav.item, { resourceID: doc.id });
            }}
          >
            More
            {' '}
            <Icon name="chevron-right" />
          </Text>
        </View>
      </View>
    );
  }

  function updateSections(currActive) {
    setActiveSections(currActive);
  }

  function singleOrMultipleDocs() {
    // returns a collapsible if there is only 1 doc
    if (snapshot.docs.length === 1) {
      const doc = snapshot.docs[0];
      return (
        <View>
          <TouchableOpacity
            onPress={() => setSingleActive(!singleActive)}
            style={ItemListStyles.accordionHeader}
          >
            <View style={ItemListStyles.accordionHeaderText}>
              <Text style={ItemListStyles.resourceText}>
                {doc.data().title}
              </Text>
            </View>
            <View style={ItemListStyles.accordionHeaderIcon}>
              <Icon name={singleActive ? 'chevron-up' : 'chevron-down'} />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={!singleActive} style={ItemListStyles.accordionContent}>
            <Text>
              {doc.data().description}
            </Text>

            <View style={ItemListStyles.moreButton}>
              <Text
                style={ItemListStyles.resourceText}
                onPress={() => {
                  setLoading(true);
                  navigation.push(nav.item, { resourceID: doc.id });
                }}
              >
                More
                {' '}
                <Icon name="chevron-right" />
              </Text>
            </View>
          </Collapsible>
        </View>
      );
    }
    // otherwise returns an accordion
    return (
      <Accordion
        sectionContainerStyle={{ paddingBottom: 8 }}
        disabled={loading}
        sections={snapshot.docs}
        activeSections={activeSections}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={ItemListStyles.scrollviewContainer}>
      <NavigationEvents
        onWillFocus={() => {
          setLoading(false);
        }}
      />
      {loading
        && (
        <ActivityIndicator size="large" />
        )}
      { singleOrMultipleDocs() }
    </ScrollView>
  );
}

const ItemListStyles = StyleSheet.create({
  scrollviewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  accordionHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  accordionHeaderText: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  accordionHeaderIcon: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  accordionContent: {
    padding: 15,
    paddingTop: 0,
    backgroundColor: '#ffffff',
  },
  moreButton: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  resourceText: {
    fontWeight: 'bold',
  },
});

ResourcesItemListScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.getParam('header'),
});

ResourcesItemListScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
