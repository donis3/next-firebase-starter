// A simple notification component that listens url param "notify". If the notify key is in the dictionary, it displays that message.
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";

type Msg = {
	/**
	 * Notification style
	 */
	type: "success" | "error";
	/**
	 * Message you want to display
	 */
	message: string;
	/**
	 * Time to display notification in seconds
	 */
	duration: number;
};
const dict = new Map<string, Msg>();

/* -------------------------------------------------------------------------- */
/*                   Lets define all possible notifications                   */
/* -------------------------------------------------------------------------- */

dict.set("logout_success", {
	type: "success",
	message: "You have successfully logged out!",
	duration: 5,
});

dict.set("delete_user_success", {
	type: "success",
	message: "Your account has been deleted successfully!",
	duration: 10,
});

dict.set("logout_error", {
	type: "error",
	message: "Logout failed.",
	duration: 5,
});

dict.set("auth_required", {
	type: "error",
	message: "You must be logged in to access this page.",
	duration: 5,
});

dict.set("login_success", {
	type: "success",
	message: "You've successfully logged in",
	duration: 5,
});

/* -------------------------------------------------------------------------- */
/*               and display the notification based on url param              */
/* -------------------------------------------------------------------------- */
/**
 * A simple way of showing a message
 * @param param0
 * @returns
 */
export default function Notifications({}) {
	const router = useRouter();
	const path = usePathname();
	const params = useSearchParams();
	const [notification, setNotification] = useState<Msg | undefined>();

	function handleRemoveNotification() {
		setNotification(undefined);
		router.replace(path, { scroll: false });
	}

	/**
	 * Run whenever path / url params change and check for a notification
	 * If there is a valid notification, display it  and remove it after duration
	 */
	useEffect(() => {
		const newMessage = dict.get(params.get("notify") ?? "");
		if (!newMessage) return setNotification(undefined);

		// Will remove the notification and clear the search params from url after duration
		setNotification(newMessage);
		const timer = setTimeout(() => {
			setNotification(undefined);
			router.replace(path, { scroll: false });
		}, newMessage.duration * 1000);

		return () => clearTimeout(timer);
	}, [path, params]);

	const style: CSSProperties = {
		background: notification?.type === "error" ? "red" : "green",
	};

	if (!notification) return <></>;

	return (
		<div className="absolute z-10 top-12 w-full  flex justify-center">
			<div
				onClick={handleRemoveNotification}
				style={style}
				className=" cursor-pointer px-4 py-2 text-white flex flex-row gap-4 items-center justify-between border rounded-md w-fit shadow-lg  max-w-[95vw] md:max-w-[80vw] opacity-90">
				{notification.type === "error" && (
					<span className="text-red-600 font-extrabold bg-white px-2 rounded-full">
						{" "}
						&#10005;
					</span>
				)}
				{notification.type === "success" && (
					<span className="text-green-700 font-extrabold bg-white px-2 rounded-full ">
						{" "}
						&#10003;
					</span>
				)}

				<span className="flex-1 font-medium text-base">
					{notification.message}
				</span>
			</div>
		</div>
	);
}
