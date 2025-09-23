"use client";

import { PostDisplay } from "./display-things/post-display";
import { useState, useEffect } from 'react';

// Define the type for the action prop
type PostsProps = {
    page: number;
    fetchPostIdsAction: (page: number) => Promise<string[]>;
};

export function Posts({ page, fetchPostIdsAction }: PostsProps) {
    const [postIds, setPostIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Use the action that was passed in via props
                const result = await fetchPostIdsAction(page);
                setPostIds(result);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setPostIds([]);
            }
            setLoading(false);
        };
        fetchData();
    }, [page, fetchPostIdsAction]); // Add the action to the dependency array

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!Array.isArray(postIds) || postIds.length === 0) {
        return <p>No posts to display.</p>;
    }

    return (
        <div className="flex flex-col gap-4">
            {postIds.map((id) => (
                <PostDisplay key={id} postId={id} />
            ))}
        </div>
    );
}
