import { redirect } from "next/navigation";
import { getAuthAction } from "../actions";
import GithubSignIn from "./GithubSignIn";
import GoogleSignIn from "./GoogleSignIn";
import { UserRecord } from "firebase-admin/auth";
import CodeHighlighter from "@/app/_components/CodeHighlighter";

type LoginPageProps = {
	searchParams: { cb?: string };
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
	const user = (await getAuthAction(true)) as UserRecord | undefined;

	if (user) {
		//After login, redirect the user to the requested page by using ?cb=/path get variable
		if (searchParams.cb)
			return redirect(searchParams.cb + "?notify=login_success");
		return redirect("/?notify=login_success");
	}

	return (
		<>
			<section className="p-2 md:p-4 max-w-[60ch] mx-auto mt-10 ">
				<h2 className="font-medium py-2 text-xl tracking-tighter text-center">
					Login to continue
				</h2>
				<p className="py-2 leading-relaxed text-center">
					Please sign in to the app using one of the providers. You
					will have the option to delete your account anytime you
					want.
				</p>
				<div className="grid grid-flow-row max-w-sm gap-2 mt-10 mx-auto">
					{/* Providers */}
					<GoogleSignIn />
					<GithubSignIn />
				</div>
			</section>

			{/* Route Information */}
			<section className="p-2 md:p-4 max-w-[80ch] mx-auto leading-tight mt-10">
				<h3 className="font-medium py-2 text-lg tracking-tighter">
					&#128312; Route '/user/login'{" "}
					<span className="text-sm font-light">Unprotected</span>
				</h3>
				<p className="py-2 ">
					Firebase auth login flow takes place at the client side.
					After the user successfully logs in, we receive a user
					object from which we can get the token and send to our
					server action.
				</p>
				<h4 className="font-medium mt-4">
					Google Sign In (user/login/GoogleSignIn.tsx)
				</h4>
				<CodeHighlighter >
					{`const [loading, setLoading] = useState(false);
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

		//If success, redirect to dashboard
		if (result) {
			logLoginEvent("Google"); //Send event to google analytics
			redirect("/dashboard?notify=login_success");
		}
	} catch (error: any) {
		//Display desired errors if needed and reset loading states
		if (error.code) {
			setError(\`Login failed due to error code: "\${error.code}"\`);
			//Remove the error message after 5 seconds
			setTimeout(() => {
				setError("");
			}, 5000);
		}
	} finally {
		//Reset loading state
		setLoading(false);
	}
}`}
				</CodeHighlighter>

				<p className="py-2 ">
					We may now process this token in the server. We'll convert
					the token to a firebase auth cookie and save it at the users
					browser. Now whenever we receive a request from this user
					we'll also receive the cookie thus we can verify the auth
					state.
				</p>
				<h4 className="font-medium mt-4">
					LoginAction (user/actions.tsx)
				</h4>
				<CodeHighlighter >
					{`/**
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
`}
				</CodeHighlighter>
				<h4 className="font-medium mt-4">
					login (lib/firebase-auth-api.ts)
				</h4>
				<CodeHighlighter >
					{`/**
 * Sign a user in
 * @param token jwt token string from client side.
 * @returns
 */
export async function login(token: string) {
	try {
		//Verify the token and get user data
		const decodedIdToken = await adminAuth.verifyIdToken(token);
		if (!decodedIdToken) return;

		//Create the cookie token string to save.
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
`}
				</CodeHighlighter>

				<p className="py-2 ">
					In the actual file, you'll notice that login function also
					creates custom claims depending on the user email. This is a
					demonstration of how user roles can be defined. Visit the
					repo for further reading.
				</p>
			</section>
		</>
	);
}
