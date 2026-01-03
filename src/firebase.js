import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, sendSignInLinkToEmail } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPwb7rfxlSBNHRqtd_m_F2wVPDRukKA_s",
  authDomain: "tour-panda-7cbcd.firebaseapp.com",
  projectId: "tour-panda-7cbcd",
  storageBucket: "tour-panda-7cbcd.firebasestorage.app",
  messagingSenderId: "834221319426",
  appId: "1:834221319426:web:3e80cd80d12ca3ac108e1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export services for your components
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Auth Providers
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Email link settings for magic link
export const actionCodeSettings = {
  url: window.location.origin + '/signin',
  handleCodeInApp: true,
};

// Helper function to send magic link
export const sendMagicLink = async (email) => {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
};

export default app;