// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOSkSrm7oqHIgD6IqBUarjFwYM2nAVfwU",
  authDomain: "smart-bite-639c9.firebaseapp.com",
  projectId: "smart-bite-639c9",
  storageBucket: "smart-bite-639c9.firebasestorage.app",
  messagingSenderId: "692038166193",
  appId: "1:692038166193:web:49df00f2ca75901d57a490",
  measurementId: "G-6WG3HNVZ8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;