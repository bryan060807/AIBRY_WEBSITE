// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVqYiLn_ba1RQKd-F6GHGejnNaK9Q-6f4",
  authDomain: "aibry-archive.firebaseapp.com",
  projectId: "aibry-archive",
  storageBucket: "aibry-archive.firebasestorage.app",
  messagingSenderId: "674116804717",
  appId: "1:674116804717:web:61d29afc4792cc8143df64",
  measurementId: "G-NV0SVQCTTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);