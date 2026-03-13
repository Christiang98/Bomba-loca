import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDENwtORCMHmQsEZbXjDaxkdXhM_YR-jtY",
  authDomain: "bombas-local.firebaseapp.com",
  projectId: "bombas-local",
  storageBucket: "bombas-local.firebasestorage.app",
  messagingSenderId: "611299646280",
  appId: "1:611299646280:web:622277daa19c8f661cf17d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);