import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Title, Button,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onBackPress = this.onBackPress.bind(this);
  }

  onBackPress() {
    const { navigation } = this.props;
    navigation.navigate('ProfileHome');
  }

  render() {
    const { headerTitle } = this.props;
    return (
      <View>
        <View style={HeaderStyles.headerContainer}>
          <Button
            icon="arrow-left"
            onPress={this.onBackPress}
            style={HeaderStyles.backButton}
          />
          <Title style={HeaderStyles.headerTitle}>{headerTitle}</Title>
        </View>
      </View>
    );
  }
}

const HeaderStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    marginTop: 15,
    marginBottom: 20,
    position: 'absolute',
    left: 0,
    height: 100,
  },
});

Header.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func }).isRequired,
  headerTitle: PropTypes.string.isRequired,
};

export default withNavigation(Header);
