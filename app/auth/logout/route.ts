import { logout } from "@/lib/firebase-auth-api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	//Handle logout request
	if (await logout()) {
		//Logout success
		revalidatePath("/dashboard");
		return redirect("/?notify=logout_success&refresh=true");
	}
	return redirect("/");
}
