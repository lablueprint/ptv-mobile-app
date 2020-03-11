import React from 'react';
import {
  View, Picker, Alert,
} from 'react-native';
import {
  TextInput, Button, Text,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';

const INITIAL_STATE = {
  title: '',
  body: '',
  errorMessageTitle: null,
  errorMessageBody: null,
  errorMessageFirestore: null,
  userID: '',
  categoryID: '',
  forumCategories: [],
};

export default class CreateForumPostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAlertPress = this.handleAlertPress.bind(this);
  }

  componentDidMount() {
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
  }

  componentWillUmount() {
    this.unsubscribe();
  }

  handleAlertPress() {
    const { navigation } = this.props;
    /* TODO: Navigation will navigate to a Pending Post Screen */
    navigation.navigate('ForumHome');
  }

  handleSubmit() {
    const {
      title, body, userID, categoryID,
    } = this.state;
    if (title.length === 0) {
      this.setState({ errorMessageTitle: 'Please Enter Title Before Submitting' });
    }
    if (body.length === 0) {
      this.setState({ errorMessageBody: 'Please Enter Text Before Submitting' });
    }
    if (title.length > 0 && body.length > 0) {
      firestore().collection('forum_posts')
        .add({
          userID,
          title,
          body,
          createdAt: firestore.Timestamp.now(),
          updatedAt: firestore.Timestamp.now(),
          categoryID,
        })
        .then(() => {
        /* TODO: Navigate backwards and use a dialogue instead of an alert */
          this.setState(INITIAL_STATE);
          Alert.alert('',
            'Thank you for contributing to our community! Your post is being sent to our team for approval',
            [
              { text: 'OK', onPress: this.handleAlertPress },
            ]);
        })
        .catch((error) => {
          this.setState({ errorMessageFirestore: error.message });
        });
    }
  }


  render() {
    const {
      title, body, errorMessageTitle, errorMessageBody, categoryID, forumCategories,
      errorMessageFirestore,
    } = this.state;

    const pickerItems = forumCategories.map((categoryValue) => (
      <Picker.Item
        label={categoryValue.title}
        value={categoryValue.id}
        key={categoryValue.id}
      />
    ));
    return (
      <View>
        {errorMessageFirestore
        && (
          <Text style={{ color: 'red' }}>
            {errorMessageFirestore}
          </Text>
        )}
        <Text>Title</Text>
        <TextInput
          onChangeText={(text) => this.setState({ title: text })}
          placeholder="Enter Title"
          value={title}
          onSubmitEditing={() => this.bodyInput.focus()}
          returnKeyType="next"
        />
        {errorMessageTitle
          && (
          <Text style={{ color: 'red' }}>
            {errorMessageTitle}
          </Text>
          )}

        <Picker
          selectedValue={categoryID}
          style={{ height: 50, width: 200 }}
          onValueChange={(itemValue) => this.setState({ categoryID: itemValue })}
        >
          {pickerItems}
        </Picker>

        <Text>Body</Text>
        <TextInput
          onChangeText={(text) => this.setState({ body: text })}
          placeholder="Enter Forum Post"
          value={body}
          ref={(input) => { this.bodyInput = input; }}
          onSubmitEditing={this.handleSubmit}
          returnKeyType="go"

        />
        {errorMessageBody
          && (
          <Text style={{ color: 'red' }}>
            {errorMessageBody}
          </Text>
          )}
        <Button onPress={this.handleSubmit}>
          Post
        </Button>

      </View>
    );
  }
}

CreateForumPostScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
