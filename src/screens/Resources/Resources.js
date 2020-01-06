import React from 'react'
import {  View, 
          FlatList, 
          StyleSheet, 
          Text, 
          Dimensions, 
          TouchableOpacity,
          ImageBackground } from 'react-native';
// import { withFirebase } from '../../config/Firebase';
import firestore from '@react-native-firebase/firestore';

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

function getCategories(docs) {
  result = []
  docs.forEach(doc => {
    result.push(doc.data())
  });
  return result
}

class Resources extends React.Component {
  constructor(props) {
    super(props)
    this.navigation = this.props.navigation
    this.state = {
      loading : true,
      categories : []
    }
  }

  componentDidMount() {
    collection = firestore().collection('resource_categories')
    collection.get().then(result => {
      this.setState({ 
        loading : false,
        categories: getCategories(result) });
      console.log(this.state.categories);
    });
  }

  render () {
    if (this.state.loading) {
      return (
        <View style={styles.wrapper}>
          <ImageBackground
            source={{
              uri:
                "https://miro.medium.com/max/441/1*9EBHIOzhE1XfMYoKz1JcsQ.gif"
            }}
            style={styles.gif}
          ></ImageBackground>
        </View>
      );
    } else {
      return (
      <FlatList
        data={this.state.categories}
        renderItem={({ item }) => 
        <View style={styles.container}>
          <Item title={item.title} navigate={this.navigation.navigate} />
        </View>}
        keyExtractor={item => item.id}
        numColumns={2}
      />
    )}
      }
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
  gif: {
    padding: 50
  },
  wrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
});

export default Resources;