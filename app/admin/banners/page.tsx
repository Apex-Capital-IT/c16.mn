"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const Banner = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Зураг оруулаагүй байна");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title);

      const response = await fetch("/api/banners", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create banner");
      }

      toast.success("Баннер амжилттай үүслээ");
      router.refresh();
      // Reset form
      setTitle("");
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error creating banner:", error);
      toast.error("Баннер үүсгэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Баннер үүсгэх</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Гарчиг
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Баннерын гарчиг"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Зураг
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">Зураг оруулах</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Үүсгэж байна..." : "Үүсгэх"}
          </Button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            Урьдчилан харах
          </h2>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col gap-4">
            {title && (
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {title}
              </h3>
            )}
            {imagePreview ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Banner preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Зураг оруулаагүй</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
