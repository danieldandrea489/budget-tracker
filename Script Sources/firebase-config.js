import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Using Firestore (the modern DB)

const firebaseConfig = {
  apiKey: "AIzaSyBce5fwM7LEVrxQsP3FsLzdGfk5zV44u9g",
  authDomain: "budget-tracker-741a3.firebaseapp.com",
  projectId: "budget-tracker-741a3",
  storageBucket: "budget-tracker-741a3.firebasestorage.app",
  messagingSenderId: "158962220720",
  appId: "1:158962220720:web:1a405dff273f6f92790575"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// This 'db' is what your other 3 JS files will use to talk to the database
export { db };
