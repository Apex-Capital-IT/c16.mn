"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useAdminList } from "./useAdminList";
import { adminStore, fakeDelay, newId, nowIso } from "./mock-store";

interface NewsFormData {
  title: string;
  content: string;
  newsImage: string;
  category: string;
  authorId?: string;
  authorName: string;
  authorImage: string;
}

interface Author {
  _id: string;
  authorName: string;
  authorImage: string;
}

export default function CreateNews() {
  const {
    items: authors,
    loading: authorsLoading,
    error: authorsError,
    refresh: refreshAuthors,
  } = useAdminList<Author>({ endpoint: "authors", pageSize: 100 });

  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    newsImage: "",
    category: "",
    authorName: "",
    authorImage: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await fakeDelay();
      const cat = adminStore.categories.find(
        (c) => c.categoryName === formData.category || c.slug === formData.category
      );
      const id = newId("n");
      const now = nowIso();
      adminStore.news.unshift({
        _id: id,
        title: formData.title,
        description: formData.content.slice(0, 140),
        content: formData.content,
        category: cat?.slug || formData.category,
        categoryName: cat?.categoryName || formData.category,
        newsImages: formData.newsImage ? [formData.newsImage] : [],
        authorName: formData.authorName,
        authorId: formData.authorId || "",
        authorImage: formData.authorImage,
        banner: false,
        slug: id,
        publishedDate: now,
        createdAt: now,
        updatedAt: now,
        views: 0,
      });

      toast.success("News created successfully!");
      setFormData({
        title: "",
        content: "",
        newsImage: "",
        category: "",
        authorId: "",
        authorName: "",
        authorImage: "",
      });
    } catch (error) {
      toast.error("Failed to create news. Please try again.");
      console.error("Error creating news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mock upload: keep a local preview (data URL) only.
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, newsImage: reader.result as string }));
      toast.success("Зураг сонгогдлоо (local preview)");
    };
    reader.readAsDataURL(file);
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAuthorId = e.target.value;
    const selectedAuthor = authors.find(
      (author) => author._id === selectedAuthorId
    );

    if (selectedAuthor) {
      setFormData((prev) => ({
        ...prev,
        authorId: selectedAuthor._id,
        authorName: selectedAuthor.authorName,
        authorImage: selectedAuthor.authorImage,
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-400 shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-lg font-medium mb-2 text-gray-700"
          >
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter news title"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-lg font-medium mb-2 text-gray-700"
          >
            Content
          </label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="Enter news content"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[200px]"
          />
        </div>

        <div>
          <label
            htmlFor="newsImage"
            className="block text-lg font-medium mb-2 text-gray-700"
          >
            News Image URL
          </label>
          <input
            name="newsImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-lg font-medium mb-2 text-gray-700"
          >
            Category
          </label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Enter news category"
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label
            htmlFor="authorId"
            className="block text-lg font-medium mb-2 text-gray-700"
          >
            Select Author
          </label>
          <select
            id="authorId"
            name="authorId"
            value={formData.authorId || ""}
            onChange={handleAuthorChange}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author._id} value={author._id}>
                {author.authorName}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {isLoading ? "Creating..." : "Create News"}
        </Button>
      </form>
    </div>
  );
}
