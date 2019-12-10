import React from 'react'
import { View, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second',
  },
  {
    id: '58694a0f-3da1-491f-bd96-145571e29d72',
    title: 'Third',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Fourth',
  },
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First',
  },
  {
    id: '3ac68afc-c605-42d3-a4f8-fbd91aa97f63',
    title: 'Second',
  },
  {
    id: '58694a0f-3da1-411f-bd96-145571e29d72',
    title: 'Third',
  },
  {
    id: '58694a0f-3da1-451f-bd96-145571e29d72',
    title: 'Fourth',
  },
];
const size = Dimensions.get('window').width/2;

function Item({ title, navigate }) {
  return (
    <TouchableOpacity
      onPress={() => navigate('Home')} >
      <View style={styles.item}>
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

class Resources extends React.Component {
  constructor(props) {
    super(props)
    this.navigation = this.props.navigation
  }
  render () {
    return(
      <FlatList
        data={DATA}
        renderItem={({ item }) => 
        <View style={styles.container}>
          <Item title={item.title} navigate={this.navigation.navigate} />
        </View>}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    )}
}

const styles = StyleSheet.create({
  container: {
    // width: size,
    // height: size
    flex: 1
  },
  item: {
    flex: 1,
    margin: 3,
    backgroundColor: 'lightblue',
  },
  title: {
    fontSize: 16,
  },
});

export default Resources;