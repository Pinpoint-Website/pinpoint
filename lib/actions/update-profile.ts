"use server"

import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

type PersonalPageUpdate = {
  description: string;
  primary_role: string;
  photo_path?: string;
}

export async function updateProfile(personalPageId: string, formData: FormData) {
  const supabase = await createClient();

  // Extract text data from FormData
  const primaryRole = formData.get("primaryRole") as string;
  const description = formData.get("description") as string;
  const file = formData.get("profilePhoto") as File | null;

  let photoPath: string | null = null;

  // Handle File Upload (if a file was provided)
  if (file && file.size > 0) {
    // Create a unique file path to avoid collisions
    const fileExtension = file.name.split('.').pop();
    const fullPathForUpload = `private/${personalPageId}/avatar.${fileExtension}`;

    // delete old file before uploading new one
    await supabase.storage
      .from("profile_photos")
      .remove([fullPathForUpload]);

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("profile_photos")
      .upload(fullPathForUpload, file);

    if (storageError) {
      console.error("Storage upload error:", storageError);
      return { error: "Failed to upload profile photo." };
    }
    photoPath = storageData.path;
  }

  // Prepare update payload
  const updatePayload: PersonalPageUpdate = {
    description,
    primary_role: primaryRole,
  };

  // if they chose to update their photo
  if (photoPath) {
    updatePayload.photo_path = photoPath;
  }

  // update the personal page
  const { error: updatePersonalPageError } = await supabase.from("personal_page").update(updatePayload)
    .eq("id", personalPageId);

  // error handling
  if (updatePersonalPageError) {
    console.error("The personal page couldn't be updated:", updatePersonalPageError);
    // If upload succeeded but DB update failed, consider deleting the orphaned file from storage here.
    return { error: "The personal page couldn't be updated." }
  }

  // if everything goes fine then just redirect to the homepage
  redirect(`/personal-page/${personalPageId}`);
}
