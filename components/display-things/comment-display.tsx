import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format-date";
import CommentLikeButton from "@/components/buttons/comment-like-button";

interface Comment {
  id: string;
  comment_body: string;
  created_at: string;
  creator: string;
  likes: number;
  isLiked: boolean;
  users: {
    username: string;
    name: string;
  } | null;
}

interface CommentDisplayProps {
  comments: Comment[];
  userId: string | undefined;
}

export default function CommentDisplay({ comments, userId }: CommentDisplayProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {comment.users?.username || "Unknown User"}
                </span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-muted-foreground text-xs">
                  {formatDate(comment.created_at)}
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">
              {comment.comment_body}
            </p>
            <div className="flex items-center justify-end">
              <CommentLikeButton
                commentId={comment.id}
                initialLikes={comment.likes}
                isLiked={comment.isLiked}
                userId={userId}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
