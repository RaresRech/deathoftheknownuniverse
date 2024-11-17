// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyACh5b_JMNiwApvur2-1U7ChXTPUKj251I",
    authDomain: "deathoftheknownuniverse.firebaseapp.com",
    projectId: "deathoftheknownuniverse",
    storageBucket: "deathoftheknownuniverse.firebasestorage.app",
    messagingSenderId: "1047114748186",
    appId: "1:1047114748186:web:75474e46b69961b2021ca3",
    measurementId: "G-FVSTP4H15H"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
