"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationLinkProps = {
	children: React.ReactNode;
	href: string;
	img?: string;
};

export default function NavigationLink({
	href,
	img,
	children,
}: NavigationLinkProps) {
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
			className="font-medium text-sm bg-white/10 p-1 hover:bg-white/30 flex flex-row gap-1 items-center h-8 rounded-t-md">
			{children}
			{img && (
				<img
					src={img}
					alt="A small image in navigation"
					aria-hidden
					className=" rounded-full w-auto h-6 border border-orange-950"
					referrerPolicy="no-referrer"
				/>
			)}
		</Link>
	);
}
