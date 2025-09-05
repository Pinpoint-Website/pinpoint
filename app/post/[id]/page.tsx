import { createClient } from "@/utils/supabase/server";
import { formatDate } from "@/lib/format-date";
import { notFound } from 'next/navigation';
import BackButton from '@/components/buttons/back-button';
import { getCurrentUserId } from "@/lib/get-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import LikeButton from "@/components/buttons/like-button";
import ViewTracker from "@/components/logic/view-tracker";

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

  // --- User and Ownership Check ---
  // Fetches the current user's ID to determine if they are the post's creator.
  const userId = await getCurrentUserId();
  const isOwner = userId === post?.creator;

  // if the page is marked as not public, then it should return a 404 page unless they're the owner
  if (!isOwner && !post?.is_public) {
    notFound();
  }

  // Formats the post's creation date for display.
  const formattedDate = formatDate(post.created_at);

  // Fetches the creator's username from the 'users' table for display.
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("name,username")
    .eq("id", post?.creator)
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
    .eq("user_id", post?.creator)
    .eq("post_id", post?.id)
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
      <ViewTracker postId={postId} />
      
      {/* Container for the post content, using a Card component. */}
      <Card className="card-hover">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            {/* Post Title */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{post.short_desc}</h1>
            
            {/* Conditionally renders an "Edit" button if the current user is the post's creator. */}
            {isOwner && (
              <Button asChild size="sm">
                <Link href={`/edit-post/${post.id}`}>Edit</Link>
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
              {post?.num_interested} {post?.num_interested === 1 ? 'View' : 'Views'}
            </span>
            {/* A client component button to handle liking/unliking the post. */}
            <LikeButton postId={post?.id} initialLikes={post?.likes} isLiked={hasLiked} userId={userId} />
            {/* Displays a badge indicating if the post is Public or Private. */}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post?.is_public ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {post?.is_public ? 'Public' : 'Private'}
            </span>
          </div>
          
          {/* Post's main content with preserved line breaks. */}
          <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {post?.long_desc}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}