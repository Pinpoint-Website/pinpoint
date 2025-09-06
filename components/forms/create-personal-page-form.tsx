"use client"

import { PersonalPageData } from "@/lib/types"
import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { createPersonalPage } from "@/lib/actions/create-personal-page";
import { Button } from "../ui/button";

export default function CreatePersonalPage() {
    const [formData, setFormData] = useState<PersonalPageData>({
        primaryRole: "",
        description: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent page reload
        await createPersonalPage(formData); // todo make this a thing
        const { primaryRole: p, description: d} = formData;
        setFormData({ primaryRole: p, description: d});
    };

    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="contents">
                <Input 
                    id="primaryRole"
                    name="primaryRole"
                    type="text"
                    value={formData.primaryRole}
                    onChange={handleTextChange}
                    placeholder="Ex: Web Developer"
                />
                <Input 
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleTextChange}
                    placeholder="Ex: I've done many cool things"
                />
                <Button type="submit">Create Profile</Button>
            </form>
        </Card>
    );
}