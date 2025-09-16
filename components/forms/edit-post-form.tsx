"use client";

import { useState } from "react";
import { PostData, PostDataAndId } from "@/lib/types";
import { updatePost } from "@/lib/actions/update-post";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DeletePostButton } from "../buttons/delete-post-button";

export default function EditPostForm({ shortDesc, longDesc, isPublic, id, creator }: PostDataAndId) {
  const [formData, setFormData] = useState<PostData>({
    shortDesc,
    longDesc,
    isPublic,
    creator,
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
    await updatePost(id, formData);
    const { shortDesc: s, longDesc: l, isPublic: p, creator: c } = formData;
    setFormData({ shortDesc: s, longDesc: l, isPublic: p, creator: c });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="contents">
        <CardHeader>
          <CardTitle>Edit post</CardTitle>
          <CardDescription>Update the details of your post.</CardDescription>
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
              placeholder="A concise summary"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="longDesc">Details</Label>
            <Textarea
              id="longDesc"
              name="longDesc"
              value={formData.longDesc}
              onChange={handleChange}
              placeholder="Add or revise details..."
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
          <Button type="submit">Save Changes</Button>
          <DeletePostButton postId={id} />
        </CardFooter>
      </form>
    </Card>
  );
}
