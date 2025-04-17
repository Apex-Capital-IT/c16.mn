"use client";

import type React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/admi/dashboard-header";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
  image: string;
}

export default function CreatePostPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    authorName: "",
    banner: false,
  });

  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [newsImages, setNewsImages] = useState<File[]>([]);
  const [previewAuthorImage, setPreviewAuthorImage] = useState<string | null>(
    null
  );
  const [previewNewsImages, setPreviewNewsImages] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories and authors from the API
        const [categoriesRes, authorsRes] = await Promise.all([
          axios.get<{ categories: any[] }>("/api/categories"),
          axios.get<{ authors: any[] }>("/api/authors"),
        ]);

        // Process categories data
        const categoriesData = categoriesRes.data.categories || [];
        setCategories(
          categoriesData.map((cat: any) => ({
            id: cat._id,
            name: cat.categoryName,
          }))
        );

        // Process authors data
        const authorsData = authorsRes.data.authors || [];
        setAuthors(
          authorsData.map((author: any) => ({
            id: author._id,
            name: author.authorName,
            image: author.authorImage,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });

        // For demo purposes, set some sample data
        setCategories([
          { id: "1", name: "Development" },
          { id: "2", name: "React" },
          { id: "3", name: "Technology" },
        ]);

        setAuthors([
          {
            id: "1",
            name: "John Doe",
            image: "https://via.placeholder.com/150",
          },
          {
            id: "2",
            name: "Jane Smith",
            image: "https://via.placeholder.com/150",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, banner: checked }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If author is selected, update the author name
    if (name === "authorName") {
      setSelectedAuthor(value);
      const author = authors.find((a) => a.name === value);
      if (author) {
        setPreviewAuthorImage(author.image);
      }
    }
  };

  const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAuthorImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAuthorImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewsImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      console.log("News images selected:", files.length);
      console.log(
        "News images details:",
        files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
      );

      setNewsImages((prev) => [...prev, ...files]);

      // Create preview URLs
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewNewsImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewsImage = (index: number) => {
    setNewsImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewNewsImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newsImages.length === 0) {
      toast({
        title: "Error",
        description: "At least one news image is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("authorName", formData.authorName);
      formDataToSend.append("banner", formData.banner.toString());

      // Append news images - try a different approach
      console.log("Appending news images to FormData:", newsImages.length);

      // Clear any existing newsImages entries
      for (let i = 0; i < newsImages.length; i++) {
        formDataToSend.append("newsImages", newsImages[i]);
      }

      console.log("Submitting form data:", {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        authorName: formData.authorName,
        banner: formData.banner,
        newsImagesCount: newsImages.length,
      });

      // Send to API
      const response = await axios.post("/api/news", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response from API:", response.data);

      toast({
        title: "Success",
        description: "News post created successfully",
      });

      // Redirect to posts list
      router.push("/admin/posts");
    } catch (error: any) {
      console.error("Error creating news post:", error);

      // Log more detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }

      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to create news post",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Create News Post"
        description="Create a new news article"
        action={
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Publishing..." : "Publish"}
          </Button>
        }
      />

      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter news title"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your news content here..."
                    rows={10}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="authorName">Author</Label>
                  <Select
                    value={formData.authorName}
                    onValueChange={(value) =>
                      handleSelectChange("authorName", value)
                    }
                  >
                    <SelectTrigger id="authorName">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((author) => (
                        <SelectItem key={author.id} value={author.name}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAuthor && previewAuthorImage && (
                  <div className="flex items-center gap-2">
                    <img
                      src={previewAuthorImage}
                      alt="Selected author"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{selectedAuthor}</span>
                  </div>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="newsImages">News Images</Label>
                  <Input
                    id="newsImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewsImagesChange}
                    required
                  />
                  {previewNewsImages.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {previewNewsImages.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`News image ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewsImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="banner"
                    checked={formData.banner}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="banner">Set as banner news</Label>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">
                  {formData.title || "Untitled"}
                </h1>

                {previewAuthorImage && (
                  <div className="flex items-center gap-2">
                    <img
                      src={previewAuthorImage}
                      alt="Author"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium">
                      {formData.authorName || "Unknown Author"}
                    </span>
                  </div>
                )}

                {previewNewsImages.length > 0 && (
                  <div className="grid grid-cols-1 gap-4">
                    {previewNewsImages.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`News image ${index + 1}`}
                        className="w-full h-64 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                <div className="prose max-w-none">
                  <p>{formData.content || "No content yet"}</p>
                </div>

                {formData.category && (
                  <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {formData.category}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
