import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC8SV7Vo8Q3hRmFWMGNssQD0FZ8c326Bw8",
  authDomain: "addtask-a8e49.firebaseapp.com",
  projectId: "addtask-a8e49",
  storageBucket: "addtask-a8e49.appspot.com",
  messagingSenderId: "180962928692",
  appId: "1:180962928692:web:3b18a499a66d5943ca8261"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getFirestore(app)