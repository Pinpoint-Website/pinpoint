import Link from "next/link";
import { Button } from "../ui/button";

export async function CreatePostButton() {
  return (
    <div className="flex gap-2">
      <Button asChild size="lg" variant={"outline"}>
        <Link href={`/create-post`}>Create Post</Link>
      </Button>
    </div>
  );
}
