"use server"

import { createClient } from "../supabase/server"

export async function hasProfile(userId: string | undefined) {
    const supabase = await createClient();

    // try and get a post and if one doesn't exist then return false
    // what's interesting is if you leave off the .single() part it won't return an error or null in the data if it can't find it, it only does that if you use .single()
    const { error } = await (await supabase).from("personal_page").select("id").eq("id", userId).single();

    // if it returns an error then the user doesn't have a personal page yet 
    if (error) {
        return false;
    } else {
        return true;
    }
}