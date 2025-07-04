"use client";

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
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
  error?: string;
}

interface Category {
  _id: string;
  categoryName: string;
}

interface Author {
  _id: string;
  authorName: string;
  authorImage: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  banner: boolean;
  newsImages: string[];
}

interface CategoryOption {
  id: string;
  name: string;
}

interface AuthorOption {
  id: string;
  name: string;
  image: string;
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [postId, setPostId] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    authorName: "",
    banner: false,
  });

  const [authorImage, setAuthorImage] = useState<File | null>(null);
  const [newsImages, setNewsImages] = useState<File[]>([]);
  const [previewNewsImages, setPreviewNewsImages] = useState<string[]>([]);
  const [existingNewsImages, setExistingNewsImages] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [existingAuthorImage, setExistingAuthorImage] = useState<string>("");

  useEffect(() => {
    const initializeData = async () => {
      try {
        const resolvedParams = await params;
        setPostId(resolvedParams.id);
      } catch (error) {
        console.error("Error resolving params:", error);
        toast({
          title: "Error",
          description: "Failed to load page data",
          variant: "destructive",
        });
      }
    };

    initializeData();
  }, [params, toast]);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;

      try {
        setLoading(true);

        // Fetch post data, categories and authors using axios with relative URLs
        const [postRes, categoriesRes, authorsRes] = await Promise.all([
          axios.get<Post>(`/api/news/${postId}`, {
            headers: {
              "Authorization": "Basic " + (typeof window !== "undefined" ? localStorage.getItem("admin_auth") || "" : ""),
              "Content-Type": "application/json",
            },
          }),
          axios.get<{ categories: Category[] }>("/api/categories", {
            headers: {
              "Authorization": "Basic " + (typeof window !== "undefined" ? localStorage.getItem("admin_auth") || "" : ""),
              "Content-Type": "application/json",
            },
          }),
          axios.get<{ data: Author[] }>("/api/authors", {
            headers: {
              "Authorization": "Basic " + (typeof window !== "undefined" ? localStorage.getItem("admin_auth") || "" : ""),
              "Content-Type": "application/json",
            },
          }),
        ]);

        // Set post data
        const post = postRes.data;
        if (!post) {
          throw new Error("Post not found");
        }

        setFormData({
          title: post.title,
          content: post.content,
          category: post.category,
          authorName: post.authorName,
          banner: post.banner,
        });

        // Filter and validate existing images
        const validImages = (post.newsImages || []).filter(
          (url) =>
            url &&
            typeof url === "string" &&
            (url.startsWith("https://res.cloudinary.com") ||
              url.startsWith("http://res.cloudinary.com"))
        );

        setExistingNewsImages(validImages);

        // Process categories data
        const categoriesData = categoriesRes.data.categories || [];
        setCategories(
          categoriesData.map((cat) => ({
            id: cat._id,
            name: cat.categoryName,
          }))
        );

        // Process authors data
        const authorsData = authorsRes.data.data || [];
        setAuthors(
          authorsData.map((author) => ({
            id: author._id,
            name: author.authorName,
            image: author.authorImage,
          }))
        );

        const author = authorsData.find(
          (a) => a.authorName === post.authorName
        );
        if (author) {
          setSelectedAuthor(author.authorName);
          setExistingAuthorImage(author.authorImage);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, toast]);

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

    if (name === "authorName") {
      setSelectedAuthor(value);
    }
  };

  const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAuthorImage(file);
    }
  };

  const handleNewsImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // console.log("News images selected:", files.length);
      // console.log(
      //   "News images details:",
      //   files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
      // );

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

  const removeExistingNewsImage = (index: number) => {
    setExistingNewsImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.authorName
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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

      // Handle existing author image
      if (existingAuthorImage) {
        formDataToSend.append("existingAuthorImage", existingAuthorImage);
      }

      // Handle author image upload
      if (authorImage) {
        formDataToSend.append("authorImage", authorImage);
      }

      // Handle existing images - only include valid Cloudinary URLs
      if (existingNewsImages.length > 0) {
        const validExistingImages = existingNewsImages.filter(
          (url) =>
            url &&
            typeof url === "string" &&
            (url.startsWith("https://res.cloudinary.com") ||
              url.startsWith("http://res.cloudinary.com"))
        );
        if (validExistingImages.length > 0) {
          formDataToSend.append(
            "existingImages",
            JSON.stringify(validExistingImages)
          );
        }
      } else {
        // If no images are selected, send empty array to delete all images
        formDataToSend.append("existingImages", JSON.stringify([]));
      }

      // Debug: Log newsImages before appending
      console.log("newsImages to upload:", newsImages);

      // Append news images
      newsImages.forEach((file) => {
        console.log("Appending file to FormData:", file);
        formDataToSend.append("newsImages", file);
      });

      // Debug: Log FormData keys and values
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0]+ ':', pair[1]);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.put<ApiResponse<Post>>(
        `${apiUrl}/api/news/${postId}`,
        formDataToSend,
        {
          headers: {
            "Authorization": "Basic " + (typeof window !== "undefined" ? localStorage.getItem("admin_auth") || "" : ""),
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.status === "success") {
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
        router.push("/admin/posts");
      } else {
        throw new Error(response.data.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update post",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Edit Post"
        description="Edit existing news post"
        action={
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save Changes"}
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
                    placeholder="Enter post title"
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
                    placeholder="Write your content here..."
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
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
                    onValueChange={(value) => handleSelectChange("authorName", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an author" />
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="banner"
                    checked={formData.banner}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="banner">Set as banner post</Label>
                </div>

                {/* <div className="grid gap-3">
                  <Label htmlFor="authorImage">Author Image</Label>
                  <Input
                    id="authorImage"
                    type="file"
                    accept="image/*"
                    onChange={handleAuthorImageChange}
                  />
                  {(authorImage || existingAuthorImage) && (
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Image URL</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {existingAuthorImage && (
                            <TableRow>
                              <TableCell>
                                <img
                                  src={existingAuthorImage}
                                  alt="Author image"
                                  className="w-20 h-20 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {existingAuthorImage}
                              </TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>Existing</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setExistingAuthorImage("")}
                                  type="button">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove image</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                          {authorImage && (
                            <TableRow>
                              <TableCell>
                                <img
                                  src={URL.createObjectURL(authorImage)}
                                  alt="New author image"
                                  className="w-20 h-20 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell>{authorImage.name}</TableCell>
                              <TableCell>
                                {(authorImage.size / 1024).toFixed(2)} KB
                              </TableCell>
                              <TableCell>{authorImage.type}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setAuthorImage(null)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove image</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div> */}

                <div className="grid gap-3">
                  <Label htmlFor="newsImages">Мэдээний зураг</Label>
                  <Input
                    id="newsImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewsImagesChange}
                  />
                  {(newsImages.length > 0 || existingNewsImages.length > 0) && (
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Урьдчилан үзэх</TableHead>
                            <TableHead>Зургийн URL</TableHead>
                            <TableHead>Хэмжээ</TableHead>
                            <TableHead>Төрөл</TableHead>
                            <TableHead className="text-right">
                              Үйлдлүүд
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {existingNewsImages.map((imageUrl, index) => (
                            <TableRow key={`existing-${index}`}>
                              <TableCell>
                                <img
                                  src={imageUrl}
                                  alt={`News image ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {imageUrl}
                              </TableCell>
                              <TableCell>-</TableCell>
                              <TableCell>Existing</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeExistingNewsImage(index);
                                  }}
                                  type="button">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">
                                    Зургийг арилгах
                                  </span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          {newsImages.map((file, index) => (
                            <TableRow key={`new-${index}`}>
                              <TableCell>
                                <img
                                  src={previewNewsImages[index]}
                                  alt={`News image ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell>{file.name}</TableCell>
                              <TableCell>
                                {(file.size / 1024).toFixed(2)} KB
                              </TableCell>
                              <TableCell>{file.type}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeNewsImage(index)}>
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">
                                    Зургийг арилгах
                                  </span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {formData.authorName && (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        (authors.find((a) => a.name === formData.authorName)?.image) ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Selected author"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{formData.authorName}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <h1>{formData.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>By {formData.authorName}</span>
                  <span>•</span>
                  <span>{formData.category}</span>
                  {formData.banner && (
                    <>
                      <span>•</span>
                      <span className="text-primary">Banner Post</span>
                    </>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{formData.content}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
