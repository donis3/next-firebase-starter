/* -------------------------------------------------------------------------- */
/*                     Firebase Auth ServerSide Functions                     */
/* -------------------------------------------------------------------------- */
import "server-only"; //Only server side
import { cookies } from "next/headers";
import appConfig from "./app.config";
import { adminAuth } from "./firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { revalidatePath } from "next/cache";

/**
 * Load the token from the session cookie and verify token is valid.
 * @param checkForRevocation Perform a backend query to see if token is revoked?
 * This is a costly operation. It'll connect to firebase backend to validate the account status.
 * You may use this in highly sensitive routes for extra protection.
 * @returns A decoded id token or undefined
 */
export async function isLoggedIn(checkForRevocation = true) {
	try {
		//Get current session cookie if available
		const sessionCookieValue = await getSessionCookie();
		if (!sessionCookieValue) return;

		//Verify cookie token and return Decoded ID Token
		return await adminAuth.verifySessionCookie(
			sessionCookieValue,
			checkForRevocation,
		);
	} catch (error: any) {
		//If there is a problem with the user auth, handle here
		//console.log(error.code) //example: auth/user-disabled
		//delete the cookie and revoke the session
		await logout();
		return undefined;
	}
}

/**
 * Get current user record if found
 * @returns
 */
export async function getCurrentUser(): Promise<UserRecord | undefined> {
	try {
		//load decoded id token without revocation verification call
		const decodedIdToken = await isLoggedIn(false);
		if (!decodedIdToken) return;

		//Load user record using uid from the token
		return await adminAuth.getUser(decodedIdToken.uid);
	} catch (error: any) {
		console.error("Error getCurrentUser", error?.message);
	}
	return undefined;
}

/**
 * Log the user out, delete the session cookie, revoke the token
 * @returns
 */
export async function logout() {
	try {
		//Get current session cookie if available
		const sessionCookieValue = await getSessionCookie();
		if (!sessionCookieValue) return;

		//Decode cookie to verify
		const decodedIdToken = await adminAuth.verifySessionCookie(
			sessionCookieValue,
		);

		//Revoke the token
		await adminAuth.revokeRefreshTokens(decodedIdToken.sub);

		//Delete the cookie
		cookies().delete(appConfig.sessionCookieName);

		return true;
	} catch (error: any) {
		console.error("Error logOut", error?.message);
	}
}

/**
 * Sign a user in and create the customClaims for user role.
 * @param token jwt token string from client side.
 * @returns
 */
export async function login(token: string) {
	try {
		//Verify the token and get user data
		const decodedIdToken = await adminAuth.verifyIdToken(token);
		if (!decodedIdToken) return;

		//Set the user customClaims
		//This will include an admin: true / false object in the JWT for role check
		//Below example will check if the user has a verified email address and the email is in the admin email array.
		//You can add whatever rules you want here to set a user admin or not
		if (
			decodedIdToken.uid &&
			decodedIdToken.email &&
			decodedIdToken.email_verified === true &&
			appConfig.adminEmails.includes(decodedIdToken.email.toLowerCase())
		) {
			//User should be an admin
			await adminAuth.setCustomUserClaims(decodedIdToken.uid, {
				admin: true,
			});
		} else {
			//User should be normal user
			await adminAuth.setCustomUserClaims(decodedIdToken.uid, {
				admin: false,
			});
		}

		//Create the cookie token string to save. This will take the user role into account as well.
		const sessionCookie = await adminAuth.createSessionCookie(token, {
			expiresIn: appConfig.sessionCookieDuration,
		});

		//Create the cookie
		cookies().set(appConfig.sessionCookieName, sessionCookie, {
			maxAge: appConfig.sessionCookieDuration,
			httpOnly: true,
			secure: true,
		});

		//User logged in

		return true;
	} catch (error: any) {
		console.log("Error logging in", error?.message);
		return false;
	}
}

/**
 * Delete currently logged in user
 */
export async function deleteCurrentUser() {
	try {
		//Get current user
		const user = await getCurrentUser();
		if (!user) throw new Error("Unable to find current user.");

		//Log user out
		await logout();

		//Delete user
		await adminAuth.deleteUser(user.uid);
	} catch (error: any) {
		console.log("Delete user account failed: ", error?.code);
	}
}

/* ---------------------------- Helper Functions ---------------------------- */

/**
 * Get current session cookie value
 * @returns
 */
async function getSessionCookie() {
	try {
		const sessionCookie = cookies().get(appConfig.sessionCookieName);
		if (sessionCookie) return sessionCookie.value;
	} catch (error) {
		return undefined;
	}
}
