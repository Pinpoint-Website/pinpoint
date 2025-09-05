import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { AuthButton } from "../buttons/auth-button";
import { MyPostsButton } from "../buttons/my-posts-button";
import { LogoutButton } from "../buttons/logout-button";
import { LikedPostsButton } from "../buttons/liked-posts-button";
import { CreatePostButton } from "../buttons/create-post-button";

export async function NavBar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight text-lg">CollabBoard</Link>
          <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
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
