import Image from "next/image";
import ContactForm from "@/components/forms/contact-form";
import { getCurrentUserId } from "@/lib/get-user";
import { EditPersonalPageButton } from "../buttons/edit-personal-page-button";
import { createClient } from "@/lib/supabase/server";

interface PersonalPageDisplayProps {
  givenUserId: string;
}

export async function PersonalPageDisplay({ givenUserId }: PersonalPageDisplayProps) {
  const supabase = createClient(); // No await needed here for standard @supabase/ssr setup
  // get the  actual current user's id to see if they're the owner
  const currUserId = await getCurrentUserId();
  const isOwner = currUserId === givenUserId;

  // Update your query to include photo_path
  const { data: personalPageData, error } = await (await supabase)
    .from("personal_page")
    .select("description, primary_role, photo_path") // Add photo_path
    .eq("id", givenUserId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground">
        <p>Sorry, the personal page could not be found.</p>
      </div>
    );
  }

  // Get user information for contact form
  const { data: userData, error: userError } = await (await supabase)
    .from("users")
    .select("name, username")
    .eq("id", givenUserId)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground">
        <p>Sorry, the personal page could not be found.</p>
      </div>
    );
  }

  // For the contact form, we'll need to handle email differently
  // Since we can't access other users' emails from auth, we'll use a placeholder
  // In a real app, you might want to add an email field to the users table
  const { data: { user }, error: userEmailData } = await (await supabase).auth.getUser();
  const userEmail = user?.email; // Placeholder - you'll need to update this

  if (userEmailData) {
    console.error("Error fetching user:", userEmailData);
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground">
        <p>Sorry, the personal page could not be found.</p>
      </div>
    );
  }

  if (error || !personalPageData) {
    console.error("Error fetching personal page:", error);
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground">
        <p>Sorry, the personal page could not be found.</p>
      </div>
    );
  }

  // Generate the public URL for the image if photo_path exists
  let publicImageUrl: string | null = null;
  if (personalPageData.photo_path) {
    const { data: urlData } = await (await supabase).storage
      .from("profile_photos") // Make sure this is your bucket name
      .getPublicUrl(personalPageData.photo_path);

    publicImageUrl = urlData?.publicUrl || null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
      {/* Left side - Content */}
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {personalPageData.primary_role}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {personalPageData.description}
          </p>
        </div>

        {/* Contact form */}
        <div className="mt-8">
          <ContactForm
            recipientEmail={userEmail || "user@example.com"}
            recipientName={userData?.name || userData?.username || "User"}
          />
        </div>
      </div>

      {/* Right side - Profile photo */}
      <div className="flex items-center justify-center">
        {publicImageUrl ? (
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={publicImageUrl}
              alt="Profile photo"
              fill={true}
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full max-w-md aspect-square rounded-2xl bg-muted flex items-center justify-center shadow-2xl">
            <span className="text-4xl text-muted-foreground">📷</span>
          </div>
        )}
      </div>
      {isOwner ? (
        <EditPersonalPageButton />
      ) : (
        <></>
      )}
    </div>
  );
}
