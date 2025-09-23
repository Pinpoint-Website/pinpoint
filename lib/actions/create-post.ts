"use server" // need to declare it as a server component because that's the only way a client can do a server action

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";
import { PostData } from "@/lib/types";
import { redirect } from "next/navigation";
// import { createTag } from "./create-tag";

export async function createPost(formData: PostData) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  // Handle case where error occurs
  // type script really want's to make sure that user exists so you actually need this or there'll be a red squiggly line when you access anything within 'user'
  if (userError || !user) {
    console.error("User not authenticated:", userError);
    return redirect("/auth/login");
  }

  // insert the data and get it's id
  const { data, error } = await (await supabase).from("posts").insert({
    short_desc: formData.shortDesc,
    long_desc: formData.longDesc,
    is_public: formData.isPublic,
    creator: user.id
  }).select('id').single();

  /*
  // Make the relation in the join table only if it doesn't already exist
  for (const tag of formData.tags) {
    // first check if the tag even exists, and add it if it doesn't
    console.log("it could exist");
    const tagId = await createTag(tag);
 
    // check if it already exists
    const tagData = {
      post_id: data?.id,
      tag_id: tagId
    };
    const { data: existing } = await supabase
      .from("post_tags_join")
      .select()
      .match(tagData)
      .single();
 
    // add it if it doesn't exist
    if (!existing) {
      const { error: tagInsertError } = await supabase
        .from('post_tags_join')
        .insert(tagData);
 
      if (tagInsertError) {
        console.error("Error putting tag into tag and post jointable:", tagInsertError);
      }
    } // do nothing if it doesn't exist
  }
  */
  if (error) {
    // You can add more robust error handling here
    console.error("Error inserting data:", error);
    return { message: "Failed to create post." };
  }

  // This will clear the cache for the posts page, ensuring the new post appears.
  revalidatePath("/posts");

  redirect(`/post/${data?.id}`);
}
