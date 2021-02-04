import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDmo_MS8KpULKhkZxZoSKPLSsdDt3YlEF4",
    authDomain: "instagram-clone-e92a2.firebaseapp.com",
    projectId: "instagram-clone-e92a2",
    storageBucket: "instagram-clone-e92a2.appspot.com",
    messagingSenderId: "330881941798",
    appId: "1:330881941798:web:c7c72214e9b0c2400281e7",
    measurementId: "G-ZFMQ0LCHE7"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

