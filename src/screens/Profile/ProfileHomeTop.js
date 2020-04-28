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
import { withNavigation } from 'react-navigation';
import { theme } from '../../style';

const INITIAL_STATE = {
  name: '',
};

class ProfileHomeTop extends React.Component {
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
      <View>
        <Avatar.Icon size={150} style={profileHomeTopStyles.avatar} icon="account" />
        <View style={profileHomeTopStyles.rowContainer}>
          <Title style={{ alignSelf: 'center' }}>
            {name}
          </Title>
          <Button icon="pencil" onPress={this.onEditProfilePress} />
        </View>
      </View>
    );
  }
}

const profileHomeTopStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatar: {
    alignSelf: 'center',
    marginTop: 12,
  },
});

ProfileHomeTop.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
};

export default withNavigation(ProfileHomeTop);
