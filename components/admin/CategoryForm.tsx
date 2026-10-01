"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { adminStore, fakeDelay, newId, nowIso, slugify } from "./mock-store";

interface CategoryFormProps {
  onSuccess?: () => void;
}

export default function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!categoryName.trim()) {
        toast.error("Ангилалын нэр оруулна уу");
        setLoading(false);
        return;
      }

      await fakeDelay();
      const name = categoryName.trim();
      if (adminStore.categories.some((c) => c.categoryName === name)) {
        throw new Error("Ийм нэртэй ангилал аль хэдийн байна");
      }
      const now = nowIso();
      adminStore.categories.push({
        _id: newId("c"),
        categoryName: name,
        slug: slugify(name),
        createdAt: now,
        updatedAt: now,
      });

      toast.success("Ангилал амжилттай үүслээ");
      setCategoryName("");
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error instanceof Error ? error.message : "Ангилал үүсгэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="categoryName">Ангилалын нэр</Label>
        <Input
          id="categoryName"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
          placeholder="Ангилалын нэрийг оруулна уу"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Үүсгэж байна..." : "Үүсгэх"}
      </Button>
    </form>
  );
} 