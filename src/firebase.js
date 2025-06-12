// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHLdNzeSiS8bdk6wvqsJGOYWrFP518xDQ",
  authDomain: "phc-theeksperts.firebaseapp.com",
  projectId: "phc-theeksperts",
  storageBucket: "phc-theeksperts.firebasestorage.app",
  messagingSenderId: "113488912818",
  appId: "1:113488912818:web:b6d80e707c95f9dfedc4ab",
  measurementId: "G-8NMP0J8GKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
