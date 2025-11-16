"use client";
import { useState } from "react";

export default function CreateRecipePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    prep_time: "",
    cook_time: "",
    servings: "",
    cooking_method: "",
    my_rating: "",
    comments: "",
    rated_date: "",
    created_date: "",
    updated_date: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (imageFile) data.append("image", imageFile);

    try {
      const res = await fetch("/api/recipes/", {
        method: "POST",
        body: data,
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
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block font-semibold mb-1 capitalize">{key.replace("_", " ")}:</label>
            {key === "description" || key === "instructions" || key === "comments" ? (
              <textarea
                name={key}
                value={(formData as any)[key]}
                onChange={handleChange}
                className="w-full border rounded p-2"
                rows={3}
              />
            ) : (
              <input
                name={key}
                value={(formData as any)[key]}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            )}
          </div>
        ))}

        {/* 🖼️ Image upload */}
        <div>
          <label className="block font-semibold mb-1">Image:</label>
          <input type="file" name="image" onChange={handleFileChange} className="w-full border rounded p-2" />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Create Recipe
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
