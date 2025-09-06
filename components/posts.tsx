import { PostDisplay } from "./display-things/post-display";
import { getFypPostIds } from "@/lib/post-utils"; 

// This must be an async Server Component
export async function Posts() {
    // Await the promise from your new helper function
    const postIds = await getFypPostIds();

    // Check if postIds is actually an array before trying to map it
    if (!Array.isArray(postIds) || postIds.length === 0) {
      return <p>No posts to display.</p>
    }

    return (
        <div className="flex flex-col gap-4">
            {postIds.map((id) => (
                // Now you can be certain that 'id' is a number
                <PostDisplay key={id} postId={id} />
            ))}
        </div>
    );
}