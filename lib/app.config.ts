/* -------------------------------------------------------------------------- */
/*             Config file for various settings throughout the app            */
/* -------------------------------------------------------------------------- */

type AppConfigType = {
	appName: string;
	sessionCookieName: string;
	sessionCookieDuration: number;
	adminEmails: string[];
};

const appConfig: AppConfigType = {
	/**
	 * Application Name
	 */
	appName: "Next-Firebase",
	/**
	 * Cookie name for storing user auth token
	 */
	sessionCookieName: "_next_firebase_session",
	/**
	 * Cookie duration in milliseconds
	 */
	sessionCookieDuration: 60 * 60 * 24 * 7 * 1000,
	/**
	 * If a user is created and verified email matches one of these emails, they'll become an admin
	 */
	adminEmails: ["donis3@gmail.com"],
} as const;

export default appConfig;
