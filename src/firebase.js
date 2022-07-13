import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyAh2C57rAHZO_DJYA4784lwOIKSHpPlFig",
    authDomain: "diagrams-42de5.firebaseapp.com",
    databaseURL: "https://diagrams-42de5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "diagrams-42de5",
    storageBucket: "diagrams-42de5.appspot.com",
    messagingSenderId: "252550667226",
    appId: "1:252550667226:web:c7b5c61e0f56ba011b3ee3"
};

const app = firebase.initializeApp(firebaseConfig);
window.firebase = firebase;

export {app, firebase, firebaseConfig}