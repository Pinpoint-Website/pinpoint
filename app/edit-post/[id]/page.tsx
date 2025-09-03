import EditPostForm from "@/components/forms/edit-post-form";

import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface EditPostPage {
    params: {
        id: string
    }
}

export default async function EditPost({ params } : EditPostPage) {
    const supabase = await createClient();
    // get the post based on it's id (the id is converted from a string to a number so that's why there's 'Number(params.id)' right there)
    // the '(await params)' thing is because of a next.js thing
    const postId = Number((await params).id);
    const { data: post, error } = await supabase.from('posts').select('short_desc,long_desc,num_interested,is_public').eq('id', postId).single();

    // throw 404 error if that query throw's an error
    if (error || !post) {
        notFound();
    }

    return (
        <EditPostForm 
            shortDesc={ post?.short_desc } 
            longDesc={ post?.long_desc } 
            isPublic={ post?.is_public } 
            creator={0} 
            id={ postId }
        />
    );
}