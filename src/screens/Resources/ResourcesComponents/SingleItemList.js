import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import PropTypes from 'prop-types';
import { nav } from '../../../constants';
import ListStyles from './ItemListStyles';

export default function SingleItemList({ snapshot, navigation, setLoading }) {
  const data = snapshot.docs[0].data();
  const { id } = snapshot.docs[0];
  const [singleActive, setSingleActive] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setSingleActive(!singleActive)}
        style={ListStyles.header}
      >
        <View style={ListStyles.headerText}>
          <Text style={ListStyles.resourceText}>
            {data.title}
          </Text>
        </View>
        <View style={ListStyles.headerIcon}>
          <Icon name={singleActive ? 'chevron-up' : 'chevron-down'} />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={!singleActive} style={ListStyles.content}>
        <Text>
          {data.description}
        </Text>

        <View style={ListStyles.moreButton}>
          <Text
            style={ListStyles.resourceText}
            onPress={() => {
              setLoading(true);
              navigation.push(nav.item, { resourceID: id });
            }}
          >
            More&nbsp;
            <Icon name="chevron-right" />
          </Text>
        </View>
      </Collapsible>
    </View>
  );
}

SingleItemList.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  snapshot: PropTypes.shape({
    docs: PropTypes.array.isRequired,
  }).isRequired,
  setLoading: PropTypes.func.isRequired,
};
