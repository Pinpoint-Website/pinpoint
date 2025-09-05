import CreatePostForm from "@/components/forms/create-post-form";

export default function CreatePostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-1">Create a New Post</h1>
        <p className="text-muted-foreground">Share a challenge or opportunity with the community.</p>
      </div>
      <CreatePostForm />
    </div>
  );
}
