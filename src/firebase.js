import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSl2tb2_oI5b_IBwDpZog_xMkS6nKYMXo",
  authDomain: "undangan-riswan-alvy.firebaseapp.com",
  projectId: "undangan-riswan-alvy",
  storageBucket: "undangan-riswan-alvy.firebasestorage.app",
  messagingSenderId: "728969683421",
  appId: "1:728969683421:web:4e041ec3d742432c959634",
  measurementId: "G-H9YZQ8N776"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
