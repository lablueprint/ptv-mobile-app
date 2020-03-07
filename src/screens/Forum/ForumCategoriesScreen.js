import React from 'react';
import { View, Text, Button } from 'react-native';
import PropTypes from 'prop-types';

export default function ForumCategoriesScreen(props) {
  const { navigation } = props;

  const handlePress = () => {
    // Navigate to ForumCategoryPostScreen
    navigation.navigate('ForumSubcategoryPosts', { categoryID: 'jqGCPOWzrWZvpyQpPnO2' });
  };

  return (
    <View>
      <Text>Not implemented</Text>
      <Button title="Housing" onPress={handlePress} />
    </View>
  );
}

ForumCategoriesScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
