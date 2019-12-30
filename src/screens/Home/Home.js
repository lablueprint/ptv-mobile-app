// Home.js
import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth';

class Home extends React.Component {
  state = { currentUser: null }

  componentDidMount() {
    const { currentUser } = auth()
    this.setState({ currentUser })
    console.log("it worked")
  }

  render() {
    const { currentUser } = this.state
    return (
      <View style={styles.container}>
        <Text>
          Hi {currentUser && currentUser.email}! React-Native sucks.
        </Text>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Home;