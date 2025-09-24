"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function toggleCommentLike(userId: string | undefined, commentId: string, isLiked: boolean) {
    const supabase = await createClient();

    // if a comment is already liked, that means we're disliking which means we need to remove the like
    if (isLiked) {
        const { error } = await supabase.from("user_comment_like_join").delete().eq("user_id", userId).eq("comment_id", commentId);
        if (error) {
            // Handle case where like doesn't exist (race condition)
            if (error.code === "PGRST116") {
                console.error("Like not found for deletion", error);
                return { success: false, error: error.message };
            } else {
                console.error("Error unliking comment:", error);
                return { success: false, error: error.message };
            }
        }
    } else { // if the comment isn't liked, that means we're liking which means we need to add a like to the join table
        const { error } = await supabase.from("user_comment_like_join").insert({ user_id: userId, comment_id: commentId });
        if (error) {
            // Handle duplicate key error gracefully (race condition)
            if (error.code === "23505") {
                console.error("Duplicate like detected", error);
                return { success: false, error: error.message };
            } else {
                console.error("Error liking comment:", error);
                return { success: false, error: error.message };
            }
        }
    }

    // get the comment we want to modify so we know how many likes it already had
    const { data: targetComment, error: targetCommentError } = await supabase
        .from("comments").select("likes,id").eq("id", commentId).single();

    if (targetCommentError) {
        console.error("Error getting target comment table:", targetCommentError);
        return { success: false, error: targetCommentError.message };
    }

    // get new like count, and use it to update the count for the like
    const { count, error: countError } = await supabase
        .from("user_comment_like_join")
        .select("*", { count: "exact", head: true })
        .eq("comment_id", targetComment.id);

    if (countError) {
        console.error("Error counting number of likes for a comment", countError);
        return { success: false, error: countError.message };
    }

    // update the comment with the new total like count
    const { error: updateLikeCountError } = await supabase
        .from("comments")
        .update({ likes: count })
        .eq("id", commentId);

    if (updateLikeCountError) {
        console.error("Error updating the like amount for a comment:", updateLikeCountError);
        return { success: false, error: updateLikeCountError.message };
    }

    // Revalidate the post page so the comment likes update
    // We need to get the post ID from the comment to revalidate the correct path
    const { data: commentData, error: commentError } = await supabase
        .from("comments")
        .select("post")
        .eq("id", commentId)
        .single();

    if (commentError) {
        console.error("Error getting comment post ID:", commentError);
        return { success: false, error: commentError.message };
    }

    revalidatePath(`/post/${commentData.post}`);

    return { success: true, likeCount: count };
}
