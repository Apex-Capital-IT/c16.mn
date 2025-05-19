"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
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
import axios from "axios";

interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
  error?: string;
}

// Configure axios with base URL and default settings
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }
    if (!error.response) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
);

interface Author {
  _id: string;
  authorName: string;
  authorImage?: string;
  socialMedia?: string;
  createdAt: string;
}

const fallbackAuthorData: Author[] = [];

export const AuthorList = forwardRef<
  { refresh: () => void },
  {}
>((props, ref) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/authors?page=${page}&limit=10`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Authors авахад алдаа гарлаа");
      }

      const totalCount = parseInt(res.headers.get("X-Total-Count") || "0");
      setTotalAuthors(totalCount);
      setHasMore(page * 10 < totalCount);

      const data = await res.json();

      if (page === 1) {
        setAuthors(Array.isArray(data.authors) ? data.authors : []);
      } else {
        setAuthors((prev) => [
          ...prev,
          ...(Array.isArray(data.authors) ? data.authors : []),
        ]);
      }
    } catch (error) {
      console.error("Authors авахад алдаа гарлаа", error);
      setError(
        error instanceof Error ? error.message : "Authors авахад алдаа гарлаа"
      );

      if (page === 1) {
        setAuthors(fallbackAuthorData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [page]);

  const refresh = () => {
    setPage(1);
    setAuthors([]);
    fetchAuthors();
  };

  useImperativeHandle(ref, () => ({
    refresh
  }));

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

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
      const response = await api.delete<ApiResponse<void>>(
        `/api/authors/${authorToDelete._id}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message || "Зохиолч амжилттай устгагдлаа");
        refresh();
      } else {
        toast.error(response.data.message || "Зохиолч устгахад алдаа гарлаа");
      }
    } catch (err: unknown) {
      console.error('Error deleting author:', err);
      if (err && typeof err === 'object' && 'isAxiosError' in err && err.isAxiosError) {
        const axiosError = err as { response?: { status: number; data?: { message?: string } } };
        
        if (axiosError.response?.status === 404) {
          toast.error("Зохиолч олдсонгүй");
        } else if (axiosError.response?.status === 403) {
          toast.error("Энэ үйлдлийг хийх эрх байхгүй байна");
        } else if (axiosError.response?.status === 400) {
          toast.error(axiosError.response.data?.message || "Зохиолчтой холбоотой мэдээ байгаа учраас устгах боломжгүй");
        } else if (!axiosError.response) {
          toast.error("Сервертэй холбогдоход алдаа гарлаа");
        } else {
          toast.error(axiosError.response.data?.message || "Зохиолч устгахад алдаа гарлаа");
        }
      } else {
        toast.error("Зохиолч устгахад алдаа гарлаа");
      }
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
                  Зохиолч олдсонгүй
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
                        className="text-blue-600 hover:underline"
                      >
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
                        onClick={() => handleEdit(author)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(author)}
                        className="text-red-600 hover:text-red-700"
                      >
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
              Та "{authorToDelete?.authorName}" гэсэн зохиолчийг устгахдаа итгэлтэй байна уу?
              Энэ үйлдлийг буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Болих</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});
