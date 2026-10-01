"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { adminStore, fakeDelay, removeFromStore } from "@/components/admin/mock-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Author {
  _id: string;
  authorName: string;
  authorImage?: string;
  socialMedia?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function EditAuthorPage() {
  const params = useParams();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingAuthorImage, setExistingAuthorImage] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const authorId = params.id as string;
    const found = adminStore.authors.find((a) => a._id === authorId);
    if (!found) {
      setError("Зохиолч олдсонгүй");
    } else {
      setAuthor({ ...found });
      if (found.authorImage) {
        setPreviewUrl(found.authorImage);
        setExistingAuthorImage(found.authorImage);
      }
    }
    setLoading(false);
  }, [params.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Зөвхөн зураг файл оруулах боломжтой");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Зургийн хэмжээ 5MB-аас бага байх ёстой");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeExistingImage = () => {
    setExistingAuthorImage(null);
    setPreviewUrl(null);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl(existingAuthorImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author) return;

    setIsSubmitting(true);
    await fakeDelay();
    const target = adminStore.authors.find((a) => a._id === author._id);
    if (target) {
      target.authorName = author.authorName;
      target.socialMedia = author.socialMedia;
      target.authorImage = previewUrl || "/placeholder.svg";
    }
    toast.success("Зохиолч амжилттай шинэчлэгдлээ");
    setIsSubmitting(false);
    router.push("/admin/authors");
  };

  const handleDelete = async () => {
    if (!author) return;

    setIsDeleting(true);
    await fakeDelay();
    removeFromStore("authors", author._id);
    toast.success("Зохиолч амжилттай устгагдлаа");
    setIsDeleting(false);
    router.push("/admin/authors");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!author) return <div>Author not found</div>;

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Зохиолч засварлах"
        description="Зохиолчийн мэдээллийг засварлах"
        action={
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "Устгаж байна..." : "Устгах"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Зохиолч устгах</AlertDialogTitle>
                  <AlertDialogDescription>
                    Энэ үйлдлийг буцаах боломжгүй. Энэ нь зохиолчийн бүх
                    мэдээллийг бүр устгана.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Болих</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Устгах
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </div>
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="authorName">Зохиолчийн нэр</Label>
                  <Input
                    id="authorName"
                    value={author.authorName}
                    onChange={(e) =>
                      setAuthor({ ...author, authorName: e.target.value })
                    }
                    required
                    placeholder="Зохиолчийн нэрийг оруулна уу"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="socialMedia">Social хаяг</Label>
                  <Input
                    id="socialMedia"
                    value={author.socialMedia || ""}
                    onChange={(e) =>
                      setAuthor({ ...author, socialMedia: e.target.value })
                    }
                    placeholder="Instagram, Facebook, YouTube хаяг оруулна уу"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="authorImage">Зохиолчийн зураг</Label>
                  <Input
                    id="authorImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {(previewUrl || existingAuthorImage) && (
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Image URL</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
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
                                  onClick={removeExistingImage}
                                  type="button">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove image</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                          {selectedImage && (
                            <TableRow>
                              <TableCell>
                                <img
                                  src={previewUrl || ""}
                                  alt="New author image"
                                  className="w-20 h-20 object-cover rounded"
                                />
                              </TableCell>
                              <TableCell>{selectedImage.name}</TableCell>
                              <TableCell>
                                {(selectedImage.size / 1024).toFixed(2)} KB
                              </TableCell>
                              <TableCell>{selectedImage.type}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={removeSelectedImage}>
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
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <div className="relative w-32 h-32">
                      <img
                        src={previewUrl}
                        alt={author.authorName}
                        className="w-32 h-32 object-cover rounded-full"
                      />
                    </div>
                  )}
                  <div>
                    <h1>{author.authorName}</h1>
                    {author.socialMedia && (
                      <p className="text-muted-foreground">
                        {author.socialMedia}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
