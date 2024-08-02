// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwyJe9656_UPQh4oUT-413ZtGCtRgfX1U",
  authDomain: "pantry-management-5e8c7.firebaseapp.com",
  projectId: "pantry-management-5e8c7",
  storageBucket: "pantry-management-5e8c7.appspot.com",
  messagingSenderId: "319167172679",
  appId: "1:319167172679:web:e1ac1fc5f81aae999ce162",
  measurementId: "G-TCJBFT5EWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}