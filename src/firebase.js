// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfR_MAolgrJ-bNO71yzbMvpyd8xa6DJpA",
  authDomain: "fakebuster-ai.firebaseapp.com",
  projectId: "fakebuster-ai",
  storageBucket: "fakebuster-ai.firebasestorage.app",
  messagingSenderId: "1061676619049",
  appId: "1:1061676619049:web:1569f6431900987055d338",
  measurementId: "G-Y9SC0YQCYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };

export { app, auth, provider };
