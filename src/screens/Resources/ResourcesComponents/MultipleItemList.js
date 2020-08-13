import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native-paper';
import { View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import PropTypes from 'prop-types';
import { nav } from '../../../constants';
import ListStyles from './ItemListStyles';


export default function MultipleItemList({ snapshot, navigation, setLoading }) {
  const [activeSections, setActiveSections] = useState([]);

  function renderHeader(doc, _, isActive) {
    return (
      <View style={ListStyles.header}>
        <View style={ListStyles.headerText}>
          <Text style={ListStyles.resourceText}>
            {doc.data.title}
          </Text>
        </View>
        <View style={ListStyles.headerIcon}>
          <Icon name={isActive ? 'chevron-up' : 'chevron-down'} />
        </View>
      </View>
    );
  }

  function renderContent(doc) {
    return (
      <View style={ListStyles.content}>
        <Text>
          {doc.data.description}
        </Text>

        <View style={ListStyles.moreButton}>
          <Text
            style={ListStyles.resourceText}
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

MultipleItemList.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  snapshot: PropTypes.shape({
    docs: PropTypes.array.isRequired,
  }).isRequired,
  setLoading: PropTypes.func.isRequired,
};
