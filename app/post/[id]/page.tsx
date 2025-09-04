import { createClient } from "@/utils/supabase/server";
import { formatDate } from "@/lib/format-date";
import { notFound } from 'next/navigation';
import BackButton from '@/components/buttons/back-button';
import { getCurrentUserId } from "@/lib/get-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// we need to do it like this to get the id from the redirect
// while not strictly necessary for just one thing (for now it's just id), it could help down the road if we add different stuff like categories
interface PostPageProps {
    params: {
        id: string
    };
}

// next.js's router requires all page.tsx file functions to be default exports
export default async function PostPage({ params } : PostPageProps ) {
    const supabase = await createClient();
    const postId = (await params).id; // idk the build said i should do it this way

    // get the post and its details and display them
    // gemini said it's faster and more reliable to just re-query compared to passing the data from the post-display on the fyp
    const { data: post, error } = await supabase.from("posts").select("*").eq("id", postId).single(); 

    // Gemini written
    if (error || !post) {
        notFound();
    }

    // if we've made it here, we can safely say that they have viewed the post, this stuff was gemini generated
    // Increment the num_interested count
    const newInterestedCount = (post.num_interested || 0) + 1;

    // Update the post with the new count in the database
    const { data: updatedPost, error: updateError } = await supabase
        .from("posts")
        .update({ num_interested: newInterestedCount })
        .eq("id", postId)
        .select()
        .single();

    if (updateError) {
        // Handle the update error, but allow the page to render
        console.error('Error updating interested count:', updateError);
    }

    // Use the updatedPost data if the update was successful, otherwise use the original post
    const finalPost = updatedPost || post;

    // format the date
    const formattedDate = formatDate(finalPost.created_at);

    // get the user to compare them to the owner of this post
    const userId = await getCurrentUserId();
    const isOwner = userId == finalPost?.creator;

    return (
        <div className="min-h-screen flex items-center justify-center">
            {/* Container for the post content */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-4xl mx-auto">
                
                {/* Go Back button */}
                <BackButton />

                {/* Conditional rendering for the edit button */}
                {isOwner && (
                    <div className="flex justify-end mb-4">
                        <Button asChild size="lg">
                            <Link href={`/edit-post/${finalPost.id}`}>Edit Post</Link>
                        </Button>
                    </div>
                )}

                {/* Post Title */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {post.short_desc}
                </h1>
                
                {/* Post Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Published on {formattedDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>
                        {finalPost.num_interested} {finalPost.num_interested === 1 ? 'View' : 'Views'}
                    </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${finalPost.is_public ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {finalPost.is_public ? 'Public' : 'Private'}
                </span>
                </div>

                {/* Post Body */}
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {finalPost.long_desc}
                </p>

            </div>
        </div>
    );
}