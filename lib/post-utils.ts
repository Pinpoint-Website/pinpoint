import { createClient } from "./supabase/server";

// This will get the most recent posts, and show them
export async function getFypPostIds(): Promise<string[]> {
  const supabase = await createClient();

  // Get the most recent posts
  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .eq('is_public', true) // Only show public posts on the FYP
    .order('created_at', { ascending: false })
    .limit(20);

  // Basic error handling
  if (error) {
    console.error("Error fetching post IDs:", error);
    return [];
  }

  // The query returns an array of objects like [{id: '...'}],
  // so we map it to return an array of strings ['...'] to match the return type.
  return data ? data.map(post => post.id) : [];
  
}