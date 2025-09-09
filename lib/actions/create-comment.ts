"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/get-user";

export async function createComment(postId: string, commentBody: string) {
  const supabase = await createClient();
  const userId = await getCurrentUserId();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  if (!commentBody.trim()) {
    return { success: false, error: "Comment cannot be empty" };
  }

  // Insert the comment into the database
  const { error } = await supabase.from("comments").insert({
    comment_body: commentBody.trim(),
    creator: userId,
    post: postId
  });

  if (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to create comment" };
  }

  // Revalidate the post page to show the new comment
  revalidatePath(`/post/${postId}`);
  
  return { success: true };
}
