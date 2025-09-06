import { redirect } from "next/navigation";
import { getCurrentUserId } from "../get-user";

export async function redirectToProfile() {
    redirect(`/personal-page/${await getCurrentUserId()}`);
}