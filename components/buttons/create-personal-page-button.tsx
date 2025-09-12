import Link from "next/link";
import { Button } from "../ui/button";

export async function CreatePersonalPageButton() {
  return (
    <div className="flex gap-2">
      <Button asChild size="lg" variant={"outline"}>
        <Link href={`/personal-page/new`}>Create Personal Page</Link>
      </Button>
    </div>
  );
}
