import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import PropTypes from 'prop-types';

export default function SubcategoryIcons({ snapshot, loading, loadScreen }) {
  return (
    snapshot.docs.map((doc) => {
      const { title } = doc.data();
      return (
        <Button
          contentStyle={SubcategoriesStyles.subcategoryButtonHeight}
          style={SubcategoriesStyles.subcategoryButton}
          key={doc.id}
          uppercase={false}
          disabled={loading}
          mode="contained"
          color="#ffffff"
          onPress={() => loadScreen(doc.id, title)}
        >
          <Text style={SubcategoriesStyles.resourceText}>
            {title}
          </Text>
        </Button>
      );
    })
  );
}

const SubcategoriesStyles = StyleSheet.create({
  subcategoryButtonHeight: {
    height: 125,
  },
  subcategoryButton: {
    width: '90%',
    marginTop: 20,
  },
  resourceText: {
    fontWeight: 'bold',
  },
});

SubcategoryIcons.propTypes = {
  snapshot: PropTypes.shape({
    docs: PropTypes.array.isRequired,
  }).isRequired,
  loadScreen: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
