import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import Notifications from "@/app/_components/Notifications";
import Navigation from "./_components/Navigation";
import NavigationLoading from "./_components/NavigationLoading";
import Loading from "./_components/Loading";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
	title: "Next & Firebase - donis.dev",
	description:
		"A next.js 14 project with server side firebase authentication using cookie session.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-w-[300px] flex flex-col min-h-screen justify-between">
				<Suspense fallback={<NavigationLoading />}>
					<Navigation />
				</Suspense>
				<main className="container mx-auto flex-1">
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</main>
				<Notifications />
				<Footer />
			</body>
		</html>
	);
}
