import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  text: {
    alignSelf: 'center',
  },
});

export default function Forum({
  children,
}) {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.text}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>

  );
}
Forum.propTypes = {
  children: PropTypes.string.isRequired,
};
