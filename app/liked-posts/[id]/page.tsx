import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';
import { formatDate } from "@/lib/format-date";
import Link from "next/link";
import { NavBarForMyPosts } from "@/components/navigation/nav-bar-my-posts";

interface LikedPostsPageParams {
    params: {
        id: string
    }
}

export default async function MyPosts({ params } : LikedPostsPageParams) {
    const supabase = await createClient();
    const userId = (await params).id; // the console throws an error if you don't do it like this 

    // From here on out this is gemini generated
    // Use .eq() to filter for posts where the 'creator' column matches the userId.
    const { data: postsData, error } = await supabase
        .from("user_like_join")
        .select("post_id") // Select only the necessary columns
        .eq("user_id", userId);

    if (error) {
        // If there's an error or no posts are found, show a 404 page
        notFound();
    }

    // get the post id's
    const postIds = postsData.map(entry => entry.post_id);

    // use those id's to find the actual posts --- using the 'in()' thing bc Gemini says it's more effeicient for filtering multiple values in a single query
    const { data: likedPosts, error: likedPostsError } = await supabase.from("posts").select().in("id", postIds);

    if (likedPostsError) {
        console.error("Error fetching liked posts:", likedPostsError);
        return;
    }

    // Check if the posts array is empty to provide a specific message
    if (likedPosts.length === 0) {
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
                    {likedPosts.map((likedPosts) => (
                        <li key={likedPosts.short_desc} className="p-4 rounded-md shadow-sm bg-gray-800">
                            {/* Wrap the content with the Link component */}
                            <Link href={`/post/${likedPosts.id}`} className="block">
                                <h2 className="text-xl font-semibold mb-2">{likedPosts.short_desc}</h2>
                                <p className="text-gray-400 text-sm">
                                    Created: {formatDate(likedPosts.created_at)}
                                </p>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${likedPosts.is_public ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'}`}>
                                    {likedPosts.is_public ? 'Public' : 'Private'}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}