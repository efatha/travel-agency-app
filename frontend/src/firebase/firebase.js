// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgJjT1LGFosN5lQG2L-qz5Z8vrSNp_Wws",
  authDomain: "travel-agency-app-eb1c3.firebaseapp.com",
  projectId: "travel-agency-app-eb1c3",
  storageBucket: "travel-agency-app-eb1c3.firebasestorage.app",
  messagingSenderId: "664167952525",
  appId: "1:664167952525:web:9cc3cd3921b54150d7f2c4",
  measurementId: "G-YLQZ344B6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };