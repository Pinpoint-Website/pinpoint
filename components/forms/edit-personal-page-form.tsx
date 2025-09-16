"use client"

import { PersonalPageData } from "@/lib/types"
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getPersonalPageData } from "@/lib/get-personal-page";
import { updateProfile } from "@/lib/actions/update-profile";

export default function EditPersonalPageForm(params: { id: string }) {
  // State for text inputs
  const [formData, setFormData] = useState<PersonalPageData>({
    primaryRole: "",
    description: ""
  });

  // track the state of the async data
  const [existingData, setExistingData] = useState<PersonalPageData | null>(null);

  // Set the form to already house the existing data.
  useEffect(() => {
    // first we declare the function
    async function getData() {
      const data = await getPersonalPageData({ userId: params.id });
      setExistingData(data);
      setFormData({
        primaryRole: data.primaryRole,
        description: data.description
      });
    }

    // then we run it in useEffect
    getData();
  }, [params.id]);

  // State for the selected file
  const [file, setFile] = useState<File | null>(null);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Create FormData object
    const dataToSend = new FormData();
    dataToSend.append("primaryRole", formData.primaryRole);
    dataToSend.append("description", formData.description);
    if (file) {
      dataToSend.append("profilePhoto", file); // Use a consistent key name like "profilePhoto"
    }

    // 2. Call the server action with FormData
    // We assume createPersonalPage will handle success/error redirection or messaging.
    try {
      await updateProfile(params.id, dataToSend);
      // Reset form on success if needed
      setFormData({ primaryRole: "", description: "" });
      setFile(null);
      // Clear file input visually (optional)
      const fileInput = e.target.elements.namedItem("profilePhoto") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error) {
      console.error("Failed to update page:", error);
      return (<div>Failed to update personal page</div>)
    }
  };

  return existingData ? (
    <Card className="max-w-2xl mx-auto p-4 space-y-4"> {/* Added padding and spacing */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4"> {/* Made form flex column */}
        <Input
          id="primaryRole"
          name="primaryRole"
          type="text"
          value={formData.primaryRole}
          onChange={handleTextChange}
          placeholder="Ex: Web Developer"
          required
        />
        <Input
          id="description"
          name="description"
          type="text"
          value={formData.description}
          onChange={handleTextChange}
          placeholder="Ex: I've done many cool things"
          required
        />
        <div>
          <label htmlFor="profilePhoto" className="block text-sm font-medium mb-1">
            Profile Photo (Optional)
          </label>
          <Input
            id="profilePhoto"
            name="profilePhoto" // Name attribute for form element access
            type="file"
            accept="image/png, image/jpeg" // Restrict file types
            onChange={handleFileChange}
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  ) : (
    <div>Loading...</div>
  );
}
