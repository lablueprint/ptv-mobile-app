import React, { useState } from 'react';
import {
  ScrollView, Text,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Forum from './ForumCategoriesComponent';


// const styles = StyleSheet.create({
//   categories: {
//     backgroundColor: blue100
//   }
// });


export default function ForumCategoriesScreen() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [forumCategories, setCategoryList] = useState([]);

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
            if (a.title < b.title) { return -1; }
            if (a.title > b.title) { return 1; }
            return 0;
          })
          .map((forum) => (
            <Forum key={forum.id}>
              {forum.title}
            </Forum>
            // to do: create component for forum categories
          )),
      );
    })
    .catch((error) => {
      setErrorMessage(error.message);
    });


  return (
    <ScrollView>
      {errorMessage && <Text>{errorMessage}</Text>}
      {forumCategories}
    </ScrollView>
  );
}
