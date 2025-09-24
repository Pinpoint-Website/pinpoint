"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";

export async function toggleLike(userId: string | undefined, postId: string, isLiked: boolean) {
    const supabase = await createClient();

    // Toggle like: insert or delete from user_like_join
    // if it's liked, then delete the entry in the join table since that means we're unliking
    if (isLiked) {
        const { error } = await supabase.from("user_like_join").delete().eq("user_id", userId).eq("post_id", postId);
        if (error) {
            console.error("Error unliking post:", error);
            return { success: false, error: error.message };
        }
    } else { // if it's unliked then add it to the join table since that means we're liking
        const { error } = await supabase.from("user_like_join").insert({ user_id: userId, post_id: postId });
        if (error) {
            console.error("Error liking post:", error);
            return { success: false, error: error.message };
        }
    }

    // Count the number of likes for this post from user_like_join
    const { count, error: countError } = await supabase
        .from("user_like_join")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

    if (countError) {
        console.error("Error counting likes:", countError);
        return { success: false, error: countError.message };
    } else if (count === null || count === undefined) {
        console.error("Error counting likes:", countError);
        return { success: false, error: "Not sure how we got here without running the error check right above this one." };
    }

    // Update the post with the new like count which is based off the amount of rows in the join table
    const { error: updateLikeCountError } = await supabase
        .from("posts")
        .update({ likes: count })
        .eq("id", postId);

    if (updateLikeCountError) {
        console.error("Error updating the like amount for a post:", updateLikeCountError);
        return { success: false, error: updateLikeCountError.message };
    }

    // Revalidate the path's so the list updates for the favorites list and the post page itself
    revalidatePath(`/liked-posts/${userId}`);
    revalidatePath(`/post/${postId}`);

    return { success: true, likeCount: count };
}
