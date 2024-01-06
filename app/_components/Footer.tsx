import Link from "next/link";

type FooterProps = {};

const links = [
	{ href: "https://donis.dev/", text: "donis.dev" },
	{ href: "https://github.com/donis3", text: "Github" },
	{ href: "https://twitter.com/DonisDev", text: "X" },
];

export default function Footer({}: FooterProps) {
	return (
		<footer className="p-2 bg-zinc-200 border-t border-zinc-300 w-full">
			<div className="container mx-auto flex flex-col gap-2 justify-between items-center md:flex-row md:gap-4 text-sm ">
				<p>
					Created with <span>&#x2764;</span> by Deniz özkan
				</p>
				<ul className="flex flex-row gap-1">
					{links.map((item, i) => {
						return (
							<li key={`social_${i}`}>
								<Link href={item.href} target="_blank" className="p-1 font-medium underline text-zinc-700 hover:text-black">
									{item.text}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</footer>
	);
}
