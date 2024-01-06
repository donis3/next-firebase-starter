"use client";
import { auth } from "@/lib/firebase";
import {
	GithubAuthProvider,
	getRedirectResult,
	signInWithRedirect,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { loginAction } from "../actions";
import { redirect } from "next/navigation";
import useAnalytics from "@/app/_hooks/useAnalytics";

export default function GithubSignIn() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const { logLoginEvent } = useAnalytics();

	/**
	 * Redirects the user to firebase login page. After success, user will return back here
	 * Use getRedirectResult to handle after login flow
	 */
	async function signInGithubRedirect() {
		try {
			//Initialize redirect login flow
			const provider = new GithubAuthProvider();
			signInWithRedirect(auth, provider);
		} catch (error: any) {
			console.error(error?.message);
		}
	}

	/* ------------------- Handle Redirected User after login ------------------- */
	useEffect(() => {
		const handleRedirectedUser = async () => {
			setError("");
			try {
				//Get credentials if we have a redirect result
				const credential = await getRedirectResult(auth);
				if (!credential) return;

				/* We can access github api if needed like this:
				
				const githubCredential =
					GithubAuthProvider.credentialFromResult(credential);
				if (githubCredential) {
					// This gives you a GitHub Access Token. You can use it to access the GitHub API.
					const token = githubCredential.accessToken;
				}
				*/

				//Only start loading if we get a redirect result.
				setLoading(true);
				//If login success, we can extract the JWT token from the credentials object
				const token = await credential.user.getIdToken();
				//We now send the jwt token to the server to create a session cookie
				const result = await loginAction({ idToken: token });

				//If success, redirect to profile
				if (result) {
					logLoginEvent("Github"); //Send event to google analytics
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
		};

		handleRedirectedUser();
	}, []);

	return (
		<div className="flex flex-col w-auto gap-1">
			<button
				disabled={loading}
				type="button"
				className="p-2 rounded-md border-2 border-zinc-800 hover:bg-blue-100 focus:bg-blue-100 font-bold text-zinc-800 disabled:opacity-50"
				onClick={signInGithubRedirect}>
				{loading ? "...In Progress" : "Sign in with Github (Redirect)"}
			</button>
			<span className="text-sm text-red-800">{error}</span>
		</div>
	);
}
