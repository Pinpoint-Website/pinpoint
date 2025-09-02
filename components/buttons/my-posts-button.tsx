import Link from "next/link";
import { Button } from "../ui/button";

export function MyPostsButton() {
  return (
    <div className="flex gap-2">
      <Button asChild size="lg" variant={"outline"}>
        <Link href="/my-posts">My Posts</Link>
      </Button>
    </div>
  );
}
