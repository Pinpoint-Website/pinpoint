import { getCurrentUserId } from "@/lib/get-user";
import { Button } from "../ui/button";
import Link from "next/link";

export async function MyPersonalPageButton() {
  const userId = await getCurrentUserId();
  return (
    <div className="flex gap-2">
      <Button asChild size="lg" variant={"outline"}>
        <Link href={`/personal-page/${userId}`}>Personal Page</Link>
      </Button>
    </div>
  )
}
