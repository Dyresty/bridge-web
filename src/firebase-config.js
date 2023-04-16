/*import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
export {db}
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional/*
const firebaseConfig = {
  apiKey: "AIzaSyCQhrbaA6J0oe8ZF98YyGoHMy_VdUSQWIg",
  authDomain: "react-final-token.firebaseapp.com",
  projectId: "react-final-token",
  storageBucket: "react-final-token.appspot.com",
  messagingSenderId: "371535544891",
  appId: "1:371535544891:web:7948d0cb7641072263921e",
  measurementId: "G-LYFLTZJFY3"
  /*
  apiKey: "AIzaSyCXamFpVDF_co3k14wHm7-mJuEIbntYs0Q",
  authDomain: "entryrecord-dd00d.firebaseapp.com",
  databaseURL: "https://entryrecord-dd00d-default-rtdb.firebaseio.com",
  projectId: "entryrecord-dd00d",
  storageBucket: "entryrecord-dd00d.appspot.com",
  messagingSenderId: "915960705801",
  appId: "1:915960705801:web:c7a5e42f352cf3f28099d8",
  measurementId: "G-ECEBM13GRN"
  */
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);
export {db}