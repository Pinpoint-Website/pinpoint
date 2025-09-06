import CreatePersonalPage from "@/components/forms/create-personal-page-form";
import { hasProfile } from "@/lib/actions/has-profile";
import { getCurrentUserId } from "@/lib/get-user";
import { redirect } from "next/navigation";

export default async function NewPersonalPage() {
    const userId = await getCurrentUserId();

    // run a check to see if they already have a page, and if so then redirect them to there
    if (await hasProfile(userId)) {
        console.log("ASDFASDFASDF");
        redirect(`/personal-page/${await getCurrentUserId()}`);
    } else {
        return (
            <div className="space-y-6">
                <div>
                <h1 className="heading-1">Create Your Profile</h1>
                <p className="text-muted-foreground">Tell others about yourself, maybe link your LinkedIn.</p>
                </div>
                <CreatePersonalPage />
            </div>
        );
    }
}