import "server-only";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let serviceAccountDetails = {};
try {
	//Decode the base64 encoded json
	const decodedJson = atob(process.env.FIREBASE_CERT_JSON);
	//parse the json
	serviceAccountDetails = JSON.parse(decodedJson);
} catch (error) {
	console.log("Unable to parse the json data for FIREBASE_CERT_JSON");
	throw new Error("Failed to init");
}
const firebaseAdminConfig = {
	credential: cert(serviceAccountDetails),
};

const firebaseAdminApp =
	getApps().find((app) => app.name === "fb-admin") ||
	initializeApp(firebaseAdminConfig, "fb-admin");

const db = getFirestore(firebaseAdminApp);
const auth = getAuth(firebaseAdminApp);

/* --------------------------------- exports -------------------------------- */
export { firebaseAdminApp, auth as adminAuth, db };
