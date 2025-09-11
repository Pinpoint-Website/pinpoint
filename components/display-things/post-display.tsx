import { createClient } from "@/utils/supabase/server";
import { PostProps } from "@/lib/types";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Divide } from "lucide-react";

export async function PostDisplay({ postId }: PostProps) {
  const supabase = await createClient();
  const { data: post, error } = await supabase.from("posts").select("*").eq("id", postId).single();

  if (error || !post) {
    console.error("Error fetching post:", error);
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground">
        <p>Sorry, the post with ID `{postId}` could not be found.</p>
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
