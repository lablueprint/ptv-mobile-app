import React from 'react';
import {
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Title, Button, Avatar,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../style';
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

  onEditProfilePress() {
    const { navigation } = this.props;
    navigation.navigate('EditProfile');
  }

  componentWillUmount() {
    this.unsubscribe();
  }

  render() {
    const {
      name,
    } = this.state;
    return (
      <View style={styles.container2}>
        <Avatar.Icon size={150} style={{ marginLeft: '32%' }} icon="account" /* source={require('../assets/avatar.png')} */ />
        <View style={{ flexDirection: 'row' }}>
          <Title style={{ marginLeft: '40%' }}>
            {name}
          </Title>
          <Button icon="pencil" onPress={this.onEditProfilePress} />
        </View>
        <View style={styles.container2}>
          <TabLayout style={styles.textInputMedium} />
        </View>
      </View>
    );
  }
}

ProfileHomeScreen.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};
