"use client"; // This is now a client component

import { useState } from "react";
import { createPost } from "@/lib/actions/create-post"; // Import the server action
import { PostData } from "@/lib/types";

export default function CreatePostForm() {
  const [formData, setFormData] = useState<PostData>({
    shortDesc: "",
    longDesc: "",
    isPublic: false,
    creator: 0,
  });

  // handle any change wether it's a input element or text element
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // this needs to be seperate from the handleChange becuse it uses '.checked'
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({
      ...prev,
      isPublic: e.target.checked,
    })
  );

  // this puts all the data into the database
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload after submit
    await createPost(formData); // this is the server action (this is where the 'creator' id is gotten and written to the db)
    // Clear the data ig (we don't really need to since it's gonna get overwritten but whateva)
    setFormData({ shortDesc: "", longDesc: "", isPublic: false, creator: 0 });
  };

  // create the form
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        name="shortDesc"
        type="text"
        value={formData.shortDesc} // Have the data be what the variable already has (need to make it so that it's what the user already put in there)
        onChange={handleChange}
        placeholder="Type short description here"
      />
      <input
        name="longDesc"
        type="text"
        value={formData.longDesc} // Control the component
        onChange={handleChange}
        placeholder="Type long description here"
      />
      <input
        name="isPublic"
        type="checkbox"
        checked={formData.isPublic} // Control the component
        onChange={handleCheckboxChange}
      />
      <button
        type="submit"
        className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Create Post
      </button>
    </form>
  );
}