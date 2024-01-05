/* -------------------------------------------------------------------------- */
/*                        Google Analytics Custom Hook                        */
/* -------------------------------------------------------------------------- */
"use client";
import app from "@/lib/firebase";
import {
	Analytics,
	AnalyticsCallOptions,
	logEvent as LogEventAnalytics,
	getAnalytics,
} from "firebase/analytics";
import { useEffect, useState } from "react";

/**
 * Analytics must be initialized after page load. This hook ensures that and provides easy event logging functions
 * Routes that this hook was not called will not be tracked by analytics.
 * If user opts out of cookies / tracking, a switch can be implemented in here.
 * @returns
 */
export default function useAnalytics(disableTracking = false) {
	const [analytics, setAnalytics] = useState<Analytics | undefined>();

	// Initialize analytics after window object is available otherwise it'll cause errors.
	useEffect(() => {
		if (window && disableTracking === false) {
			const analyticsInstance = getAnalytics(app);
			setAnalytics(analyticsInstance);
		}
	}, []);

	/**
	 * A wrapper for google analytics logEvent
	 * @param eventName
	 * @param eventParams
	 * @param options
	 */
	function logEvent(
		eventName: string,
		eventParams?: { [key: string]: any },
		options?: AnalyticsCallOptions,
	) {
		if (!analytics) return;
		LogEventAnalytics(analytics, eventName, eventParams, options);
	}

	/**
	 * Log an event after a user logs in
	 * @param provider Name the sign in provider
	 */
	function logLoginEvent(provider: string) {
		logEvent("login", { provider: provider });
	}

	return { logEvent, logLoginEvent };
}
