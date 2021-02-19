import { StyleSheet } from 'react-native';
import { theme } from '../../../style';

const ListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#ffffff',
  },
  headerText: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerIcon: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingTop: 0,
    backgroundColor: '#ffffff',
  },
  moreButton: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  resourceText: {
    fontWeight: 'bold',
  },
});

export default ListStyles;
