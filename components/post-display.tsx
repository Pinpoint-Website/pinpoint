import { createClient } from "@/utils/supabase/server";
import { PostProps } from "@/lib/types";
import Link from 'next/link';

// this is just gonna be the thing that displays a post given a post id
export async function PostDisplay({ postId }: PostProps) {
    const supabase = await createClient();

    // `.select` get's the specific data we want to pull, for now i have it give it all to us but it's better to not do that in production
    // '.eq' filters for the specific post we wanna get
    // '.single()' makes sure to just get one
    const { data: post, error } = await supabase.from("posts").select("*").eq("id", postId).single();

    // Gemini written
    if (error || !post) {
        console.error("Error fetching post:", error);
        return (
            <div className="p-4 border rounded-md bg-red-100 text-red-800">
                <p>Sorry, the post with ID '{postId}' could not be found.</p>
            </div>
        );
    }

    // If the post is found, render its content (this is also Gemini written I really don't like styling stuff)
    return (
        <Link key={post.id} href={`/post/${postId}`}>
            <div className="p-4 border rounded-md bg-white shadow">
                <h1 className="text-3xl font-bold mb-4 text-gray-700">{post.short_desc}</h1>
                <p className="text-gray-700">{post.long_desc}</p>
                <div className="mt-4 text-xs text-gray-500">
                    Public: {post.is_public ? 'Yes' : 'No'}
                </div>
            </div>
        </Link>
    );
}