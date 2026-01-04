import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, sendSignInLinkToEmail } from "firebase/auth";
import { getStorage } from "firebase/storage";

/**
 * Firebase Configuration
 * 
 * Contains connection details for the Firebase project 'tour-panda'.
 * These values are public-safe identifiers for the client-side app.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCPwb7rfxlSBNHRqtd_m_F2wVPDRukKA_s",
  authDomain: "tour-panda-7cbcd.firebaseapp.com",
  projectId: "tour-panda-7cbcd",
  storageBucket: "tour-panda-7cbcd.firebasestorage.app",
  messagingSenderId: "834221319426",
  appId: "1:834221319426:web:3e80cd80d12ca3ac108e1b"
};

/**
 * Initialize Firebase Application
 * Reference to the main app instance.
 */
const app = initializeApp(firebaseConfig);

/**
 * Service Exports
 * 
 * db: Firestore database instance for data storage.
 * auth: Authentication service instance.
 * storage: Cloud Storage instance for file uploads (images, etc.).
 */
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

/**
 * Authentication Providers
 * 
 * setup for Google Sign-In.
 */
export const googleProvider = new GoogleAuthProvider();

// Custom parameters to force account selection prompt on login
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Passwordless Login Configuration
 * 
 * Settings for sending email magic links.
 * Redirects user back to '/signin' after clicking the email link.
 */
export const actionCodeSettings = {
  url: window.location.origin + '/signin',
  handleCodeInApp: true,
};

/**
 * Helper: Send Magic Link
 * 
 * Triggers the Firebase Auth to send a sign-in link to the provided email.
 * Stores the email in localStorage to complete the sign-in flow on the receiving page.
 * 
 * @param {string} email - The user's email address
 */
export const sendMagicLink = async (email) => {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
};

export default app;