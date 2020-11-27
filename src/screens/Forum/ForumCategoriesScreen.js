import React, { useState, useEffect } from 'react';
import {
  ScrollView, Text, View, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import ForumCategoryCard from './ForumCategoryCard';
import { theme } from '../../style';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: theme.colors.background,
  },
});

export default function ForumCategoriesScreen({ navigation }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [forumCategories, setForumCategories] = useState([]);

  useEffect(() => { /* Put firestore query inside useEffect hook to prevent infinite loop */
    firestore()
      .collection('forum_categories')
      .orderBy('title')
      .get()
      .then((snapshot) => {
        const forumCategoriesData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setForumCategories(
          forumCategoriesData
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
  }, [navigation]);

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
