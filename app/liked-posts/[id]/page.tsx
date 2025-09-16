import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';
import { formatDate } from "@/lib/format-date";
import Link from "next/link";
import { NavBarForMyPosts } from "@/components/navigation/nav-bar-my-posts";

interface LikedPostsPageParams {
  params: Promise<{
    id: string
  }>
}

export default async function MyPosts({ params } : LikedPostsPageParams) {
  const supabase = await createClient();
  const userId = (await params).id;

  const { data: postsData, error } = await supabase
    .from("user_like_join")
    .select("post_id")
    .eq("user_id", userId);

  if (error) {
    notFound();
  }

  const postIds = postsData.map(entry => entry.post_id);

  const { data: likedPosts, error: likedPostsError } = await supabase.from("posts").select().in("id", postIds);

  if (likedPostsError) {
    console.error("Error fetching liked posts:", likedPostsError);
    return;
  }

  if (likedPosts.length === 0) {
    return (
      <div className="container-custom py-8">
        <NavBarForMyPosts />
        <div className="text-center p-8">
          <p>No posts found for this user.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="heading-2 mb-6">Liked Posts</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {likedPosts.map((post) => (
          <li key={post.id}>
            <Link href={`/post/${post.id}`} className="block">
              <div className="rounded-xl border bg-card p-4 shadow-sm card-hover">
                <h2 className="font-semibold mb-1">{post.short_desc}</h2>
                <p className="text-xs text-muted-foreground mb-2">Created: {formatDate(post.created_at)}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.is_public ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                  {post.is_public ? 'Public' : 'Private'}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
