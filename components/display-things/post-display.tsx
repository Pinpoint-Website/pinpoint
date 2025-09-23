"use client";

import { PostProps } from "@/lib/types";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

// Define a type for the post state
type PostData = {
  id: string;
  short_desc: string;
  long_desc: string;
  is_public: boolean;
  num_interested: number;
  likes: number;
  // Add any other fields you need
};

// 3. The component is now a standard, non-async function
export function PostDisplay({ postId }: PostProps) {
  const [post, setPost] = useState<PostData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 4. All async logic moves inside useEffect
    const fetchPost = async () => {
      const supabase = createClient(); // Your client is meant to be used here
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        setError(`Post with ID ${postId} could not be found.`);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [postId]); // Rerun this effect if postId changes

  // 5. Render based on the loading, error, and post states
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
          <div className="h-12 w-full bg-muted rounded animate-pulse mt-2"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !post) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Link key={post.id} href={`/post/${postId}`} className="block">
      <Card className="card-hover">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold tracking-tight mb-2">{post.short_desc}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3">{post.long_desc}</p>
          <div className="mt-4 text-xs text-muted-foreground">
            {post.is_public ? 'Public' : 'Private'}
          </div>
          <div className="flex flex-row">
            <div className="pr-4">
              {post?.num_interested} {post?.num_interested === 1 ? 'View' : 'Views'}
            </div>
            <div className="px-4">
              {post?.likes} {post?.likes == 1 ? 'Like' : 'Likes'}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
