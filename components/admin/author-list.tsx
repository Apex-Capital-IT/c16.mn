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
import { Pencil } from "lucide-react";

interface Author {
  _id: string;
  authorName: string;
  authorImage?: string;
  createdAt: string;
}

const fallbackAuthorData: Author[] = [];

export const AuthorList = forwardRef<
  { refresh: () => void },
  {}
>((props, ref) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalAuthors, setTotalAuthors] = useState(0);
  const [authors, setAuthors] = useState<Author[]>([]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the Next.js API route with pagination
      const res = await fetch(`/api/authors?page=${page}&limit=10`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Authors авахад алдаа гарлаа");
      }

      // Get total count from headers
      const totalCount = parseInt(res.headers.get("X-Total-Count") || "0");
      setTotalAuthors(totalCount);

      // Check if there are more pages
      setHasMore(page * 10 < totalCount);

      const data = await res.json();

      // If it's the first page, replace authors, otherwise append
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

      // Use fallback data in case of error
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
    fetchAuthors();
  };

  useImperativeHandle(ref, () => ({
    refresh
  }));

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="rounded-md border bg-white p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Зураг</TableHead>
              <TableHead>Нэр</TableHead>
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
              <TableHead>Үүсгэсэн огноо</TableHead>
              <TableHead>Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
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
                    {new Date(author.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {/* Edit button removed */}
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

      
    </div>
  );
});
