/* -------------------------------------------------------------------------- */
/*          A demonstration of a client component accessing user data         */
/* -------------------------------------------------------------------------- */
"use client";

import { UserProfileData } from "@/lib/types";
import { User } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import {
	deleteMessageAction,
	getProfileAction,
	postMessageAction,
} from "./actions";
import SubmitButton from "@/app/_components/Submit";

type ProfileProps = {
	/**
	 * user.toJSON() from the server
	 */
	user: object;
};

/**
 * Display user messages and new message form. Expects the user data from the server in json format
 */
export default function Profile({ user }: ProfileProps) {
	const userData = user as User;
	const { loading, data, loadMessages, deleteMessage } = useProfile();

	if (!user || "displayName" in user === false) {
		return (
			<p className="p-2 border border-red-600 font-medium text-red-700">
				User profile couldn't be loaded
			</p>
		);
	}

	return (
		<div className="border rounded-md bg-slate-50 overflow-hidden">
			{/* Header */}
			<h3 className="bg-slate-500 px-2 py-1 text-white  font-bold ">
				&#128449; {userData.displayName} - Data stored in fireStore
			</h3>

			{/* Body */}
			<div className="w-full p-2 min-h-10">
				{loading ? (
					"...loading"
				) : (
					<UserMessages
						profileData={data}
						deleteMessage={deleteMessage}
					/>
				)}
				<UserMessageForm callback={loadMessages} />
			</div>
		</div>
	);
}

/**
 * A custom hook for user profile to easily access messages
 * @returns
 */
function useProfile() {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<null | UserProfileData>(null);

	async function loadMessages() {
		try {
			setLoading(true);
			const data = await getProfileAction();
			if (data) setData(data as UserProfileData);
		} catch (error: any) {
			console.log(error?.message);
		} finally {
			setLoading(false);
		}
	}

	async function deleteMessage(message: string) {
		try {
			const result = await deleteMessageAction(message);
			if (result) {
				loadMessages();
			}
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		loadMessages();
	}, []);

	return { loading, data, loadMessages, deleteMessage };
}

type UserMessagesProps = {
	profileData: UserProfileData | null;
	deleteMessage: (message: string) => void;
};

/**
 * Display each message the user has in database.
 * Also display a link to delete each message.
 * @param param0
 * @returns
 */
function UserMessages({ profileData, deleteMessage }: UserMessagesProps) {
	if (!profileData || profileData.messages.length === 0)
		return "No messages yet";
	return (
		<ul className="flex flex-col gap-2  w-full">
			{profileData.messages.map((message, i) => {
				return (
					<li
						key={`user_message_${i}`}
						className="p-1 font-mono leading-relaxed rounded-md hover:bg-slate-200 flex items-center gap-2 justify-between">
						{message}
						<button
							type="button"
							className="p-1 text-sm font-bold bg-red-800 text-white rounded-md"
							onClick={() => deleteMessage(message)}>
							Delete
						</button>
					</li>
				);
			})}
		</ul>
	);
}

/**
 * A form to post a message. Will call a server action.
 *
 * @param {callback} function Calls the callback function after a message is posted
 * @returns
 */
function UserMessageForm({ callback }: { callback: () => void }) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	async function onSubmit(formData: FormData) {
		await postMessageAction(formData);
		callback();

		//Clear the textarea after posting
		if (textareaRef.current) {
			textareaRef.current.value = "";
		}
	}

	return (
		<div className="mt-4 border-t px-1 py-4">
			<form action={onSubmit}>
				<label htmlFor="new_message" className="text-sm text-zinc-600">
					Post new message
				</label>
				<textarea
					ref={textareaRef}
					minLength={5}
					required
					className="w-full border p-1 text-zinc-600 text-base"
					id="new_message"
					name="message"
					placeholder="Type your message here"></textarea>

				<SubmitButton className="p-2 bg-green-700 text-white font-medium hover:bg-green-600 focus:bg-green-600 rounded-md disabled:opacity-50">
					Submit
				</SubmitButton>
			</form>
		</div>
	);
}
