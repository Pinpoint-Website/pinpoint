import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';
import { formatDate } from "@/lib/format-date";
import Link from "next/link";
import { NavBarForMyPosts } from "@/components/navigation/nav-bar-my-posts";

interface MyPostsPage {
    params: {
        id: string
    }
}

export default async function MyPosts({ params } : MyPostsPage) {
    const supabase = await createClient();
    const userId = (await params).id; // the console throws an error if you don't do it like this 

    // From here on out this is gemini generated
    // Use .eq() to filter for posts where the 'creator' column matches the userId.
    const { data: posts, error } = await supabase
        .from("posts")
        .select("short_desc, created_at, is_public, id") // Select only the necessary columns
        .eq("creator", userId);

    if (error || !posts) {
        // If there's an error or no posts are found, show a 404 page
        notFound();
    }
    
    // Check if the posts array is empty to provide a specific message
    if (posts.length === 0) {
        return (
            <div className="text-center p-8">
                <p>No posts found for this user.</p>
            </div>
        );
    }

    return (
        <div className="mx-auto p-4 min-w-screen">
            <NavBarForMyPosts />
            <div className="flex flex-col items-center justify-center" >
                 <ul className="space-y-4 w-1/2">
                    {posts.map((post) => (
                        <li key={post.short_desc} className="p-4 rounded-md shadow-sm bg-gray-800">
                            {/* Wrap the content with the Link component */}
                            <Link href={`/post/${post.id}`} className="block">
                                <h2 className="text-xl font-semibold mb-2">{post.short_desc}</h2>
                                <p className="text-gray-400 text-sm">
                                    Created: {formatDate(post.created_at)}
                                </p>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.is_public ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}`}>
                                    {post.is_public ? 'Public' : 'Private'}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}