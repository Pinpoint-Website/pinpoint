import EditPostForm from "@/components/forms/edit-post-form";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";

interface EditPostPage {
  params: {
    id: string
  }
}

export default async function EditPost({ params }: EditPostPage) {
  const supabase = await createClient();
  // get the post based on it's id (the id is converted from a string to a number so that's why there's 'Number(params.id)' right there)
  // the '(await params)' thing is because of a next.js thing
  const postId = (await params).id;
  const { data: post, error } = await supabase.from('posts').select('short_desc,long_desc,num_interested,is_public,creator').eq('id', postId).single();

  // we need to check if the creator is the same as the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  const hasEditAccess = (user?.id == post?.creator);

  // throw 404 error if that query throw's an error or if the user id doesn't match the creator id
  if (error || !post || !hasEditAccess) {
    notFound();
  }

  // Handle case where error occurs
  // typescript really want's to make sure that user exists so you actually need this or there'll be a red squiggly line when you access anything within 'user'
  if (userError || !user) {
    console.error("User not authenticated:", userError);
    return redirect("/auth/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Edit Post</h1>
        <p className="text-muted-foreground">Update your post details below.</p>
      </div>
      <EditPostForm
        shortDesc={post?.short_desc}
        longDesc={post?.long_desc}
        isPublic={post?.is_public}
        creator={post.creator}
        id={postId}
      />
    </div>
  );
}
