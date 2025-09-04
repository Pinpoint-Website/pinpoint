"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function toggleLike(userId: string, postId: string, isLiked: boolean) {
    const supabase = await createClient();

    // if a post is already liked, that means we're disliking which means we need to remove the like
    if (isLiked) {
        const { error } = await supabase.from("user_like_join").delete().eq("user_id", userId).eq("post_id", postId);
        if (error) {
            console.error("Error unliking post:", error);
            return { success: false, error: error.message };
        }
    } else { // if the post isn't liked, that means we're liking which means we need to add a like to the join table
        const { error } = await supabase.from("user_like_join").insert({ user_id: userId, post_id: postId});
        if (error) {
            console.error("Error liking post:", error);
            return { success: false, error: error.message };
        }
    }

    // get the post we want to modify so we know how many likes it already had
    const { data: targetPost, error: targetPostError } = await supabase
        .from("posts").select("likes").eq("id", postId).single();

    if (targetPostError) { 
        console.error("Error getting target post table:", targetPostError);
        return { success: false, error: targetPostError.message };
    }

    // get new like count
    const newLikesCount = isLiked ? targetPost.likes - 1 : targetPost.likes + 1;

    // update the post with the new total like count
    const { error: updateLikeCountError } = await supabase
        .from("posts")
        .update({ likes: newLikesCount})
        .eq("id", postId);
    
    if (updateLikeCountError) {
        console.error("Error updating the like amount for a post:", updateLikeCountError);
        return { success: false, error: updateLikeCountError.message };
    }

    // Revalidate the path's so the list updates for the favorites list and the post page itself
    revalidatePath(`/liked-posts/${userId}`);
    revalidatePath(`/post/${postId}`);
}   