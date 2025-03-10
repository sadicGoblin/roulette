import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, push, remove} from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyAuIhNOePMCx9CFS9F2tdGZiVV9F_C5RzM",
    authDomain: "rout-9f25c.firebaseapp.com",
    databaseURL: "https://rout-9f25c-default-rtdb.firebaseio.com",
    projectId: "rout-9f25c",
    storageBucket: "rout-9f25c.firebasestorage.app",
    messagingSenderId: "478241178049",
    appId: "1:478241178049:web:dc149c2c4e13e539922f40"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);