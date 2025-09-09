"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/lib/actions/create-comment";

interface CommentFormProps {
  postId: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createComment(postId, comment);
      
      if (result.success) {
        setComment("");
      } else {
        setError(result.error || "Failed to create comment");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="min-h-[100px] resize-none"
          disabled={isSubmitting}
        />
        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting || !comment.trim()}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
