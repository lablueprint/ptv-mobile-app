import React from 'react';
import { Title } from 'react-native-paper';
import {
  View, TouchableOpacity, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 30,
    backgroundColor: '#ffffff',
    borderRadius: 15,
  },
  text: {
    alignSelf: 'center',
  },
});

export default function ForumCategoryCard({
  children, navigate,
}) {
  return (
    <TouchableOpacity onPress={navigate}>
      <View style={styles.container}>
        <Title style={styles.text}>
          {children}
        </Title>
      </View>
    </TouchableOpacity>
  );
}
ForumCategoryCard.propTypes = {
  children: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};
