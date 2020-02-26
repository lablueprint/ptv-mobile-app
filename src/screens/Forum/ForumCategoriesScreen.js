import React from "react";
import { ScrollView, Text } from "react-native";
import { blue100 } from "react-native-paper/lib/typescript/src/styles/colors";

const styles = StyleSheet.create({
  categories: {
    backgroundColor: blue100
  }
});

export default function ForumCategoriesScreen() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [forumCategories, setCategoryList] = useState([]);

  firestore()
    .collection("forum_categories")
    .get()
    .then(snapshot => {
      const forum_categories = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setCategoryList(
        forum_categories
          .sort((a, b) => {
            const aMillis = a.time.toMillis();
            const bMillis = b.time.toMillis();
            if (aMillis > bMillis) {
              return -1;
            }
            if (aMillis < bMillis) {
              return 1;
            }
            return 0;
          })
          .map(forum_categories => {
            return (
              <TouchableOpacity style={styles.categories}>
                {forum_categories.forum_categories}
              </TouchableOpacity>
              // to do: create component for forum categories
            );
          })
      );
    })
    .catch(error => {
      setErrorMessage(error.message);
    });

  return (
    <ScrollView>
      {errorMessage && <Text>{errorMessage}</Text>}
      {forumCategories}
    </ScrollView>
  );
}
