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

const size = Dimensions.get('window').width/2;

function Item({ title, navigate }) {
  return (
    <View style={styles.itemContainer}>
    <TouchableOpacity
      onPress={() => navigate('Home')}
      style={styles.item} >
        <Text>{title}</Text>
    </TouchableOpacity>
    </View>
    
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
    width: size,
    height: size,
    flex: 1
  },
  item: {
    flex: 1,
    margin: 3,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
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