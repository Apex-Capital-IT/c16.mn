"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  banner: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  newsImages: string[];
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Post[]>("/api/news", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      setPosts(response.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/news/${id}`);
      // Refresh posts list
      await fetchPosts();
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Posts"
        description="Manage news posts"
        action={
          <Link href="/admin/posts/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </Link>
        }
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Banner</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading posts...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No posts found
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-4">
                      {/* Title and content */}
                      <div className="flex flex-col gap-2 w-[300px]">
                        <div className="font-medium text-lg truncate">
                          {post.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {post.content}
                        </div>
                      </div>

                      {/* News images preview */}
                      {post.newsImages?.length > 0 && (
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span>
                              {post.newsImages.length} image
                              {post.newsImages.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {post.newsImages.slice(0, 3).map((image, index) => (
                              <div
                                key={index}
                                className="relative group cursor-pointer"
                                onClick={() => setSelectedImage(image)}>
                                <img
                                  src={image}
                                  alt={`News image ${index + 1}`}
                                  className="w-24 h-24 object-cover rounded-md shadow-sm transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                  <Eye className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            ))}
                            {post.newsImages.length > 3 && (
                              <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center hover:bg-muted/80 transition-colors">
                                <span className="text-sm font-medium text-muted-foreground">
                                  +{post.newsImages.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="text-sm text-muted-foreground">
                    {post.category}
                  </TableCell>

                  {/* Author */}
                  <TableCell className="text-sm">{post.authorName}</TableCell>

                  {/* Type badge */}
                  <TableCell>
                    <Badge variant={post.banner ? "default" : "secondary"}>
                      {post.banner ? "Banner" : "Regular"}
                    </Badge>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/posts/edit/${post._id}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Image Preview Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Image Preview</span>
              <Button
                className="w-4 h-4"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}>
                {/* <X className="h-4 w-4" /> */}
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full h-[70vh]">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
