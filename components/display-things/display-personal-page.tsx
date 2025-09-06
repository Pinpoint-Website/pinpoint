import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUserId } from "@/lib/get-user";
import Image from "next/image"; // Import the Next.js Image component

export async function PersonalPageDisplay() {
  const supabase = createClient(); // No await needed here for standard @supabase/ssr setup
  const userId = await getCurrentUserId();

  // Update your query to include photo_path
  const { data: personalPageData, error } = await (await supabase)
    .from("personal_page")
    .select("description, primary_role, photo_path") // Add photo_path
    .eq("id", userId)
    .single();

  if (error || !personalPageData) {
    console.error("Error fetching post:", error);
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
    <Card className="card-hover">
      <CardContent className="p-6">
        {/* 3. Render the image */}
        {publicImageUrl && (
          <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden">
            <Image
              src={publicImageUrl}
              alt="Profile photo"
              fill={true} 
              className="object-cover" 
            />
          </div>
        )}

        <h3 className="text-xl font-semibold tracking-tight mb-2">
          {personalPageData.primary_role}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {personalPageData.description}
        </p>
      </CardContent>
    </Card>
  );
}