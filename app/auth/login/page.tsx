import { isLoggedIn } from "@/lib/firebase-auth-api";
import GoogleSignIn from "./GoogleSignIn";
import { redirect } from "next/navigation";
import GithubSignIn from "./GithubSignIn";

type LoginProps = {
	searchParams: {
		cb?: string;
	};
};

export default async function Login({ searchParams }: LoginProps) {
	if (await isLoggedIn(true)) {
		//After login, redirect the user to the requested page by using ?cb=/path get variable
		if (searchParams.cb)
			return redirect(searchParams.cb + "?notify=login_success");
		return redirect("/?notify=login_success");
	}

	return (
		<section className="p-2 md:p-4 max-w-[60ch] mx-auto mt-10 ">
			<h2 className="font-medium py-2 text-xl tracking-tighter text-center">
				Login to continue
			</h2>
			<p className="py-2 leading-relaxed text-center">
				Please sign in to the app using one of the providers. You will
				have the option to delete your account anytime you want.
			</p>
			<div className="grid grid-flow-row max-w-sm gap-2 mt-10 mx-auto">
				{/* Providers */}
				<GoogleSignIn />
				<GithubSignIn />
			</div>
		</section>
	);
}
