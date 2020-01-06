  
// import * as firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";
import * as firebase from '@react-native-firebase/app';
import "@react-native-firebase/firestore";
import "@react-native-firebase/auth";

// const config = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID
// };

const Firebase = {
  // constructor() {
  //   this.firestore = firebase.firestore();
  //   this.auth = firebase.auth();
  //   this.doSignOut = this.doSignOut.bind(this);
  //   //this.getCategories = this.getCategories.bind(this);
  // }
  getCategories: async () => {
    collection = firebase.firestore().collection('resource_categories')
    console.log("this is a problem")
    return await collection.get()
  },
  // doSignOut() {
  //   return this.auth.signOut();
  // }
}
export default Firebase;
