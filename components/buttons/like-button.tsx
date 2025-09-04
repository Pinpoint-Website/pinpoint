"use client";

import { useState } from "react";
// you have to import from the client supabase file when it's a client component
import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    isLiked: boolean;
    userId: string | undefined; // we have to do this becuase of how getCurrentUser works, it can't garuentee that it'll get back to us with an id
}

export default function LikeButton({ postId, initialLikes, isLiked, userId }: LikeButtonProps) {
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [liked, setLiked] = useState(isLiked);
    const supabase = createClient();

    const handleLike = async () => {

        // get new like count and liked state
        const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
        const newLikedState = !liked;

        // update the ui first
        setLikeCount(newLikeCount);
        setLiked(newLikedState);

        let error = null;

        // if the user is liking a post, then make a new entry in the join table
        if (newLikedState) {
            // insert data into db
            const { error: likedInsertError } = await supabase.from("user_like_join").insert(
                {
                    user_id: userId,
                    post_id: postId
                }
            );

            error = likedInsertError;
        } else { // otherwise they're unliking a post 
            // update the db
            const { error: likedDeleteError } = await supabase.from("user_like_join").delete().eq("user_id", userId).eq("post_id", postId);

            if (likedDeleteError) {
                console.error("Error deleting the user_liked_join table entry:", likedDeleteError);
            } 

            error = likedDeleteError;
        }

        if (error) {
            console.error("Error updating user_like_join table:", error);
            // revert the ui state
            setLikeCount(initialLikes);
            setLiked(isLiked);
            return;
        }

        // update the database for the number of likes and if they've liked or unliked a post
        // the like count should be correctly updated already so we can just use that to set it
        const { error: postsError } = await supabase.from("posts").update({ likes: newLikeCount}).eq("id", postId);

        if (postsError) {
            console.error("Error updating likes:", postsError);
            // revert the UI if it doesn't work
            setLikeCount(initialLikes);
            setLiked(isLiked);
        }
    };

    return (
        <Button onClick={handleLike} className="flex items-center space-x-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>{likeCount}</span>
        </Button>
    );
}