import React from 'react';
import {
  ScrollView, Picker, Alert, StyleSheet, View,
} from 'react-native';
import {
  TextInput, Button, Text,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PropTypes from 'prop-types';
import { theme } from '../../style';

const INITIAL_STATE = {
  title: '',
  body: '',
  errorMessageTitle: null,
  errorMessageBody: null,
  errorMessageFirestore: null,
  userID: '',
  categoryID: '',
  forumCategories: [],
  approved: false,
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

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleAlertPress() {
    const { navigation } = this.props;
    navigation.navigate('ForumHome');
  }

  handleSubmit() {
    const {
      title, body, userID, categoryID, approved,
    } = this.state;

    if (title.length > 0 && body.length > 0) {
      firestore().collection('forum_posts')
        .add({
          userID,
          title,
          body,
          createdAt: firestore.Timestamp.now(),
          updatedAt: firestore.Timestamp.now(),
          categoryID,
          approved,
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
    } else {
      if (title.length === 0) {
        this.setState({ errorMessageTitle: 'Please Enter Title Before Submitting' });
      }
      if (body.length === 0) {
        this.setState({ errorMessageBody: 'Please Enter Text Before Submitting' });
      }
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
      <ScrollView style={createForumPostStyles.container}>
        {errorMessageFirestore
        && (
          <Text style={{ color: 'red' }}>
            {errorMessageFirestore}
          </Text>
        )}
        <Text style={createForumPostStyles.text}>Title</Text>
        <TextInput
          style={createForumPostStyles.titleTextInput}
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
        <View style={createForumPostStyles.pickerBorder}>
          <Picker
            selectedValue={categoryID}
            style={createForumPostStyles.picker}
            onValueChange={(itemValue) => this.setState({ categoryID: itemValue })}
          >
            {pickerItems}
          </Picker>
        </View>

        <Text style={createForumPostStyles.text}>Body</Text>
        <TextInput
          style={createForumPostStyles.bodyTextInput}
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

      </ScrollView>
    );
  }
}

const createForumPostStyles = StyleSheet.create({
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

CreateForumPostScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
