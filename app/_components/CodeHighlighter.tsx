"use client";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
SyntaxHighlighter.registerLanguage('javascript', js);

type Props = {
	children: string;
};
export default function CodeHighlighter({ children }: Props) {
	return (
		<div className="py-2 leading-snug tracking-normal">
			<SyntaxHighlighter
				language={"javascript"}
				style={vs2015}
				customStyle={{ borderRadius: "0.375rem" }}>
				{children}
			</SyntaxHighlighter>
		</div>
	);
}
