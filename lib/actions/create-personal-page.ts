"use server"

import { notFound, redirect } from "next/navigation";
import { createClient } from "../supabase/server"
import { PersonalPageData } from "../types";
import { getCurrentUserId } from "../get-user";

export async function createPersonalPage({primaryRole, description}: PersonalPageData) {
    const supabase = createClient();
    const userId = await getCurrentUserId();

    // put the data into the server
    const { error } = await (await supabase).from("personal_page").insert({
        id: userId,
        description: description,
        primary_role: primaryRole
    });

    if (error) {
        console.error("Failed to put the data into the db:", error);
        notFound();
    }

    // redirect to their new page
    redirect(`/personal-page/${userId}`)
}