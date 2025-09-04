import Link from "next/link";
import { Button } from "../ui/button";
import { getCurrentUserId } from "@/lib/get-user";

export async function LikedPostsButton() {
  const userId = await getCurrentUserId();

  return (
    <div className="flex gap-2">
      <Button asChild size="lg" variant={"outline"}>
        <Link href={`/liked-posts/${userId}`}>Liked Posts</Link>
      </Button>
    </div>
  );
}