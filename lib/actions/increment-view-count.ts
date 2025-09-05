"use server";

import { createClient } from "@/utils/supabase/server";

export async function incrementViewCount(postId: string) {
  const supabase = await createClient();

  // We can use an RPC call to a Postgres function for this to be cleaner,
  // but for now, we'll get the post, increment, and update.

  const { data: post, error } = await supabase
    .from("posts")
    .select("num_interested")
    .eq("id", postId)
    .single();

  if (error || !post) {
    console.error("Failed to fetch post for view count:", error);
    return;
  }

  const newInterestedCount = (post.num_interested || 0) + 1;

  await supabase
    .from("posts")
    .update({ num_interested: newInterestedCount })
    .eq("id", postId);
}