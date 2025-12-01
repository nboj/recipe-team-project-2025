"use client";
import { stackClientApp } from "@/stack/client";
import { Button, Input, NumberInput, Textarea } from "@heroui/react";
import { useState } from "react";

export default function CreateRecipePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const title = data.get("title");
    const description = data.get("description");
    const cook_time = data.get("cook_time");
    console.log(title, description, cook_time)
    if (imageFile) data.append("image", imageFile);
    const user = await stackClientApp.getUser()
    if (!user) {
      setMessage("Unauthenticated. Please sign back in.")
      return
    }

    const { accessToken } = await user.getAuthJson();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/recipes/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          cook_time: cook_time,
          image: imageFile,
          steps: [],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setMessage(`✅ Created recipe #${json.id}`);
      } else {
        const err = await res.json();
        setMessage(`❌ Error: ${err.detail || "unknown"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("⚠️ Network error");
    }
  };

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Recipe</h1>
      <form onSubmit={handleSubmit} className="grid gap-4" encType="multipart/form-data">

        <Input name="title" type="text" label="Title" labelPlacement="outside" placeholder="The title for your recipe"/>
        <Textarea name="description" label="Description" labelPlacement="outside" placeholder="Tell us about your recipe..."/>
        <NumberInput name="cook_time" label="Cook Time" labelPlacement="outside" placeholder="tsime"/>

        <div>
          <label className="block font-semibold mb-1">Image:</label>
          <input type="file" name="image" onChange={handleFileChange} className="w-full border rounded p-2" />
        </div>

        <Button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Recipe
        </Button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
