"use client";
import React from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
	children: React.ReactNode;
} & React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

/**
 * A submit button wrapper for server action forms. Will listen to form status and disable itself on loading state.
 */
export default function SubmitButton({
	children,
	...props
}: SubmitButtonProps) {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			aria-disabled={pending}
			disabled={pending}
			{...props}>
			{children}
		</button>
	);
}
