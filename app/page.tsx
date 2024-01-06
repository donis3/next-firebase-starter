import Link from "next/link";
import CodeHighlighter from "./_components/CodeHighlighter";

export default function Home() {
	return (
		<>
			<section className="p-2 md:p-4 max-w-[80ch] mx-auto">
				<h2 className="font-medium py-2 text-xl tracking-tighter">
					Server Side Authentication
				</h2>
				<p className="py-2 leading-relaxed ">
					In this project, a session based server side authentication
					using firebase/auth is demonstrated.
					<br />
					Visit the{" "}
					<Link
						href={"https://github.com/donis3/next-firebase-starter"}
						target="_blank" className="underline font-medium">
						github repo
					</Link>{" "}
					or the blog post for details.
				</p>
			</section>

			{/* Route Information */}
			<section className="p-2 md:p-4 max-w-[80ch] mx-auto leading-tight">
				<h3 className="font-medium py-2 text-lg tracking-tighter">
					&#128312; Route '/' (homepage){" "}
					<span className="text-sm font-light">Unprotected</span>
				</h3>
				<p className="py-2 ">
					This is the homepage. It renders the rootLayout. Suspense is
					used so server components that needs time to render doesn't
					block the root layout render.
				</p>
				<CodeHighlighter>
					{`/* layout.tsx */

<html lang="en">
	<body className="min-w-[300px]">
		<Suspense fallback={<NavigationLoading />}>
			<Navigation />
		</Suspense>
		<main className="container mx-auto">
			<Suspense fallback={<Loading />}>{children}</Suspense>
		</main>
		<Notifications />
	</body>
</html>
					`}
				</CodeHighlighter>

				<h3 className="font-medium py-2 text-lg tracking-tighter">
					&#128312; Navbar Component (app/_components/Navigation.tsx)
					<span className="text-sm font-light"></span>
				</h3>
				<p className="py-2 ">
					This is a server component that will call a server action to
					get current auth user if available. It'll display profile
					and logout links if authenticated and a login link
					otherwise.
					<br />
					<br />
					Because of the backend calls, it may take a while to load.
					If it's not wrapped with a suspense boundary, it'll block
					the whole root layout and the user will stare at a blank
					screen. Thats why we provide a suspense and a fallback
					component that looks like the same navbar but without the
					auth links.
					<br />
					<br />
					This is how we fetch the currently authenticated user in a
					server component. Note that we use getAuthAction() instead
					of directly importing getCurrentUser from
					lib/firebase-auth-api.ts.
					<br />
					<br />
					If the backend code is not called via a server action in a
					component, revalidatePath may not remove the cache and we
					might get a stale version of the component. For example, we
					logout but navbar still shows a profile button like we are
					still logged in. Fetching data using a server action makes
					sure the component is revalidated when revalidatePath('/')
					is called
				</p>
				<CodeHighlighter>
					{`/* Navigation.tsx > */

export default async function Navigation() {
	const user = (await getAuthAction()) as UserRecord | undefined;

	// ...render component according to user state
	// ...
}

					`}
				</CodeHighlighter>
			</section>
		</>
	);
}
