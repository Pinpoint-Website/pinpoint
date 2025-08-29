"use server"; // This directive marks all functions in this file as server-side.

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

type PostData = {
  shortDesc: string;
  longDesc: string;
  isPublic: boolean;
};

export async function createPost(formData: PostData) {
  const supabase = createClient();

  const { error } = await (await supabase).from("posts").insert({
    short_desc: formData.shortDesc,
    long_desc: formData.longDesc,
    is_public: formData.isPublic,
  });

  if (error) {
    // You can add more robust error handling here
    console.error("Error inserting data:", error);
    return { message: "Failed to create post." };
  }
  
  // This will clear the cache for the posts page, ensuring the new post appears.
  revalidatePath("/posts"); 

  return { message: "Post created successfully." };
}