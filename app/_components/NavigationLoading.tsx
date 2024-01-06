/**
 * This is a loading version of the navbar. If a server component takes long to load,
 * you may wrap it in a suspense boundary and supply a fast loading fallback component to show
 * while the real one is loading. This version of the navbar is auth state agnostic. It has no backend calls
 */

import Link from "next/link";
import NavigationLink from "./NavigationLink";

type NavItem = {
	path: string;
	visibility?: "logged-in" | "logged-out";
	text: string;
	img?: string;
};

const navItems: NavItem[] = [{ path: "/", text: "Home" }];

export default function NavigationLoading() {
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
					{navItems.map((item, i) => {
						return (
							<NavigationLink
								href={item.path}
								img={item.img}
								key={`navlink_${i}`}>
								{item.text}
							</NavigationLink>
						);
					})}
					{/* Show any loading indicator to inform the user */}
					<span>...loading</span>
				</nav>
			</div>
		</header>
	);
}
