// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApr4qkS8MYSkxS-V4Tz9J209PCPwR1Ltc",
  authDomain: "fake-buster-caed9.firebaseapp.com",
  projectId: "fake-buster-caed9",
  storageBucket: "fake-buster-caed9.firebasestorage.app",
  messagingSenderId: "215697454781",
  appId: "1:215697454781:web:c60e65d0429fbeab69a9d4",
  measurementId: "G-ZFH71TTRSQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);