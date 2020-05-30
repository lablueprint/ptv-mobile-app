import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import PropTypes from 'prop-types';
import { nav } from '../../../constants';


export default function MultipleItemList({ snapshot, navigation, setLoading }) {
  const [activeSections, setActiveSections] = useState([]);

  function renderHeader(doc, _, isActive) {
    return (
      <View style={MultipleItemStyles.accordionHeader}>
        <View style={MultipleItemStyles.accordionHeaderText}>
          <Text style={MultipleItemStyles.resourceText}>
            {doc.data.title}
          </Text>
        </View>
        <View style={MultipleItemStyles.accordionHeaderIcon}>
          <Icon name={isActive ? 'chevron-up' : 'chevron-down'} />
        </View>
      </View>
    );
  }

  function renderContent(doc) {
    return (
      <View style={MultipleItemStyles.accordionContent}>
        <Text>
          {doc.data.description}
        </Text>

        <View style={MultipleItemStyles.moreButton}>
          <Text
            style={MultipleItemStyles.resourceText}
            onPress={() => {
              setLoading(true);
              navigation.push(nav.item, { resourceID: doc.id });
            }}
          >
            More&nbsp;
            <Icon name="chevron-right" />
          </Text>
        </View>
      </View>
    );
  }

  function updateSections(currActive) {
    setActiveSections(currActive);
  }

  return (
    <Accordion
      sectionContainerStyle={{ paddingBottom: 8 }}
      sections={snapshot.docs.map((doc) => ({ data: doc.data(), id: doc.id }))}
      activeSections={activeSections}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={updateSections}
    />
  );
}

const MultipleItemStyles = StyleSheet.create({

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

MultipleItemList.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  snapshot: PropTypes.shape({
    docs: PropTypes.array.isRequired,
  }).isRequired,
  setLoading: PropTypes.func.isRequired,
};
