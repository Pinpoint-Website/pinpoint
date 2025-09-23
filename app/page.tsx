import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Posts } from "@/components/posts";
import { fetchPostIds } from "@/lib/fetch-post-ids";

export default async function Home(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const pageNum = Number(await searchParams?.page) || 1; // if they don't give a page in the url default to page 1

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
        <Posts page={pageNum} fetchPostIdsAction={fetchPostIds} />
      </section>
      <div className="flex justify-center gap-4 mt-8">
        <Button asChild disabled={pageNum <= 1}>
          <Link href={`/?page=${pageNum - 1}`}>Back</Link>
        </Button>
        <Button asChild>
          <Link href={`/?page=${pageNum + 1}`}>Forward</Link>
        </Button>
      </div>
    </div>
  );
}
