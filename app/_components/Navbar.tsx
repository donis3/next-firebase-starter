"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { getUserAction } from "../auth/actions";
import { usePathname } from "next/navigation";
import useAnalytics from "../_hooks/useAnalytics";

/**
 * Here is a demonstration of fetching current user via server actions
 * Without firebase client side functions
 * @returns
 */
export default function Navbar() {
	const path = usePathname();
	const [user, setUser] = useState<User | undefined>();
	const [loading, setLoading] = useState(true);

	useAnalytics(false);

	//Fetch currently logged in user from the server via server action
	useEffect(() => {
		async function getCurrentUser() {
			setLoading(true);
			const result = await getUserAction();
			if (result) {
				setUser(result as User);
			} else {
				setUser(undefined);
			}
			setLoading(false);
		}
		getCurrentUser();
	}, [path]);

	return (
		<header className="w-full bg-orange-700 text-white dark:bg-orange-950 shadow-md">
			<div className="container mx-auto flex flex-wrap justify-between gap-2 items-center p-1">
				{/* App Logo */}
				<Link
					prefetch={false}
					href="/"
					className="p-1 rounded-md font-mono font-bold text-xl hover:bg-white/20">
					<h1>&#x1F525;Next-Firebase</h1>
				</Link>
				<nav className="flex-1 flex flex-row gap-1 items-center justify-end text-base font-medium">
					{/* List all shared routes */}
					<NavbarLink href="/">Home</NavbarLink>
					{loading ? (
						<div>...loading</div>
					) : user ? (
						<>
							{/* List all protected routes */}
							<NavbarLink
								href="/dashboard"
								img={user.photoURL ?? undefined}>
								{user?.displayName ?? "Dashboard"}
							</NavbarLink>
						</>
					) : (
						<>
							{/* List all unprotected routes */}
							<NavbarLink href="/auth/login">Login</NavbarLink>
						</>
					)}
				</nav>
			</div>
		</header>
	);
}

/* -------------------------------------------------------------------------- */
/*             Navbar Link component that'll show border if active            */
/* -------------------------------------------------------------------------- */

type NavbarLinkProps = {
	href: string;
	children: React.ReactNode;
	img?: string;
};

function NavbarLink({ href, img, children }: NavbarLinkProps) {
	//Active path styling
	const path = usePathname();
	const style: React.CSSProperties = {};
	if (path === href) {
		style.borderBottom = "2px solid white";
	}

	return (
		<Link
			href={href}
			prefetch={false}
			style={style}
			className="font-medium text-sm bg-white/10 p-1 hover:bg-white/30 flex flex-row gap-1 items-center h-8">
			{children}
			{img && (
				<img
					src={img}
					alt="A small image in navigation"
					aria-hidden
					className=" rounded-full w-auto h-6 border border-orange-950"
				/>
			)}
		</Link>
	);
}
