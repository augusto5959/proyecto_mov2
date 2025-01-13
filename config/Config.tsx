// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from 'firebase/database'
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0JBiyg_JXTyNCAmnxYQcp-SwKSptEMTo",
  authDomain: "proyectomovilii-93a63.firebaseapp.com",
  databaseURL: "https://proyectomovilii-93a63-default-rtdb.firebaseio.com",
  projectId: "proyectomovilii-93a63",
  storageBucket: "proyectomovilii-93a63.firebasestorage.app",
  messagingSenderId: "762364563897",
  appId: "1:762364563897:web:6339228de6be8df558e668",
  measurementId: "G-6X9DYFDQV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db=getDatabase(app)
export const auth=getAuth(app);