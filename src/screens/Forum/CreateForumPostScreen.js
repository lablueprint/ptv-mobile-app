import React from 'react';
import {
  View, TextInput, Text, Button, Picker, Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const INITIAL_STATE = {
  title: '',
  body: '',
  errorMessageTitle: null,
  errorMessageBody: null,
  userID: '',
  pickerState: 'Category',
  forumCategories: [],
};

export default class CreateForumPostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleOnClick = this.handleOnClick.bind(this);
  }


  componentDidMount() {
    firestore().collection('forum_categories')
      .get()
      .then((snapshot) => {
        const forumCategories = snapshot.docs.map((doc) => doc.data());
        this.setState({ forumCategories });
      });
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ userID: user.uid });
      }
    });
  }


  handleOnClick() {
    const {
      title, body, userID, pickerState,
    } = this.state;
    if (title.length === 0) {
      this.setState({ errorMessageTitle: 'Please Enter Title Before Submitting' });
    } else {
      this.setState({ errorMessageTitle: null });
    }
    if (body.length === 0) {
      this.setState({ errorMessageBody: 'Please Enter Text Before Submitting' });
    } else {
      this.setState({ errorMessageBody: null });
    }
    if (title.length > 0 && body.length > 0) {
      const ref = firestore().collection('forum_posts');
      ref.add({
        UserID: userID,
        Title: title,
        Body: body,
        CreatedAt: firestore.Timestamp.now(),
        UpdatedAt: firestore.Timestamp.now(),
        category: pickerState,
      })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      this.setState({ pickerState: 'Category' });
      this.setState({ title: '' });
      this.setState({ body: '' });
      Alert.alert('', 'Thank you for contributing to our community! Your post is being sent to our team for approval');
    }
  }

  render() {
    const {
      title, body, errorMessageTitle, errorMessageBody, pickerState, forumCategories,
    } = this.state;

    const pickerItems = forumCategories.map((categoryValue) => (
      <Picker.Item
        label={categoryValue.category}
        value={categoryValue.id}
        key={categoryValue.id}
      />
    ));
    return (
      <View>
        <Text>Title</Text>
        <TextInput
          onChangeText={(text) => this.setState({ title: text })}
          placeholder="Enter Title"
          value={title}
        />
        {errorMessageTitle
          && (
          <Text style={{ color: 'red' }}>
            {errorMessageTitle}
          </Text>
          )}

        <Picker
          selectedValue={pickerState}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue) => this.setState({ pickerState: itemValue })}
        >
          {pickerItems}
        </Picker>

        <Text>Body</Text>
        <TextInput
          onChangeText={(text) => this.setState({ body: text })}
          placeholder="Enter Forum Post"
          value={body}
        />
        {errorMessageBody
          && (
          <Text style={{ color: 'red' }}>
            {errorMessageBody}
          </Text>
          )}
        <Button
          title="Post"
          onPress={this.handleOnClick}
        />
      </View>
    );
  }
}
