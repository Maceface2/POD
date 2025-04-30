import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo2f4A3mkcomQUJM3v99wBbXsqU-doAvY",
  authDomain: "payondelivery-91630.firebaseapp.com",
  projectId: "payondelivery-91630",
  storageBucket: "payondelivery-91630.firebasestorage.app",
  messagingSenderId: "968497839886",
  appId: "1:968497839886:web:5f3f647a5411f2937c215f",
  measurementId: "G-4881K7NX18"
};

// Initialize Firebase


// // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);
export const analytics = () => getAnalytics(app);

// export default app
export default app;