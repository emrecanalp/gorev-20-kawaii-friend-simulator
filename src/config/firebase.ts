import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD2wHDUZds-fCsTT7AcpDnhf97IMquuiIo",
  authDomain: "kawaii-friend.firebaseapp.com",
  projectId: "kawaii-friend",
  storageBucket: "kawaii-friend.firebasestorage.app",
  messagingSenderId: "913534863890",
  appId: "1:913534863890:web:be898093ac55dd1c4b66cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;