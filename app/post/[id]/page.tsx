import { createClient } from "@/utils/supabase/server";
import { formatDate } from "@/lib/format-date";
import { notFound } from 'next/navigation';
import BackButton from '@/components/buttons/back-button';
import { getCurrentUserId } from "@/lib/get-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import LikeButton from "@/components/buttons/like-button";

// Defines the expected structure for the page's parameters, specifically a dynamic 'id' from the URL.
interface PostPageProps {
  params: { id: string };
}

// This is a Next.js Server Component that fetches and displays a single post.
// All page components must be default exports.
export default async function PostPage({ params }: PostPageProps) {
  // Initializes the Supabase client for server-side operations.
  const supabase = await createClient();
  // Retrieves the post ID from the URL parameters.
  const postId = (await params).id;

  // Fetches the single post from the 'posts' table using the ID.
  // Using .single() ensures only one row is returned, which is more efficient.
  const { data: post, error } = await supabase.from("posts").select().eq("id", postId).single();
  
  // If no post is found or there's a database error, show the Next.js notFound page.
  if (error || !post) {
    notFound();
  }

  // --- View Count Logic ---
  // Increments the 'num_interested' count for the post.
  const newInterestedCount = (post.num_interested || 0) + 1;
  
  // Updates the post with the new view count in the database.
  const { data: updatedPost, error: updateError } = await supabase
    .from("posts")
    .update({ num_interested: newInterestedCount })
    .eq("id", postId)
    .select()
    .single();
  
  // Logs any errors during the update but allows the page to render.
  if (updateError) {
    console.error('Error updating interested count:', updateError);
  }

  // Uses the updated data if the update was successful, otherwise falls back to the original post data.
  const finalPost = updatedPost || post;

  // Formats the post's creation date for display.
  const formattedDate = formatDate(finalPost.created_at);

  // --- User and Ownership Check ---
  // Fetches the current user's ID to determine if they are the post's creator.
  const userId = await getCurrentUserId();
  const isOwner = userId === finalPost?.creator;

  // Fetches the creator's username from the 'users' table for display.
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("name,username")
    .eq("id", finalPost?.creator)
    .single();
    
  // Logs an error if the user profile cannot be found.
  if (userError) {
    console.error('Error finding the user:', userError);
  }

  // --- Like Status Check ---
  // Queries the 'user_like_join' table to see if the current user has liked this post.
  const { data: likeData, error: likeDataError } = await supabase
    .from("user_like_join")
    .select("user_id,post_id")
    .eq("user_id", finalPost?.creator)
    .eq("post_id", finalPost?.id)
    .single();
    
  // Checks for unexpected errors, ignoring the specific 'not found' error (PGRST116).
  if (likeDataError && likeDataError.code !== "PGRST116") {
    console.error("An unexpected error occurred while checking for a like:", likeDataError);
  }
  
  // Sets a boolean indicating whether the user has liked the post based on the query result.
  const hasLiked = !!likeData;

  // --- Component Rendering ---
  return (
    <div className="container-custom max-w-4xl">
      <div className="mb-4">
        {/* Renders a button to go back to the previous page. */}
        <BackButton />
      </div>
      
      {/* Container for the post content, using a Card component. */}
      <Card className="card-hover">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            {/* Post Title */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{finalPost.short_desc}</h1>
            
            {/* Conditionally renders an "Edit" button if the current user is the post's creator. */}
            {isOwner && (
              <Button asChild size="sm">
                <Link href={`/edit-post/${finalPost.id}`}>Edit</Link>
              </Button>
            )}
          </div>
          
          {/* Post metadata including author, date, views, and like button. */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <span>by {user?.username}</span>
            <span>•</span>
            <span>Published on {formattedDate}</span>
            <span>•</span>
            <span>
              {/* Displays the view count. */}
              {finalPost.num_interested} {finalPost.num_interested === 1 ? 'View' : 'Views'}
            </span>
            {/* A client component button to handle liking/unliking the post. */}
            <LikeButton postId={finalPost?.id} initialLikes={finalPost?.likes} isLiked={hasLiked} userId={userId} />
            {/* Displays a badge indicating if the post is Public or Private. */}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${finalPost.is_public ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {finalPost.is_public ? 'Public' : 'Private'}
            </span>
          </div>
          
          {/* Post's main content with preserved line breaks. */}
          <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {finalPost.long_desc}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}