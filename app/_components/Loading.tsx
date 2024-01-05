/**
 * Fullscreen loading spinner
 */
export default function Loading() {
	return (
		<div className="absolute inset-0 z-10 bg-slate-600/20 flex items-center justify-center">
			<Spinner />
		</div>
	);
}

function Spinner() {
	return (
		<svg
			className="w-16 animate-spin-slow fill-slate-400"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg">
			<g
				id="SVGRepo_tracerCarrier"
				strokeLinecap="round"
				strokeLinejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				<path d="m10.5 0h3l.75 4.5 1.28.53 3.97-2.56 2.03 2.03-2.56 3.97.53 1.28 4.499.75v3l-4.5.75-.53 1.28 2.56 3.97-2.03 2.03-3.97-2.56-1.28.53-.75 4.499h-3l-.75-4.5-1.28-.53-3.97 2.56-2.031-2.03 2.56-3.97-.53-1.28-4.499-.75v-3l4.5-.75.53-1.28-2.56-3.97 2.03-2.031 3.97 2.56 1.28-.53zm1.5 7.5c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5c0-2.485-2.015-4.5-4.5-4.5z"></path>
			</g>
		</svg>
	);
}
