import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import PropTypes from 'prop-types';
import { nav } from '../../../constants';
import { theme } from '../../../style';

export default function SingleItemList({ snapshot, navigation, setLoading }) {
  const data = snapshot.docs[0].data();
  const { id } = snapshot.docs[0];
  const [singleActive, setSingleActive] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setSingleActive(!singleActive)}
        style={SingleItemStyles.header}
      >
        <View style={SingleItemStyles.headerText}>
          <Text style={SingleItemStyles.resourceText}>
            {data.title}
          </Text>
        </View>
        <View style={SingleItemStyles.headerIcon}>
          <Icon name={singleActive ? 'chevron-up' : 'chevron-down'} />
        </View>
      </TouchableOpacity>
      <Collapsible collapsed={!singleActive} style={SingleItemStyles.content}>
        <Text>
          {data.description}
        </Text>

        <View style={SingleItemStyles.moreButton}>
          <Text
            style={SingleItemStyles.resourceText}
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

const SingleItemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  headerText: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerIcon: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
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

SingleItemList.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  snapshot: PropTypes.shape({
    docs: PropTypes.array.isRequired,
  }).isRequired,
  setLoading: PropTypes.func.isRequired,
};
