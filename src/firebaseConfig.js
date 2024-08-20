import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyArdcQBIbb4IWQ0qMk1h3aXhaj1j1yVW6E",
  authDomain: "contacts-management-app-e7980.firebaseapp.com",
  projectId: "contacts-management-app-e7980",
  storageBucket: "contacts-management-app-e7980.appspot.com",
  messagingSenderId: "264142489388",
  appId: "1:264142489388:web:e236ebd90007f4c7d94e89",
  measurementId: "G-DGXY6XECNQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
