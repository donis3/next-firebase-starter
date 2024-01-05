import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/_components/Navbar";
import { Suspense } from "react";
import Notifications from "@/app/_components/Notifications";
import Refresh from "./_components/Refresh";

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
				<Suspense fallback={"loading navbar"}>
					<Navbar />
				</Suspense>
				<main className="container mx-auto">
					<Suspense fallback={"loading"}>{children}</Suspense>
				</main>
				<Notifications />
				<Refresh />
			</body>
		</html>
	);
}
