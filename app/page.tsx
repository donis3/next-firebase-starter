import Link from "next/link";

export default async function Home() {
	return (
		<section className="p-2 md:p-4 max-w-[80ch] mx-auto">
			<h2 className="font-medium py-2 text-xl tracking-tighter">
				Server Side Authentication
			</h2>
			<p className="py-2 leading-relaxed ">
				In this branch, server side auth is implemented. We may now log
				in using google (popup window). We can protect our server
				components using getCurrentUser() function.
			</p>
			<p className="py-2 leading-relaxed ">
				Visit{" "}
				<Link href="/user" className="underline">
					dashboard
				</Link>{" "}
				to see the login flow in action. This route is protected in the
				page using getCurrentUser() function.
			</p>

			<h2 className="font-medium py-2 text-xl tracking-tighter">
				Client side implementation
			</h2>
			<p className="py-2 leading-relaxed ">
				This project is focused on server side auth but I've encountered
				some bugs so I've made the navbar a client component. You can
				check the navbar.tsx component to see how this works. <br />
				We basically send a User object through a server action and
				fetch it in a useEffect in the navbar component. User object
				must be serialized using the UserRecord.toJSON().
				<br />
				View the auth/actions.tsx to see how this works.
			</p>
		</section>
	);
}
