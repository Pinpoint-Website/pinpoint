import { Button } from "@/components/ui/button"
import { Posts } from "@/components/posts";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="heading-1 text-balance">Welcome to Pinpoint</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share your ideas, connect with others, and discover amazing collaborations
        </p>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-2">Latest Posts</h2>
          <Button asChild>
            <Link href="/create-post">Create Post</Link>
          </Button>
        </div>
        <Posts />
      </section>
    </div>
  );
}
