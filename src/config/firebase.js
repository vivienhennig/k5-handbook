import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQYPaET3_lnPBQFn4a08d8jT7Uv_zzw3A",
  authDomain: "k5-handbook.firebaseapp.com",
  projectId: "k5-handbook",
  storageBucket: "k5-handbook.firebasestorage.app",
  messagingSenderId: "294194246346",
  appId: "1:294194246346:web:d867bffffd011ddae3ba33"
};

let app, auth, db;
try {
    if (firebaseConfig.apiKey !== "DEIN_API_KEY") {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    }
} catch (e) {
    console.warn("Firebase Init Error:", e);
}

export { auth, db };