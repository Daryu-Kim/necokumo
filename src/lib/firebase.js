import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEMar_iKXz7fw6dHCglNIS4YyBbSicdy0",
  authDomain: "necokumo-c21e3.firebaseapp.com",
  databaseURL:
    "https://necokumo-c21e3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "necokumo-c21e3",
  storageBucket: "necokumo-c21e3.firebasestorage.app",
  messagingSenderId: "334611024410",
  appId: "1:334611024410:web:fb8af8ac3ced4d9e985fa3",
  measurementId: "G-ZVTQ0EXVST",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
