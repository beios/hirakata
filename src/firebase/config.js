import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase 설정을 직접 포함
const firebaseConfig = {
    apiKey: "your-api-key",           // GitHub에서 수정 필요
    authDomain: "hirakata-web.firebaseapp.com",
    projectId: "hirakata-web",
    storageBucket: "hirakata-web.appspot.com",
    messagingSenderId: "your-sender-id", // GitHub에서 수정 필요
    appId: "your-app-id"              // GitHub에서 수정 필요
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); 
