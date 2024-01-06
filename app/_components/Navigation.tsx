/*	The navigation bar as a server component

Navbar as a server component allows us to get the authenticated user object on server side and render accordingly.
We wont have any loading.. state or weird flashes. 

Downside is, importing this component at the root layout will cause the whole application to be dynamically rendered.
Since the final state of the navbar is unknown at build time, it depends on the auth state. 

If you want to statically render some routes, you need to make global components like this client components.
For example, you can load the default navbar with user not authenticated state. 
After load you can call a server action to fetch the current user if available.
You can show a loading spinner during this process. Its up to the developer.
*/

import Link from "next/link";
import NavigationLink from "./NavigationLink";
import { getAuthAction } from "../user/actions";
import { UserRecord } from "firebase-admin/auth";

type NavItem = {
	path: string;
	visibility?: "logged-in" | "logged-out";
	text: string;
	img?: string;
};

const navItems: NavItem[] = [
	{ path: "/", text: "Home" },
	{ path: "/user", visibility: "logged-in", text: "Profile" },
	{ path: "/user/logout", visibility: "logged-in", text: "Logout" },
	{ path: "/user/login", visibility: "logged-out", text: "Login" },
];

export default async function Navigation() {
	const user = (await getAuthAction()) as UserRecord | undefined;

	//Filter navigation items for current auth state.
	const navigationLinks = navItems.filter((item) => {
		if (!item.visibility) return item;
		if (item.visibility === "logged-in" && user) {
			//Add user image
			if (item.path === "/user") item.img = user.photoURL ?? undefined;
			return item;
		}
		if (item.visibility === "logged-out" && !user) return item;
	});

	return (
		<header className="w-full bg-orange-700 text-white dark:bg-orange-950 shadow-md relative z-20">
			<div className="container mx-auto flex flex-wrap justify-between gap-2 items-center p-1">
				{/* App Logo */}
				<Link
					prefetch={false}
					href="/"
					className="p-1 rounded-md font-mono font-bold text-xl hover:bg-white/20">
					<h1>&#x1F525;Next-Firebase</h1>
				</Link>
				<nav className="flex-1 flex flex-row gap-1 items-center justify-end text-base font-medium">
					{navigationLinks.map((item, i) => {
						return (
							<NavigationLink
								href={item.path}
								img={item.img}
								key={`navlink_${i}`}>
								{item.text}
							</NavigationLink>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
