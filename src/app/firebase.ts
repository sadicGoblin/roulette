import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update, push, remove} from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyBDzrLTTUlM49B52am9MXA3TzrfF2poj0c",
    authDomain: "entel-tickets.firebaseapp.com",
    databaseURL: "https://entel-tickets-default-rtdb.firebaseio.com",
    projectId: "entel-tickets",
    storageBucket: "entel-tickets.firebasestorage.app",
    messagingSenderId: "284881536170",
    appId: "1:284881536170:web:c3d143791540c8a49e7cd3"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);