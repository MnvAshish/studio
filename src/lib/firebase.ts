import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfigString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
if (!firebaseConfigString) {
  throw new Error('NEXT_PUBLIC_FIREBASE_CONFIG is not set in the environment');
}

let firebaseConfig: FirebaseOptions;
try {
  firebaseConfig = JSON.parse(firebaseConfigString);
} catch (e) {
    throw new Error('Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG');
}


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
