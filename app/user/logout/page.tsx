import SubmitButton from "@/app/_components/Submit";
import { getAuthAction, logoutAction } from "../actions";
import { UserRecord } from "firebase-admin/auth";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
	const user = (await getAuthAction(true)) as UserRecord | undefined;

	if (!user) {
		return redirect("/");
	}

	return (
		<section className="p-2 md:p-4 max-w-[60ch] mx-auto mt-10 ">
			<h2 className="font-bold py-2 text-xl tracking-tighter text-center">
				Logout <span className="text-blue-700">{user.displayName}</span>
			</h2>
			<p className="py-2 leading-relaxed text-center">
				The form action is a server action 'logoutAction' which will
				call logout() function. If logout succeeds, it'll revalidate
				path for whole application and then it'll redirect the client to
				home page.
			</p>
			<form action={logoutAction} className="mt-4 flex justify-center">
				<SubmitButton className="p-2 rounded-md bg-red-600 text-white font bold">
					Logout
				</SubmitButton>
			</form>
		</section>
	);
}
