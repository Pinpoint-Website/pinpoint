"use server"

import { createClient } from "../supabase/server"

export async function hasProfile(userId: string | undefined) {
    const supabase = await createClient();

    // try and get a post and if one doesn't exist then return false
    const { error } = await (await supabase).from("personal_page").select("id").eq("id", userId);

    // if it returns an error then the user doesn't have a personal page yet 
    if (error) {
        return false;
    } else {
        return true;
    }
}