import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB1vc5_5-IyCY-e3VATYQnBgHiY5sPrP_I",
  authDomain: "react-screen-holic.firebaseapp.com",
  databaseURL: "https://react-screen-holic-default-rtdb.firebaseio.com",
  projectId: "react-screen-holic",
  storageBucket: "react-screen-holic.appspot.com",
  messagingSenderId: "287523383600",
  appId: "1:287523383600:web:961692adb0bc4de27180f5",
  measurementId: "G-0HEQL6RWWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };

// fix me acess firebase database
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// const db = getFirestore(app);

// // Get a list of cities from your database
// async function getCities(db) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }