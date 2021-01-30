import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import {
  ScrollView, Picker, Alert, StyleSheet, View,
} from 'react-native';
import {
  TextInput, Button, Text,
} from 'react-native-paper';
// import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { theme } from '../../style';

export default function EditForumPostScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errorMessageTitle, setErrorMessageTitle] = useState(null);
  const [errorMessageBody, setErrorMessageBody] = useState(null);
  const [errorMessageFirestore, setErrorMessageFirestore] = useState(null);

  const postID = navigation.getParam('postID');

  const [categoryID, setCategoryID] = useState('');

  /* TO DO: Mount Categories ID */
  /*
    const [forumCategories, setForumCategories] = useState([]);
    firestore().collection('forum_categories')
        .get()
        .then((snapshot) => {
          const forumCategories = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          this.setState({ forumCategories });
        });
      this.unsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({ userID: user.uid });
        }
      });
  */

  const getData = useCallback(async () => {
    // setLoading(true);

    /* Query forum post data from postid passed in through navigation */
    const postSnap = await firestore().collection('forum_posts').doc(postID)
      .get();
    const postData = postSnap.data();

    /* Get forum post details */
    const postTitle = postData.title || 'Title unset';
    const postBody = postData.body || 'Body unset';

    setTitle(postTitle);
    setBody(postBody);
  }, [postID]);

  /* Writes reply data to Firebase/Firestore */
  const sendData = useCallback(async () => {
    const postTitle = title;
    const postBody = body;

    if (title.length === 0) {
      setErrorMessageTitle('Please Do Not Leave Title Empty');
    }
    if (body.length === 0) {
      setErrorMessageBody('Please Do Not Leave Text Empty');
    }
    if (title.length > 0 && body.length > 0) {
      firestore().collection('forum_posts').doc(postID)
        .update({
          title: postTitle,
          body: postBody,
          updatedAt: firestore.Timestamp.now(),
          /* TO DO: update catogories */
        })
        .then(() => {
          Alert.alert('',
            'Post updated!',
            [
              { text: 'OK', onPress: () => navigation.navigate('ForumHome') },
            ]);
        })
        .catch((error) => {
          setErrorMessageFirestore(error.message);
        });
    }
  }, [body, title, postID, navigation]);

  useEffect(() => {
    getData();
  }, [getData]);

  // Set up ref for text inputs
  const titleInput = useRef(null);
  const bodyInput = useRef(null);

  // const pickerItems = forumCategories.map((categoryValue) => (
  //   <Picker.Item
  //     label={categoryValue.title}
  //     value={categoryValue.id}
  //     key={categoryValue.id}
  //   />
  // ));

  return (
    <ScrollView style={editForumPostStyles.container}>
      {errorMessageFirestore && (
        <Text style={{ color: 'red' }}>
          {errorMessageFirestore}
        </Text>
      )}
      <Text style={editForumPostStyles.text}>Title</Text>
      <TextInput
        style={editForumPostStyles.titleTextInput}
        onChangeText={(text) => setTitle(text)}
        placeholder="Enter Title"
        value={title}
        ref={titleInput}
        onSubmitEditing={() => titleInput.focus()}
        returnKeyType="next"
      />
      {errorMessageTitle && (
        <Text style={{ color: 'red' }}>
          {errorMessageTitle}
        </Text>
      )}
      <View style={editForumPostStyles.pickerBorder}>
        <Picker
          selectedValue={categoryID}
          style={editForumPostStyles.picker}
          onValueChange={(itemValue) => setCategoryID(itemValue)}
        >
          {/* {pickerItems} */}
        </Picker>
      </View>

      <Text style={editForumPostStyles.text}>Body</Text>
      <TextInput
        style={editForumPostStyles.bodyTextInput}
        onChangeText={(text) => setBody(text)}
        placeholder="Enter Forum Post"
        value={body}
        ref={bodyInput}
        onSubmitEditing={sendData}
        returnKeyType="go"
      />
      {errorMessageBody
        && (
        <Text style={{ color: 'red' }}>
          {errorMessageBody}
        </Text>
        )}
      <Button onPress={sendData}>
        Post
      </Button>
    </ScrollView>
  );
}

const editForumPostStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingTop: 20,
    paddingLeft: 20,
  },
  text: {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular.fontFamily,
    fontWeight: theme.fonts.regular.fontWeight,
    fontSize: 16,
    marginLeft: 12,
  },
  titleTextInput: {
    height: 40,
    width: '90%',
    borderColor: '#3190D0',
    borderRadius: 20,
    borderWidth: 2,
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  bodyTextInput: {
    height: 275,
    width: '90%',
    borderWidth: 2,
    borderColor: '#3190D0',
    borderRadius: 20,
    marginTop: 8,
    backgroundColor: '#ffffff',
  },
  pickerBorder: {
    height: 50,
    width: '90%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8EAEC3',
    marginTop: 20,
    marginBottom: 15,
  },
});

// EditForumPostScreen.propTypes = {
//   navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
// };

EditForumPostScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};
