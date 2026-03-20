import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fir-74766.firebaseapp.com",
  projectId: "fir-74766",
  storageBucket: "fir-74766.firebasestorage.app",
  messagingSenderId: "115853556982",
  appId: "1:115853556982:web:418e91310da62f0f2280d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };