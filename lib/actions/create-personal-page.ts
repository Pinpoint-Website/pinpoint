"use server"

import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { getCurrentUserId } from "../get-user";

export async function createPersonalPage(formData: FormData) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  // Extract text data from FormData
  const primaryRole = formData.get("primaryRole") as string;
  const description = formData.get("description") as string;
  const file = formData.get("profilePhoto") as File | null;

  let photoPath: string | null = null;

  // Handle File Upload (if a file was provided)
  if (file && file.size > 0) {
    // Create a unique file path to avoid collisions
    const fileExtension = file.name.split('.').pop();
    const fullPathForUpload = `private/${userId}/avatar.${fileExtension}`;

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await (await supabase).storage
      .from("profile_photos")
      .upload(fullPathForUpload, file);

    if (storageError) {
      console.error("Storage upload error:", storageError);
      throw new Error("Failed to upload profile photo.");
    }
    photoPath = storageData.path;
  }

  // Insert data into the database table
  const { error: dbError } = await (await supabase).from("personal_page").insert({
    id: userId, // Assuming 'id' column links to auth.users.id
    primary_role: primaryRole,
    description: description,
    photo_path: photoPath // Save the path from storage here
  });

  if (dbError) {
    console.error("Database insert error:", dbError);
    // If upload succeeded but DB insert failed, consider deleting the orphaned file from storage here.
    throw new Error("Failed to save profile data to database.");
  }

  // Redirect on success
  redirect(`/personal-page/${userId}`);
}
