"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { toggleLike } from "@/lib/actions/likes";

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    isLiked: boolean;
    userId: string | undefined; // we have to do this becuase of how getCurrentUser works, it can't garuentee that it'll get back to us with an id
}

export default function LikeButton({ postId, initialLikes, isLiked, userId }: LikeButtonProps) {
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [liked, setLiked] = useState(isLiked);

    const handleLike = async () => {

        // get new like count and liked state
        const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
        const newLikedState = !liked;

        // update the ui first
        setLikeCount(newLikeCount);
        setLiked(newLikedState);

        // use the server action to update the database
        const result = await toggleLike(userId, postId, liked);

        // check if the server action returns an error
        if (result?.success === false) {
            console.error("Failed to update likes:", result?.error);
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