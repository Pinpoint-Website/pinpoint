// @/lib/update-post.ts
"use server" // This declares the entire file as a Server Action

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Assuming PostData is defined in your types library
import { PostData } from "@/lib/types";

// This function now takes the postId as a required parameter 
// this was generated my gemini and based on 'create-post' as a template
export async function updatePost(postId: string, formData: PostData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated:", userError);
    return { error: "User is not authenticated" };
  }

  // Use the update method and filter by the postId
  const { error } = await supabase
    .from("posts")
    .update({
      short_desc: formData.shortDesc,
      long_desc: formData.longDesc,
      is_public: formData.isPublic,
      // You don't need to update the creator here
    })
    .eq("id", postId); // This is the crucial line that specifies which post to update

  if (error) {
    console.error("Error updating data:", error);
    return { message: "Failed to update post." };
  }
  
  // Revalidate the path for the specific post and the list of posts
  revalidatePath(`/posts/${postId}`); 
  revalidatePath("/posts");

  // go back by one page
  redirect(`/post/${postId}`);
}