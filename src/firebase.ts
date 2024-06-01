import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjOKv_555D1UkEVnuS2kmSbNadVZjnvQA",
  authDomain: "rvir-1e34e.firebaseapp.com",
  databaseURL: "https://rvir-1e34e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rvir-1e34e",
  storageBucket: "rvir-1e34e.appspot.com",
  messagingSenderId: "557385771713",
  appId: "1:557385771713:web:ccd83cc0e1e8b84bb90240",
  measurementId: "G-LMLP8LTYC2"
};
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
