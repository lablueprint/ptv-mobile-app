import React from 'react';
import {
  ScrollView, StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import {
  Text, ActivityIndicator,
} from 'react-native-paper';
import { theme } from '../../style';
import { SubcategoryIcons } from './ResourcesComponents';
import useLoadScreen from './LoadScreen';


export default function ResourcesSubcategoriesScreen(props) {
  const { navigation } = props;
  const snapshot = navigation.getParam('snapshot');
  const [loadingNextScreen, errorMessage, loadScreen] = useLoadScreen(navigation);

  return (
    <ScrollView contentContainerStyle={SubcategoriesStyles.scrollviewContainer}>
      {errorMessage
        && (
        <Text style={{ color: 'red' }}>
          {errorMessage}
        </Text>
        )}
      {loadingNextScreen && !errorMessage
        && (
        <ActivityIndicator size="large" />
        )}
      {!loadingNextScreen && !errorMessage
        && (
        <SubcategoryIcons
          snapshot={snapshot}
          loading={loadingNextScreen}
          loadScreen={loadScreen}
        />
        )}
    </ScrollView>
  );
}

const SubcategoriesStyles = StyleSheet.create({
  scrollviewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  subcategoryButtonHeight: {
    height: 125,
  },
  subcategoryButton: {
    width: '90%',
    marginTop: 20,
  },
  resourceText: {
    fontWeight: 'bold',
  },
});

ResourcesSubcategoriesScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: navigation.getParam('header'),
});

ResourcesSubcategoriesScreen.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
