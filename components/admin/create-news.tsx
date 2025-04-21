"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://c16-mn.onrender.com";
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  name: string;
  image: string;
}

export default function CreateNews() {
  const [formData, setFormData] = useState<NewsFormData>({
    title: "",
    content: "",
    newsImage: "",
    category: "",
    authorName: "",
    authorImage: "",
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axiosInstance.get<Author[]>("/api/authors");
        setAuthors(response.data);
      } catch (error) {
        toast.error("Failed to fetch authors");
        console.error("Error fetching authors:", error);
      }
    };

    fetchAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/create/news", formData);

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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "default_preset"); // Таны жинхэнэ upload_preset-г энд бичнэ үү

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dw0kyzkwp/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setFormData((prev) => ({
          ...prev,
          newsImage: data.secure_url,
        }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Cloudinary upload failed.");
      }
    } catch (err) {
      toast.error("Image upload failed.");
      console.error("Upload error:", err);
    }
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
        authorName: selectedAuthor.name,
        authorImage: selectedAuthor.image,
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
            {/* {authors.map((author) => (
              <option key={author._id} value={author._id}>
                {author.authorName}
              </option>
            ))} */}
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
