"use client";

import { useState } from "react";
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
import { useAdminList } from "@/components/admin/useAdminList";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {
    loading,
    error,
    items: posts,
    refresh,
    hasMore,
    loadMore,
    page,
    deleteItem,
  } = useAdminList<Post>({ endpoint: `${apiUrl}/api/news`, dataKey: "data", pageSize: 20 });
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                        onClick={async () => {
                          try {
                            await deleteItem(post._id);
                            toast({
                              title: "Success",
                              description: "Post deleted successfully",
                            });
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "Failed to delete post",
                              variant: "destructive",
                            });
                          }
                        }}>
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
