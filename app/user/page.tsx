import { getAuthAction } from "./actions";
import { redirect } from "next/navigation";
import DeleteAccount from "./DeleteAccount";
import { UserRecord } from "firebase-admin/auth";
import CodeHighlighter from "../_components/CodeHighlighter";

export default async function UserPage() {
	const user = (await getAuthAction()) as UserRecord | undefined;
	if (!user) {
		console.log("User not logged in");
		return redirect("/user/login");
	}

	return (
		<>
			<section className="mt-10 p-2">
				{/* Card Wrapper */}
				<div className="border rounded-md bg-slate-50 overflow-hidden max-w-2xl mx-auto">
					{/* Card Header */}
					<div className="flex flex-row gap-2 items-center bg-zinc-200 justify-between p-2">
						<h3 className="font-bold flex-1 ">
							&#128100; Profile Details
						</h3>

						<DeleteAccount className="px-2 py-1 rounded-md bg-red-700 font-bold text-sm text-white">
							Delete Account
						</DeleteAccount>
					</div>

					{/* Card Body */}
					<div className="flex flex-col items-center md:flex-row w-full p-2 text-sm gap-10">
						{/* User Profile Image */}
						{user.photoURL && (
							<div className="w-1/4 flex flex-col items-center justify-center gap-1">
								<img
									src={user.photoURL}
									alt="User image"
									className="rounded-full w-auto"
									referrerPolicy="no-referrer"
								/>
								<span className="font-medium">
									{user.displayName}
								</span>
							</div>
						)}

						{/* User Details */}
						<div
							className="grid gap-y-2 gap-x-4 flex-1 overflow-hidden text-ellipsis"
							style={{ gridTemplateColumns: "auto 1fr" }}>
							{/* Row */}
							<span className="font-medium">Name</span>
							<span>{user.displayName}</span>
							{/* Row */}
							<span className="font-medium">Email</span>
							<span>{user.email}</span>
							{/* Row */}
							<span className="font-medium">
								Registration Date
							</span>
							<span>{user.metadata.creationTime}</span>
							{/* Row */}
							<span className="font-medium">User Role</span>
							<span>
								{/* Access token custom claims to check if user is admin */}
								{user?.customClaims?.admin === true
									? "Admin"
									: "User"}
							</span>
							{/* Row */}
							<span className="font-medium">Auth Provider</span>
							<span>
								{user.providerData[0]?.providerId ?? "Unknown"}
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Route Information */}
			<section className="p-2 md:p-4 max-w-[80ch] mx-auto leading-tight">
				<h3 className="font-medium py-2 text-lg tracking-tighter">
					&#128312; Route '/user' (User Profile){" "}
					<span className="text-sm font-light">Protected</span>
				</h3>
				<p className="py-2 ">
					All user data is coming from firebase/auth. We can't add
					additional fields or mutate it. User roles are added via
					customClaims and lives inside the JWT token itself. It's not
					saved in a database.
					<br />
					<br />
				</p>
				<CodeHighlighter>
					{`//How to protect a route
const user = (await getAuthAction()) as UserRecord | undefined;
if (!user) {
	return redirect("/user/login");
}`}
				</CodeHighlighter>

				<h3 className="font-medium py-2 text-lg tracking-tighter mt-10">
					&#128312; Further Reading: Saving additional fields for a
					user
				</h3>
				<p className="py-2 ">
					As mentioned before, we can only get user information from
					firebase/auth and can't add additional fields. We need to
					use the firestore database and create a document per user to
					save more information. This is beyond the scope of this
					project but here is an example.
					<br />
					<br />
					Lets say we create a{" "}
					<span className="font-bold">users</span> collection in
					firestore. We can set the documentID same as the user.uid so
					each document can be easily found when we have a user
					object.
					<br />
					<br />
					Here is an example function that saves a message in a
					document that is bound to the user. We can then create a
					server action to call this function when we want to save a
					new text in this users document. You can add any data to a
					document this way.
				</p>
				<CodeHighlighter>
					{`

/**
 * Check if a user is available (request cookies) and
 * adds the message to users document saved in database.
 * @param message A message to save in firestore
 * @returns
 */
export async function postMessageToCurrentUser(message: string) {
	try {
		if (message.length < 5) return;

		//1. Verify user
		const user = await getCurrentUser();
		if (!user) return;
		const docId = user.uid;

		//2. Load user document
		const docRef = db.collection("users").doc(docId);
		const doc = await docRef.get();

		if (!doc.exists) {
			//3. If document not found, create it
			await docRef.set({ messages: [message] } as UserProfileData);
			return true;
		} else {
			//3. If document found update it
			const currentData = doc.data() as UserProfileData;

			//Tip: check if message already exists? prevent double post
			if (currentData.messages.includes(message)) return;
			//Merge the old data and new message
			const newData: UserProfileData = {
				...currentData,
				messages: [...currentData.messages, message],
			};
			//save the document
			await docRef.set(newData);
			return true;
		}
	} catch (error: any) {
		console.log("Database error: ", error?.code);
		return;
	}
}`}
				</CodeHighlighter>
			</section>
		</>
	);
}
