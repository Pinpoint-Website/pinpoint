import CreatePersonalPage from "@/components/forms/create-personal-page-form";

export default async function NewPersonalPage() {
    // get the personal page information based off the user's id
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