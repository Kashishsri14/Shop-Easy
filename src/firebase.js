// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// import firebase from "firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth"
import "firebase/compat/firestore"
const firebaseConfig = {
    apiKey: "",
    authDomain: "challenge-75ee6.firebaseapp.com",
    projectId: "challenge-75ee6",
    storageBucket: "challenge-75ee6.appspot.com",
    messagingSenderId: "336831562815",
    appId: "1:336831562815:web:5e54bd993f64f17a64248a",
    measurementId: "G-PBZGYS61LF"
}; 
const firebaseApp =  firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db,auth};