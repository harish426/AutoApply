// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnOm7zfztkvk_CLxOOD07yvkLJDG18FUE",
  authDomain: "autoapply-f8ac1.firebaseapp.com",
  projectId: "autoapply-f8ac1",
  storageBucket: "autoapply-f8ac1.appspot.com",
  messagingSenderId: "1098564485651",
  appId: "1:1098564485651:web:3e8e01d9cecd45384f35e6",
  measurementId: "G-0Z0Z48TC9K",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
