import React from 'react';
import {
  View, TextInput, Text, Button,
} from 'react-native';


const INITIAL_STATE = {
  title: '',
  body: '',
};

export default class CreateForumPostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick() {
    const { title, body } = this.state;
    console.log('title');
    console.log(title);
    console.log('body');
    console.log(body);
  }

  render() {
    const {
      title, body,
    } = this.state;
    return (
      <View>
        <Text>Title</Text>
        <TextInput
          onChangeText={(text) => this.setState({ title: text })}
          placeholder="Enter Title"
          value={title}
        />
        <Text>Body</Text>
        <TextInput
          onChangeText={(text) => this.setState({ body: text })}
          placeholder="Enter Body of Message"
          value={body}
        />
        <Button
          title="Submit"
          onPress={this.handleOnClick}
        />
      </View>
    );
  }
}
