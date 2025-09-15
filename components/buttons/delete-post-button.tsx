'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";

interface DeletePostButtonProps {
  postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", postId);
    if (deleteError) {
      setError("Failed to delete post.");
      setLoading(false);
      return;
    }
    router.push("/");
  }

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="destructive"
        style={{ backgroundColor: "#dc2626", color: "#fff" }}
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Post"}
      </Button>
      {error && <span className="text-red-500 ml-2">{error}</span>}
    </div>
  );
}
