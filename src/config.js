import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDctzderOf77Hc5cWV0t-gWwcNH2ERlhKA",
    authDomain: "apptask-5bf2f.firebaseapp.com",
    projectId: "apptask-5bf2f",
    storageBucket: "apptask-5bf2f.appspot.com",
    messagingSenderId: "414920719039",
    appId: "1:414920719039:web:e35471d0208be6d78ea40a"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getFirestore(app)