"use client";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export function CreatePostButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex gap-2">
      <Button asChild size="lg" variant={"outline"}>
        <Link href="/create-post" onClick={handleClick}>Create Post</Link>
      </Button>
    </div>
  );
}
