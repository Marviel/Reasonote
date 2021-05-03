import firebase from 'firebase';

/**
 * Create and initialize firebase
 */
 const firebaseConfig = {
    apiKey: "AIzaSyCbxStF77J5Y7gKqdvm_BQolDN9IVgSxGE",
    authDomain: "reasonote-test.firebaseapp.com",
    projectId: "reasonote-test",
    storageBucket: "reasonote-test.appspot.com",
    messagingSenderId: "95771625759",
    appId: "1:95771625759:web:88f606efe5cb6dfe70882a",
    measurementId: "G-1S0DQGMLRY"
};
firebase.initializeApp(firebaseConfig)
export const fbdb = firebase.firestore()