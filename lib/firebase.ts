// Import the functions you need from the SDKs you need
import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	//If google analytics is enabled, provide this in the .env
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length >= 1 ? getApp() : initializeApp(firebaseConfig);

export default app;

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

auth.setPersistence(inMemoryPersistence);

export { auth };
