"use client";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { redirect } from "next/navigation";
import useAnalytics from "@/app/_hooks/useAnalytics";
import { loginAction } from "../actions";

export default function GoogleSignIn() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { logLoginEvent } = useAnalytics();

	/**
	 * Handle google sign in flow.
	 */
	async function signInWithGoogle() {
		//Reset loading and error states
		setLoading(true);
		setError("");
		try {
			//Initialize the login flow using popup window
			const provider = new GoogleAuthProvider();
			const credentials = await signInWithPopup(auth, provider);

			//If login success, we can extract the JWT token from the credentials object
			const token = await credentials.user.getIdToken();

			//We now send the jwt token to the server to create a session cookie
			const result = await loginAction({ idToken: token });

			//If success, redirect to user profile
			if (result) {
				logLoginEvent("Google"); //Send event to google analytics
				redirect("/user?notify=login_success");
			}
		} catch (error: any) {
			//Display desired errors if needed and reset loading states
			if (error.code) {
				setError(`Login failed due to error code: "${error.code}"`);
				//Remove the error message after 5 seconds
				setTimeout(() => {
					setError("");
				}, 5000);
			}
		} finally {
			//Reset loading state
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col w-auto gap-1">
			<button
				disabled={loading}
				type="button"
				className="p-2 rounded-md border-2 border-blue-800 hover:bg-blue-100 focus:bg-blue-100 disabled:opacity-50 font-bold text-blue-800"
				onClick={signInWithGoogle}>
				{loading ? "In Progress" : "Sign in with Google (Popup)"}
			</button>
			<span className="text-sm text-red-800">{error}</span>
		</div>
	);
}
