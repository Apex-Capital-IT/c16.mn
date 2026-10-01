"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { useToast } from "@/components/admin/admin-toast";
import { adminStore, fakeDelay, newId, nowIso } from "@/components/admin/mock-store";
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
    setCategories(
      adminStore.categories.map((cat) => ({ id: cat._id, name: cat.categoryName }))
    );
    setAuthors(
      adminStore.authors.map((author) => ({
        id: author._id,
        name: author.authorName,
        image: author.authorImage || "/placeholder.svg",
      }))
    );
    setLoading(false);
  }, []);

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
      const author = authors.find((a) => a.name === value);
      if (author) {
        setPreviewAuthorImage(author.image);
      }
    }
  };

  const handleNewsImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      setNewsImages((prev) => [...prev, ...files]);

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

    if (newsImages.length === 0) {
      toast({
        title: "Error",
        description: "At least one news image is required",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    await fakeDelay();
    const cat = adminStore.categories.find((c) => c.categoryName === formData.category);
    const author = adminStore.authors.find((a) => a.authorName === formData.authorName);
    const id = newId("n");
    const now = nowIso();
    adminStore.news.unshift({
      _id: id,
      title: formData.title,
      description: formData.content.slice(0, 140),
      content: formData.content,
      category: cat?.slug || formData.category,
      categoryName: formData.category,
      newsImages: previewNewsImages,
      authorName: formData.authorName,
      authorId: author?._id || "",
      authorImage: author?.authorImage || "",
      banner: formData.banner,
      slug: id,
      publishedDate: now,
      createdAt: now,
      updatedAt: now,
      views: 0,
    });
    toast({
      title: "Success",
      description: "Мэдээ амжилттай нийтлэгдлээ (mock)",
    });
    setSubmitting(false);
    router.push("/admin/posts");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Нийтлэл үүсгэх"
        description="Шинэ мэдээний нийтлэл үүсгэх"
        action={
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Нийтэлж байна..." : "Нийтлэх"}
          </Button>
        }
      />

      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Засварлах</TabsTrigger>
          <TabsTrigger value="preview">Урьдчилан үзэх</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Гарчиг</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Мэдээний гарчгийг оруулна уу"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="content">Агуулга</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Мэдээлэлээ энд бичнэ үү..."
                    rows={10}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="category">Ангилал</Label>
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
                  <Label htmlFor="authorName">Нийтлэгч</Label>
                  <Select
                    value={formData.authorName}
                    onValueChange={(value) =>
                      handleSelectChange("authorName", value)
                    }
                  >
                    <SelectTrigger id="authorName">
                      <SelectValue placeholder="Нийтлэгчийг сонгоно уу" />
                      <SelectValue placeholder="Нийтлэгчийг сонгоно уу" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors && authors.length > 0 ? (
                        authors.map((author) => (
                          <SelectItem key={author.id} value={author.name}>
                            {author.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-authors" disabled>
                          Нийтлэгч олдсонгүй
                        </SelectItem>
                      )}
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
                  <Label htmlFor="newsImages">Мэдээний зураг</Label>
                  <Input
                    id="newsImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewsImagesChange}
                    required
                  />
                  {previewNewsImages.length > 0 && (
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Урьдчилан үзэх</TableHead>
                            <TableHead>Файлын нэр</TableHead>
                            <TableHead>Хэмжээ</TableHead>
                            <TableHead>Төрөл</TableHead>
                            <TableHead className="text-right">
                              Үйлдлүүд
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {newsImages.map((file, index) => (
                            <TableRow key={index}>
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
                                  onClick={() => removeNewsImage(index)}
                                >
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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="banner"
                    checked={formData.banner}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="banner">Баннер мэдээ болгон тохируулах</Label>
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
                  {formData.title || "Гарчиггүй"}
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
                  <p>{formData.content || "Одоогоор контент алга"}</p>
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
