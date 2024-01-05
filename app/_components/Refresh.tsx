"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * A component that will refresh the page when refresh=true url param is received.
 * This is to wipe router cache after logout
 * @returns
 */
export default function Refresh() {
	const path = usePathname();
	const params = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		if (window) {
			if (params.get("refresh") === "true") {
				//Keep notification if present
				let targetPath = path;
				const notify = params.get("notify");
				if (notify) targetPath = `${path}?notify=${notify}`;

				//refresh the page
				router.push(targetPath, { scroll: false });
			}
		}
	}, [path, params]);
	return <></>;
}
