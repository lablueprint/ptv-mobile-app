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
import { theme } from '../../style';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.onBackPress = this.onBackPress.bind(this);
  }

  onBackPress() {
    const { navigation } = this.props;
    navigation.goBack(null);
  }

  render() {
    const { headerTitle } = this.props;
    return (
      <View>
        <View style={headerStyles.headerContainer}>
          <Button
            icon="arrow-left"
            color="#ffffff"
            onPress={this.onBackPress}
            style={headerStyles.backButton}
          />
          <Title style={headerStyles.headerTitle}>{headerTitle}</Title>
        </View>
      </View>
    );
  }
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    color: theme.colors.headerText,
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
  navigation: PropTypes.shape({ goBack: PropTypes.func }).isRequired,
  headerTitle: PropTypes.string.isRequired,
};

export default withNavigation(Header);
