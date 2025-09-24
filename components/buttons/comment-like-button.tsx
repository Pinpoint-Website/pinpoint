"use client";

import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { toggleCommentLike } from "@/lib/actions/comment-likes";

interface CommentLikeButtonProps {
    commentId: string;
    initialLikes: number | null | undefined; // has to be this because it comes directly from the db
    isLiked: boolean;
    userId: string | undefined;
}

export default function CommentLikeButton({ commentId, initialLikes, isLiked, userId }: CommentLikeButtonProps) {
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [liked, setLiked] = useState(isLiked);
    const [isLoading, setIsLoading] = useState(false);
    const requestInProgress = useRef(false);

    const handleLike = async () => {
        // Prevent multiple simultaneous requests
        if (isLoading || requestInProgress.current) {
            return;
        }

        const previousLikeCount = likeCount;

        // use the server action to update the database
        const result = await toggleCommentLike(userId, commentId, liked);
        const newLikedState = !liked;

        // update the ui first
        setLikeCount(result.likeCount);
        setLiked(newLikedState);
        setIsLoading(true);
        requestInProgress.current = true;

        // check if the server action returns an error
        if (result?.success === false) {
            console.error("Failed to update comment likes:", result?.error);
            // Rollback UI state
            setLikeCount(previousLikeCount);
            setLiked(!newLikedState);
        } else {
            setIsLoading(false);
            requestInProgress.current = false;
        }
    };

    return (
        <Button
            onClick={handleLike}
            variant="ghost"
            size="sm"
            disabled={isLoading}
            className="flex items-center space-x-1 h-auto p-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
            <svg
                className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'fill-none'} ${isLoading ? 'animate-pulse' : ''}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
            </svg>
            <span className="text-xs">{likeCount}</span>
        </Button>
    );
}
