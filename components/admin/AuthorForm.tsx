"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AuthorForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    authorName: "",
    authorImage: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Зөвхөн зураг файл оруулах боломжтой");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Зургийн хэмжээ 5MB-аас бага байх ёстой");
        return;
      }
      
      setFormData({ ...formData, authorImage: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data
      if (!formData.authorName.trim()) {
        toast.error("Зохиолчийн нэр оруулна уу");
        setLoading(false);
        return;
      }

      if (!formData.authorImage) {
        toast.error("Зохиолчийн зураг оруулна уу");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("authorName", formData.authorName.trim());
      formDataToSend.append("authorImage", formData.authorImage);

      console.log("Sending form data:", {
        authorName: formData.authorName,
        imageFile: formData.authorImage.name,
        imageType: formData.authorImage.type,
        imageSize: formData.authorImage.size,
      });

      const response = await fetch("/api/authors", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Зохиолч үүсгэхэд алдаа гарлаа");
      }

      toast.success("Зохиолч амжилттай үүслээ");
      if (onSuccess) {
        onSuccess();
      }
      router.refresh();
      router.push("/admin/authors");
    } catch (error) {
      console.error("Error creating author:", error);
      toast.error(error instanceof Error ? error.message : "Зохиолч үүсгэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="authorName">Зохиолчийн нэр</Label>
        <Input
          id="authorName"
          value={formData.authorName}
          onChange={(e) =>
            setFormData({ ...formData, authorName: e.target.value })
          }
          required
          placeholder="Зохиолчийн нэрийг оруулна уу"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="authorImage">Зохиолчийн зураг</Label>
        <Input
          id="authorImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        {previewImage && (
          <div className="mt-2">
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Үүсгэж байна..." : "Үүсгэх"}
      </Button>
    </form>
  );
} 