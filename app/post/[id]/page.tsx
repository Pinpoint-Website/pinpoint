import { createClient } from "@/utils/supabase/server";
import { formatDate } from "@/lib/format-date";
import { notFound } from 'next/navigation';
import BackButton from '@/components/buttons/back-button';
import { getCurrentUserId } from "@/lib/get-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import LikeButton from "@/components/buttons/like-button";

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient();
  const postId = (await params).id;

  const { data: post, error } = await supabase.from("posts").select().eq("id", postId).single();
  if (error || !post) {
    notFound();
  }

  const newInterestedCount = (post.num_interested || 0) + 1;
  const { data: updatedPost, error: updateError } = await supabase
    .from("posts")
    .update({ num_interested: newInterestedCount })
    .eq("id", postId)
    .select()
    .single();
  if (updateError) {
    console.error('Error updating interested count:', updateError);
  }

  const finalPost = updatedPost || post;
  const formattedDate = formatDate(finalPost.created_at);

  const userId = await getCurrentUserId();
  const isOwner = userId === finalPost?.creator;

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("name,username")
    .eq("id", finalPost?.creator)
    .single();
  if (userError) {
    console.error('Error finding the user:', userError);
  }

  const { data: likeData, error: likeDataError } = await supabase
    .from("user_like_join")
    .select("user_id,post_id")
    .eq("user_id", finalPost?.creator)
    .eq("post_id", finalPost?.id)
    .single();
  if (likeDataError && likeDataError.code !== "PGRST116") {
    console.error("An unexpected error occurred while checking for a like:", likeDataError);
  }
  const hasLiked = !!likeData;

  return (
    <div className="container-custom max-w-4xl">
      <div className="mb-4"><BackButton /></div>
      <Card className="card-hover">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{finalPost.short_desc}</h1>
            {isOwner && (
              <Button asChild size="sm">
                <Link href={`/edit-post/${finalPost.id}`}>Edit</Link>
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            <span>by {user?.username}</span>
            <span>•</span>
            <span>Published on {formattedDate}</span>
            <span>•</span>
            <span>
              {finalPost.num_interested} {finalPost.num_interested === 1 ? 'View' : 'Views'}
            </span>
            <LikeButton postId={finalPost?.id} initialLikes={finalPost?.likes} isLiked={hasLiked} userId={userId} />
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${finalPost.is_public ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              {finalPost.is_public ? 'Public' : 'Private'}
            </span>
          </div>
          <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {finalPost.long_desc}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
