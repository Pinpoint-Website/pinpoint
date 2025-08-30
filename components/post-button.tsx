import Link from "next/link";
import { Button } from "./ui/button";

export function PostButton() {
  return (
    <div className="flex gap-2">
      <Button asChild size="lg" variant={"outline"}>
        <Link href="/post">Posts</Link>
      </Button>
    </div>
  );
}
