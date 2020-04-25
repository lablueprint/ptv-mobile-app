import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Title, Button, Avatar,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import { theme } from '../../style';
import TabLayout from './TabLayout';


const INITIAL_STATE = {
  name: '',
};

export default class ProfileHomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.onEditProfilePress = this.onEditProfilePress.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ name: user.displayName });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onEditProfilePress() {
    const { navigation } = this.props;
    navigation.navigate('EditProfile');
  }


  render() {
    const {
      name,
    } = this.state;
    return (
      <View style={ProfileHomeStyles.container}>
        <Avatar.Icon size={150} style={{ alignSelf: 'center' }} icon="account" />
        <View style={ProfileHomeStyles.rowContainer}>
          <Title style={{ alignSelf: 'center' }}>
            {name}
          </Title>
          <Button icon="pencil" onPress={this.onEditProfilePress} />
        </View>
        <View style={ProfileHomeStyles.container}>
          <TabLayout />
        </View>
      </View>
    );
  }
}

const ProfileHomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});


ProfileHomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
