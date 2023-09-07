import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, doc } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBFsu3a83aUhPBaU2CzGNPvl-ynda9RiCk',
  authDomain: 'test01-d8151.firebaseapp.com',
  projectId: 'test01-d8151',
  storageBucket: 'test01-d8151.appspot.com',
  messagingSenderId: '860136915332',
  appId: '1:860136915332:web:dc54a78ba9d2b51181ddd1',
  measurementId: 'G-GWCG65XJ83',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { app, analytics, db, googleProvider, auth, storage };
// export { collection, doc };
