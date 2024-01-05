import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import Notifications from "@/app/_components/Notifications";
import Navigation from "./_components/Navigation";
import Loading from "./_components/Loading";

export const metadata: Metadata = {
	title: "Next & Firebase implementation by donis.dev",
	description:
		"A next.js 14 app with firebase authentication and firestore database starter project.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="min-w-[300px]">
				<Navigation />
				<main className="container mx-auto">
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</main>
				<Notifications />
			</body>
		</html>
	);
}
