// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTPv8qs-vKtAYzat3cFwcBFOqh1w7watE",
  authDomain: "tddd27-project-90949.firebaseapp.com",
  projectId: "tddd27-project-90949",
  storageBucket: "tddd27-project-90949.firebasestorage.app",
  messagingSenderId: "361242978035",
  appId: "1:361242978035:web:c2c5106c3070e0d420b986",
  measurementId: "G-JYH2120K7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
