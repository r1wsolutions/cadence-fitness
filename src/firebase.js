// Import the functions you need from the SDKs you need

import { initializeApp, getApps } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLIOMlSIiJpNCoaiCozCJ7XTFQ1rvi1lY",
  authDomain: "cadence-fitness.firebaseapp.com",
  databaseURL: "https://cadence-fitness-default-rtdb.firebaseio.com",
  projectId: "cadence-fitness",
  storageBucket: "cadence-fitness.appspot.com",
  messagingSenderId: "914232149834",
  appId: "1:914232149834:web:bf170f856b487a9683e3b3",
  measurementId: "G-B1BNYB93QE"
};

// Initialize Firebase
export const initFireabaseApp = ()=>{
    if(getApps.length === 0)
    {
        initializeApp(firebaseConfig)
    }
}

export const adminCalls = {
    auth: getAuth,
    resetPassword: sendPasswordResetEmail
}
