import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAeASm4zKpdgBs2vops4dFzPFDUkf10c0c",
  authDomain: "chinesemadeeasy-57228.firebaseapp.com",
  projectId: "chinesemadeeasy-57228",
  storageBucket: "chinesemadeeasy-57228.firebasestorage.app",
  messagingSenderId: "1074287828221",
  appId: "1:1074287828221:web:6d6791d0a85ef3806b3294",
  measurementId: "G-X6CR1TGG7V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
