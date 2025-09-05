import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { AuthButton } from "../buttons/auth-button";
import { LogoutButton } from "../buttons/logout-button";
import BackButton from "../buttons/back-button";

export async function NavBarForMyPosts() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <Link href="/" className="font-semibold tracking-tight text-lg">CollabBoard</Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? <LogoutButton /> : <AuthButton />}
        </div>
      </div>
    </header>
  );
}
