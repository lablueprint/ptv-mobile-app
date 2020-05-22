import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';

export default function HomeIcons({ snapshot, loading, loadScreen }) {
  return (
    snapshot.docs.map((doc) => {
      const {
        title, thumbnail,
      } = doc.data();

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
    })
  );
}

const HomeStyles = StyleSheet.create({
  categoryButton: {
    aspectRatio: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  categoryImage: {
    width: '40%',
    aspectRatio: 1,
  },
  categoryText: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});
