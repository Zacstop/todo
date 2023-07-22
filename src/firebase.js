// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, doc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const dbs = getFirestore(app);
console.log(dbs);

// export { collection, doc };
// export const dbs = collection(app);
