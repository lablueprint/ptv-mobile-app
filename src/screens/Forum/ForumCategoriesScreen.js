import React, { useState } from 'react';
import {
  ScrollView, Text, View, StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import ForumCategoryCard from './ForumCategoryCard';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#daecf5',
  },
});

export default function ForumCategoriesScreen() {
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
      setCategoryList(
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
          .map((forum) => (
            <ForumCategoryCard key={forum.id}>
              {forum.title}
            </ForumCategoryCard>
          )),
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
