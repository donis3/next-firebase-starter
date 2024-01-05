"use client";
import { deleteAccountAction, logoutAction } from "@/app/auth/actions";
import React, { useState } from "react";

type DeleteAccountProps = {
	children: React.ReactNode;
} & React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

/**
 * Delete account button with a confirmation step before sending request to server actions
 */
export default function DeleteAccount({
	children,
	...props
}: DeleteAccountProps) {
	const [showConfirm, setShowConfirm] = useState(false);

	/**
	 * Send a request to the server action to delete the currently authenticated account
	 */
	async function handleDeleteAccount() {
		try {
			await deleteAccountAction();
		} catch (error: any) {
			//console.log(error?.message);
		} finally {
			setShowConfirm(false);
		}
	}

	// A simple confirmation before deleting
	if (!showConfirm) {
		return (
			<button
				type="button"
				onClick={() => setShowConfirm(true)}
				{...props}>
				{children}
			</button>
		);
	} else {
		return (
			<div className="flex flex-row items-center gap-2 ml-2 ">
				<span className="text-xs font-medium text-red-700">
					Your account will be deleted.{" "}
				</span>
				<button
					type="button"
					onClick={() => setShowConfirm(false)}
					className="text-sm font-bold bg-green-800 text-white px-2 p-1 rounded-md">
					Cancel
				</button>
				<button
					type="button"
					onClick={handleDeleteAccount}
					className="text-sm font-bold bg-red-600 text-white px-2 p-1 rounded-md">
					Confirm
				</button>
			</div>
		);
	}
}
