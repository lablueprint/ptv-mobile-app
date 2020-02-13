import React from 'react';
import {
  View, TextInput, Text, Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const INITIAL_STATE = {
  title: '',
  body: '',
  errorMessageTitle: null,
  errorMessageBody: null,
  userID: '',
};

export default class CreateForumPostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ userID: user.uid });
      }
    });
  }


  handleOnClick() {
    const {
      title, body, userID,
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
        Author: '',
        createdAt: firestore.Timestamp.now(),
      })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
      this.setState({ title: '' });
      this.setState({ body: '' });
    }
  }


  render() {
    const {
      title, body, errorMessageTitle, errorMessageBody,
    } = this.state;
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
          title="Submit"
          onPress={this.handleOnClick}
        />
      </View>
    );
  }
}
