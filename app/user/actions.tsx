"use server"; //Marks the functions as server actions

import {
	deleteCurrentUser,
	getCurrentUser,
	isLoggedIn,
	login,
	logout,
} from "@/lib/firebase-auth-api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                         User authentication actions                        */
/* -------------------------------------------------------------------------- */

/**
 * Get a UserRecord as JSON object or undefined
 * @param validate query the backend to check if the token is valid? It's a costly operation and must not be called in every page
 * @returns
 */
export async function getAuthAction(validate = false) {
	try {
		if (validate) {
			const decodedIdToken = await isLoggedIn(true);
			if (!decodedIdToken) return undefined;
		}
		const user = await getCurrentUser();
		if (user) return user.toJSON();
	} catch (error: any) {
		console.log("getAuthAction Error: ", error?.message);
		return;
	}
}

/**
 * Initiate logout sequence and redirect to home page if succeeds.
 * @returns
 */
export async function logoutAction(): Promise<undefined> {
	let result: true | undefined = undefined;
	//Call logout and revoke user
	try {
		result = await logout();
	} catch (error: any) {
		console.log("logoutAction Error: ", error?.message);
	}
	//If logout succeeds, redirect
	if (result) {
		revalidatePath("/");
		//Server action is capable of redirecting the client to another route
		//It must not be wrapped in try catch block.
		return redirect("/?notify=logout_success");
	}
	return undefined;
}

type loginActionProps = {
	idToken?: string;
};

/**
 * Get the token from the client and save it as a firebase cookie. If login succeeds, revalidate the whole router
 */
export async function loginAction({ idToken }: loginActionProps) {
	try {
		if (!idToken) return;
		const result = await login(idToken);
		if (result) {
			revalidatePath("/");
			return result;
		}
	} catch (error: any) {
		console.log("loginAction Error: ", error?.message);
		return undefined;
	}
}

/**
 * Deletes the currently logged in user account, removes any cookies and revalidates the whole router.
 * It'll then redirect to /
 */
export async function deleteUserAction() {
	let result: true | undefined = undefined;
	try {
		result = await deleteCurrentUser();
	} catch (error: any) {
		console.log("deleteUserAction Error: ", error?.message);
		return undefined;
	}

	//If delete succeeds, redirect
	if (result) {
		revalidatePath("/");
		//Server action is capable of redirecting the client to another route
		//It must not be wrapped in try catch block.
		return redirect("/?notify=delete_user_success");
	}
	return undefined;
}
