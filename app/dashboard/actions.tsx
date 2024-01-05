"use server";

import {
    deleteMessageFromCurrentUser,
	getProfileDataForCurrentUser,
	postMessageToCurrentUser,
} from "@/lib/firebase-db";
import { revalidatePath } from "next/cache";

export async function getProfileAction() {
	try {
		const data = await getProfileDataForCurrentUser();
		if (data) return data;
	} catch (error) {
		return undefined;
	}
}

export async function postMessageAction(formData: FormData) {
	try {
		const message = formData.get("message") as string;
		if (message.length < 5) return;
		const result = await postMessageToCurrentUser(message);
		if (result) {
			revalidatePath("/dashboard");
			return true;
		}
	} catch (error) {
		return;
	}
}

export async function deleteMessageAction(message: string) {
	try {
		return await deleteMessageFromCurrentUser(message);
	} catch (error) {
		return undefined;
	}
}
