"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { CircleDashed, Save } from "lucide-react";

export function CategoryForm({ category = null }: { category?: any }) {
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [color, setColor] = useState(category?.color || "#3b82f6"); // Default blue
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(
      newName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // In a real app, you would redirect to the categories list after successful creation
      alert("Category saved successfully!");
    }, 1000);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name</Label>
          <Input
            id="name"
            placeholder="e.g. Technology"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            placeholder="e.g. technology"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            The slug is used in the URL: /category/
            <strong>{slug || "example"}</strong>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <div
              className="w-10 h-10 rounded-full border"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-mono">{color}</span>
          </div>
        </div>

        <Button type="submit" className="gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <CircleDashed className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Category
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
