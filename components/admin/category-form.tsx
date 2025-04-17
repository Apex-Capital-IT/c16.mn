"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CircleDashed, Save } from "lucide-react";

export function AuthorForm({ category = null }: { category?: any }) {
  const [name, setName] = useState(category?.name || "");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("authorName", name);
      if (file) {
        formData.append("authorImage", file);
      }

      const res = await fetch("https://c16-mn.onrender.com/api/create/author", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Author үүсгэхэд алдаа гарлаа");
      }

      alert("Нийтлэгчийг амжилттай үүсгэлээ!");
      setName("");
      setFile(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Нийтлэгчийн Нэр</Label>
          <Input
            id="name"
            placeholder="Нийтлэгчийн Нэр"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Зураг сонгох</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <Button type="submit" className="gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CircleDashed className="h-4 w-4 animate-spin" />
              Хадгалж байна...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Нэрийг хадгалах
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
