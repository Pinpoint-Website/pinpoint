// THIS IS A SERVER COMPONENT. If we want interactible things through this component we'll need to make it a client component.
import { createClient } from "@/utils/supabase/server";
import { AuthButton } from "../buttons/auth-button";
import { MyPostsButton } from "../buttons/my-posts-button";
import { LogoutButton } from "../buttons/logout-button";
import { LikedPostsButton } from "../buttons/liked-posts-button";

// This assumes that it's put as the immedate child of the parent element of the whole page.
export async function NavBar() {

    // see who the user is and if they're even signed in
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();

    // this is really cool it checks if data is null before accessing .claims so it doesn't crash
    const user = data?.claims; 

    // Change what's on the navbar depending on if they're signed in or not
    // Show the post and logout button when they're signed in 
    // Show the authentication buttons when they're not signed in
    return user ? (
        <div className="w-full flex justify-end p-4">
            <div className="mx-4">
                <LikedPostsButton />
            </div>
            <div className="mx-4">
                <MyPostsButton />
            </div>
            <div className="mx-4">
                <LogoutButton />
            </div>
        </div> 
    ) : (
        <div className="w-full flex justify-end p-4">
            <div className="mx-2">
                <AuthButton />
            </div>
        </div> 
    );  
}
