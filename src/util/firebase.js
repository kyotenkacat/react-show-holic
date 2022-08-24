import { initializeApp } from "firebase/app";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyB1vc5_5-IyCY-e3VATYQnBgHiY5sPrP_I",
  authDomain: "react-screen-holic.firebaseapp.com",
  databaseURL: "https://react-screen-holic-default-rtdb.firebaseio.com",
  projectId: "react-screen-holic",
  storageBucket: "react-screen-holic.appspot.com",
  messagingSenderId: "287523383600",
  appId: "1:287523383600:web:961692adb0bc4de27180f5",
  measurementId: "G-0HEQL6RWWY"
});

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

const database = getDatabase(app);

export { auth, database };
