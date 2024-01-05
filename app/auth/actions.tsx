"use server";

import {
	deleteCurrentUser,
	getCurrentUser,
	login,
	logout,
} from "@/lib/firebase-auth-api";
import { revalidatePath } from "next/cache";

type loginActionProps = {
	idToken?: string;
};
export async function loginAction({ idToken }: loginActionProps) {
	try {
		if (!idToken) return;
		return await login(idToken);
	} catch (error) {
		return undefined;
	}
}

export async function logoutAction() {
	try {
		await logout();
		
		revalidatePath("/", "layout");
		return true;
		//return redirect("/"); //Doesn't work. the redirect in the protected route acts first and redirects to login page.
	} catch (error: any) {
		//console.log(error?.message);
		return undefined;
	}
}

export async function deleteAccountAction() {
	try {
		return await deleteCurrentUser();
	} catch (error: any) {
		//console.log(error?.message);
		return undefined;
	}
}

export async function getUserAction() {
	const user = await getCurrentUser();
	if (user) return user.toJSON();
	return undefined;
}
