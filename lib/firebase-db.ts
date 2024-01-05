/* -------------------------------------------------------------------------- */
/*                    Firebase Firestore DB server side api                   */
/* -------------------------------------------------------------------------- */
import "server-only";
import { getCurrentUser } from "./firebase-auth-api";
import { db } from "./firebase-admin";
import { UserProfileData } from "./types";

/**
 * Check if the current request has cookies and is logged in (getCurrentUser)
 * Use the userId provided by the user auth to find the profile data in users database
 * return the document data
 * @returns
 */
export async function getProfileDataForCurrentUser() {
	try {
		const user = await getCurrentUser();
		if (!user) return;

		//DocID for users table is the same as user id
		const docId = user.uid;

		const usersRef = db.collection("users").doc(docId);
		const doc = await usersRef.get();

		if (doc.exists) return doc.data() as unknown as UserProfileData;
	} catch (error: any) {
		console.error(error?.message);
	}
	return undefined;
}

/**
 * Check if a user is available (request cookies) and
 * adds the message to users document saved in database.
 * @param message A message to save in firestore
 * @returns
 */
export async function postMessageToCurrentUser(message: string) {
	try {
		if (message.length < 5) return;

		//1. Verify user
		const user = await getCurrentUser();
		if (!user) return;
		const docId = user.uid;

		//2. Load user document
		const docRef = db.collection("users").doc(docId);
		const doc = await docRef.get();

		if (!doc.exists) {
			//3. If document not found, create it
			await docRef.set({ messages: [message] } as UserProfileData);
			return true;
		} else {
			//3. If document found update it
			const currentData = doc.data() as UserProfileData;

			//Tip: check if message already exists? prevent double post
			if (currentData.messages.includes(message)) return;
			//Merge the old data and new message
			const newData: UserProfileData = {
				...currentData,
				messages: [...currentData.messages, message],
			};
			//save the document
			await docRef.set(newData);
			return true;
		}
	} catch (error: any) {
		console.log("Database error: ", error?.code);
		return;
	}
}

/**
 * Check if a user is available (request cookies) and
 * deletes the given message from the database document associated with the user.
 * @param messageToDelete the message string.
 * @returns 
 */
export async function deleteMessageFromCurrentUser(messageToDelete: string) {
	try {
		if (messageToDelete.length < 1) return;

		//1. Verify user
		const user = await getCurrentUser();
		if (!user) return;
		const docId = user.uid;

		//2. Load user document
		const docRef = db.collection("users").doc(docId);
		const doc = await docRef.get();

		if (!doc.exists) {
			//3. If document not found, return
			return;
		} else {
			//3. If document found check if message exists
			const data = doc.data() as UserProfileData;

			//4. Remove the message from the messages array
			const newData: UserProfileData = {
				...data,
				messages: data.messages.filter(
					(message) => message !== messageToDelete,
				),
			};

			//5. Save the new object
			await docRef.set(newData);
			return true;
		}
	} catch (error: any) {
		console.log("Database error: ", error?.code);
		return;
	}
}
