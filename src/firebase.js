import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDMKqv8KCWuR91X5jZH89gb3xGSLkTaLIc",
    authDomain: "techbuzz-updates.firebaseapp.com",
    databaseURL: "https://techbuzz-updates-default-rtdb.firebaseio.com",
    projectId: "techbuzz-updates",
    storageBucket: "techbuzz-updates.appspot.com",
    messagingSenderId: "1004577473810",
    appId: "1:1004577473810:web:e321c951ce97be41b7dfcb",
    measurementId: "G-B00CLRM8BL"
  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
