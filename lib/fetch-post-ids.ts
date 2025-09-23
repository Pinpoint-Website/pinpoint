"use server"

import { createClient } from "./supabase/server";

export async function fetchPostIds(page: number) {
  const supabase = await createClient();
  const pageIndex = Math.max(page - 1, 0);
  const rangeStart = pageIndex * 10;
  const rangeEnd = rangeStart + 9;
  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(rangeStart, rangeEnd);
  if (error) {
    console.error("Couldn't find any posts on this page");
    return [];
  }
  return Array.isArray(data) ? data.map((post) => post?.id) : [];
}
