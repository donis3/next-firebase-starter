import { getAuthAction } from "./actions";
import { redirect } from "next/navigation";
import DeleteAccount from "./DeleteAccount";
import { UserRecord } from "firebase-admin/auth";

export default async function UserPage() {
	const user = (await getAuthAction()) as UserRecord | undefined;
	if (!user) {
		return redirect("/user/login");
	}

	return (
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
						<span className="font-medium">Registration Date</span>
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
			<p className="p-2 text-sm mt-4  max-w-2xl mx-auto">
				This data is from Firebase Auth and contained in UserRecord. For
				additional fields for a user, we can use the firestore database
				and create a users collection. We can store any data we want for
				a user in the database and to find the related record, we can
				use the user.uid as the key
			</p>
		</section>
	);
}
