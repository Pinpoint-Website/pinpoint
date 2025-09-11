import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { AuthButton } from "../buttons/auth-button";
import { MyPostsButton } from "../buttons/my-posts-button";
import { LogoutButton } from "../buttons/logout-button";
import { LikedPostsButton } from "../buttons/liked-posts-button";
import { CreatePostButton } from "../buttons/create-post-button";
import { MyPersonalPageButton } from "../buttons/personal-page-button";
import { CreatePersonalPageButton } from "../buttons/create-personal-page-button";

export async function NavBar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Get the user's personal page if they have it
  const { data: personalPage } = await supabase.from("personal_page").select("id").eq("id", user?.id).single();

  console.log("Personal page:", personalPage);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight text-lg">Pinpoint</Link>
          <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {personalPage == null ? (
                <MyPersonalPageButton />
              ) : <CreatePersonalPageButton />}
              <CreatePostButton />
              <LikedPostsButton />
              <MyPostsButton />
              <LogoutButton />
            </>
          ) : (
            <AuthButton />
          )}
        </div>
      </div>
    </header>
  );
}
