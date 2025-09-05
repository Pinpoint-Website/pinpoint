"use client";

import { useState } from "react";
import { createPost } from "@/lib/actions/create-post";
import { PostData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePostForm() {
  const [formData, setFormData] = useState<PostData>({
    shortDesc: "",
    longDesc: "",
    isPublic: false,
    creator: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPost(formData);
    setFormData({ shortDesc: "", longDesc: "", isPublic: false, creator: 0 });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="contents">
        <CardHeader>
          <CardTitle>Create post</CardTitle>
          <CardDescription>Fill in the details for your new post.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="shortDesc">Short description</Label>
            <Input
              id="shortDesc"
              name="shortDesc"
              type="text"
              value={formData.shortDesc}
              onChange={handleChange}
              placeholder="e.g. Looking to collaborate on a Next.js app"
            />
            <p className="text-xs text-muted-foreground">A concise summary of your post.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="longDesc">Details</Label>
            <Textarea
              id="longDesc"
              name="longDesc"
              value={formData.longDesc}
              onChange={handleChange}
              placeholder="Share more context, goals, and any relevant info..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isPublic: checked === true }))
              }
            />
            <Label htmlFor="isPublic">Make this post public</Label>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit">Create Post</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
