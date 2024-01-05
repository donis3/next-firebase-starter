import DeleteAccount from "@/app/_components/DeleteAccount";
import { getCurrentUser, isLoggedIn } from "@/lib/firebase-auth-api";
import Link from "next/link";
import { redirect } from "next/navigation";
import Profile from "./profile";
export const dynamic = "force-dynamic";

export default async function Dashboard() {
	//This is extra protection. It'll validate the token by connecting to firebase. Its a costly operation.
	if (!(await isLoggedIn(true))) {
		return redirect("/auth/logout");
	}

	//This is enough to protect a route. It'll only check the JWT token validity stored in the cookie.
	const user = await getCurrentUser();
	if (!user) redirect("/auth/login?cb=/dashboard&notify=auth_required"); //Will redirect to dashboard after login using ?cb=/path url param

	return (
		<>
			<section className="mt-10 p-2">
				<div className="border rounded-md bg-slate-50 overflow-hidden">
					<h3 className=" bg-zinc-500 px-2 py-1 font-bold text-white">
						&#128100; Profile Details
					</h3>

					<div className="flex flex-col items-center md:flex-row w-full p-2 text-sm gap-10">
						{/* User Profile Image */}
						<div className="w-1/4 flex flex-col items-center justify-center gap-1">
							<img
								src={user.photoURL}
								alt="User image"
								className="rounded-full w-auto"
							/>
							<span className="font-medium">
								{user.displayName}
							</span>
						</div>

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
					<div className="p-2 flex justify-center items-center  w-full gap-2 border-t">
						<Link
							href={"/auth/logout"}
							className="px-2 py-1 rounded-md bg-zinc-800 font-bold text-sm text-white"
							prefetch={false}>
							Log Out
						</Link>
						<DeleteAccount className="px-2 py-1 rounded-md bg-red-800 font-bold text-sm text-white">
							Delete Account
						</DeleteAccount>
					</div>
				</div>
				<p className="p-2 text-sm mt-4">
					This data is from Firebase Auth and contained in UserRecord.
					For additional fields for a user, we can use the firestore
					database and create a users collection. We can store any
					data we want for a user in the database and to find the
					related record, we can use the user.uid as the key
				</p>
			</section>
			{/* Profile Section for the user data stored in firestore database  */}
			<section className="mt-10 p-2">
				<Profile user={user.toJSON()} />
				<p className="p-2 text-sm mt-4">
					Here is a demonstration of saving additional user data in
					fireStore database above. We create a new document in users
					collection with the same id as the user.uid so we can easily
					find it as profile data.
				</p>
			</section>
		</>
	);
}
