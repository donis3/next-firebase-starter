import SubmitButton from "@/app/_components/Submit";
import { getAuthAction, logoutAction } from "../actions";
import { UserRecord } from "firebase-admin/auth";
import { redirect } from "next/navigation";
import CodeHighlighter from "@/app/_components/CodeHighlighter";

export default async function LogoutPage() {
	const user = (await getAuthAction(true)) as UserRecord | undefined;

	if (!user) {
		return redirect("/");
	}

	return (
		<>
			<section className="p-2 md:p-4 max-w-[60ch] mx-auto mt-10 border rounded-md">
				<h2 className="font-bold py-2 text-xl tracking-tighter text-center">
					Logout{" "}
					<span className="text-blue-700">{user.displayName}</span>
				</h2>

				<form
					action={logoutAction}
					className="mt-4 flex justify-center">
					<SubmitButton className="p-2 rounded-md bg-red-600 text-white font-bold hover:bg-red-500">
						Logout
					</SubmitButton>
				</form>
			</section>

			{/* Route Information */}
			<section className="p-2 md:p-4 max-w-[80ch] mx-auto leading-tight mt-10">
				<h3 className="font-medium py-2 text-lg tracking-tighter">
					&#128312; Route '/user/logout'{" "}
					<span className="text-sm font-light">Protected</span>
				</h3>
				<p className="py-2 ">
					The logout button will submit a form to a server action
					called logoutAction. logoutAction will call logout() from
					the lib/firebase-auth-api.ts which revokes the user token
					and deletes the cookies.
					<br />
					<br />
					Important part is, we revalidatePath so the routes that
					depend on auth state are refreshed. Otherwise we'd see
					ourself as still logged in in the navbar and profile page
					until we did a manual refresh.
					<br />
					<br />
					Note that, revalidatePath('/route') currently removes all
					router cache and not just the specified route. This'll be
					fixed in a later release
				</p>

				<h4 className="font-medium mt-4">Logout Form</h4>
				<CodeHighlighter>
					{`/* part of  user/logout/page.tsx */
(
<form
	action={logoutAction}
	className="mt-4 flex justify-center">
	<SubmitButton className="p-2 rounded-md bg-red-600 text-white font-bold hover:bg-red-500">
		Logout
	</SubmitButton>
</form>
);`}
				</CodeHighlighter>
				<h4 className="font-medium mt-4">
					logoutAction (user/actions.tsx)
				</h4>
				<CodeHighlighter>
					{`/**
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
}`}
				</CodeHighlighter>

				<h4 className="font-medium mt-4">
					logout (lib/firebase-auth-api.tsx)
				</h4>
				<CodeHighlighter>
					{`/**
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
}`}
				</CodeHighlighter>
			</section>
		</>
	);
}
