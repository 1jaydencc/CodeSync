// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAylR1kaEMAYHEwCtdHLza_zXNjNxZ5UE",
  authDomain: "codesync-bb9e1.firebaseapp.com",
  projectId: "codesync-bb9e1",
  storageBucket: "codesync-bb9e1.appspot.com",
  messagingSenderId: "707670893810",
  appId: "1:707670893810:web:1f763b1af460da7bb55c6b",
  measurementId: "G-GCDL12J3E4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);