"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, forwardRef, useImperativeHandle } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminList } from "./useAdminList";

interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
  error?: string;
}

interface Author {
  _id: string;
  authorName: string;
  authorImage?: string;
  socialMedia?: string;
  createdAt: string;
}

export const AuthorList = forwardRef<{ refresh: () => void }, {}>(
  (props, ref) => {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const {
      loading,
      error,
      items: authors,
      hasMore,
      refresh,
      loadMore,
      page,
      deleteItem,
    } = useAdminList<Author>({ endpoint: `${apiUrl}/api/authors`, dataKey: "data" });

    useImperativeHandle(ref, () => ({
      refresh,
    }));

    const handleEdit = (author: Author) => {
      router.push(`/admin/authors/edit/${author._id}`);
    };

    const handleDeleteClick = (author: Author) => {
      setAuthorToDelete(author);
      setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
      if (!authorToDelete) return;
      try {
        await deleteItem(authorToDelete._id);
        toast.success("Зохиолч амжилттай устгагдлаа");
      } catch (error) {
        toast.error("Зохиолч устгахад алдаа гарлаа");
      } finally {
        setDeleteDialogOpen(false);
        setAuthorToDelete(null);
      }
    };

    if (loading && page === 1) {
      return (
        <div className="rounded-md border bg-white p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Зураг</TableHead>
                <TableHead>Нэр</TableHead>
                <TableHead>Social хаяг</TableHead>
                <TableHead>Үүсгэсэн огноо</TableHead>
                <TableHead>Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
      <div>
        <div className="rounded-md border bg-white p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Зураг</TableHead>
                <TableHead>Нэр</TableHead>
                <TableHead>Social хаяг</TableHead>
                <TableHead>Үүсгэсэн огноо</TableHead>
                <TableHead>Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {authors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Зохиолч олдсонгүй!
                  </TableCell>
                </TableRow>
              ) : (
                authors.map((author) => (
                  <TableRow key={author._id}>
                    <TableCell>
                      {author.authorImage && (
                        <div className="relative w-10 h-10">
                          <Image
                            src={author.authorImage}
                            alt={author.authorName}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{author.authorName}</TableCell>
                    <TableCell>
                      {author.socialMedia && (
                        <a
                          href={author.socialMedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline">
                          {author.socialMedia}
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(author.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(author)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(author)}
                          className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {hasMore && (
          <div className="mt-6 text-center">
            <Button onClick={loadMore} disabled={loading} variant="outline">
              {loading ? "Уншиж байна..." : "Дараагийн"}
            </Button>
          </div>
        )}

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Зохиолч устгах</AlertDialogTitle>
              <AlertDialogDescription>
                Та "{authorToDelete?.authorName}" гэсэн зохиолчийг устгахдаа
                итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Болих</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700">
                Устгах
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
);
