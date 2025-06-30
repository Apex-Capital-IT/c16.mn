"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdminList } from "./useAdminList";

interface CategoryFormProps {
  onSuccess?: () => void;
}

export default function CategoryForm({ onSuccess }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const { refresh } = useAdminList({ endpoint: "/api/categories", dataKey: "categories", pageSize: 100 });

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

      const response = await fetch("/api/create/categories", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + (typeof window !== "undefined" ? localStorage.getItem("admin_auth") || "" : ""),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName: categoryName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ангилал үүсгэхэд алдаа гарлаа");
      }

      toast.success("Ангилал амжилттай үүслээ");
      router.refresh();
      setCategoryName("");
      refresh();
      
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