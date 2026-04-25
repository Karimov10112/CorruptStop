import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbS8tVXd8raWqvvMQNHlP3DMqldden7MQ",
  authDomain: "corruptstop.firebaseapp.com",
  projectId: "corruptstop",
  storageBucket: "corruptstop.firebasestorage.app",
  messagingSenderId: "1059237562746",
  appId: "1:1059237562746:web:2f75d5fce154306b166ec3",
  measurementId: "G-2WP9MLKRRR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
