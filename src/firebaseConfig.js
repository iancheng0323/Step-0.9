import firebase from "firebase/app"

// Add the Firebase products that you want to use
import "firebase/firestore"
// import "firebase/analytics"

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyD0RkGppZWVh154KL-p-ERyia7AnxZc27M",
    authDomain: "stepbeta-1.firebaseapp.com",
    databaseURL: "https://stepbeta-1.firebaseio.com",
    projectId: "stepbeta-1",
    storageBucket: "stepbeta-1.appspot.com",
    messagingSenderId: "316885807181",
    appId: "1:316885807181:web:ed84d9624b48e6af",
    measurementId: "G-Z43Y8Z29YX"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
export default db