import React, { useState } from 'react';
import {
  ScrollView, Text, View, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import ForumCategoryCard from './ForumCategoryCard';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#daecf5',
  },
});


export default function ForumCategoriesScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [forumCategories, setForumCategories] = useState([]);


  firestore()
    .collection('forum_categories')
    .get()
    .then((snapshot) => {
      const forumCategoriesData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setForumCategories(
        forumCategoriesData
          .sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          })
          .map((forum) => {
            const navigateToSubcategory = () => navigation.navigate('ForumSubcategoryPosts', { categoryID: forum.id });
            return (
              <ForumCategoryCard key={forum.id} navigate={navigateToSubcategory}>
                {forum.title}
              </ForumCategoryCard>
            );
          }),
      );
    })
    .catch((error) => {
      setErrorMessage(error.message);
    });

  return (
    <View style={styles.container}>
      <ScrollView>
        {errorMessage && <Text>{errorMessage}</Text>}
        {forumCategories}
      </ScrollView>
    </View>
  );
}

ForumCategoriesScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
