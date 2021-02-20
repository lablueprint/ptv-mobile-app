import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

export default function HomeIcons({ snapshot, loading, loadScreen }) {
  if (snapshot === null) {
    return (null);
  }

  return (
    snapshot.docs.map((doc) => {
      const {
        title, thumbnail,
      } = doc.data();

      if (doc.id!="new")
      {
        return (
          <TouchableOpacity
            style={HomeStyles.categoryButton}
            key={doc.id}
            disabled={loading}
            onPress={() => loadScreen(doc.id, title)}
          >
            <Image source={{ uri: thumbnail.src }} style={HomeStyles.categoryImage} />
            <Text style={HomeStyles.categoryText}>
              {title}
            </Text>
          </TouchableOpacity>
        );
      }
    })
  );
}

const HomeStyles = StyleSheet.create({
  categoryButton: {
    aspectRatio: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  categoryImage: {
    flex: 0.001,
    width: '45%',
    aspectRatio: 1,
  },
  categoryText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});

HomeIcons.propTypes = {
  loadScreen: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
