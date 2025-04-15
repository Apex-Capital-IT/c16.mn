"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import Image from "next/image";

type Author = {
  _id: string;
  authorName: string;
  authorImage?: string;
  createdAt: string;
  updatedAt: string;
};

export function AuthorList() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the Next.js API route instead of directly calling the backend
        const res = await fetch("/api/authors");
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Authors авахад алдаа гарлаа");
        }
        
        const data = await res.json();
        setAuthors(Array.isArray(data.authors) ? data.authors : []);
      } catch (error) {
        console.error("Authors авахад алдаа гарлаа", error);
        setError(error instanceof Error ? error.message : "Authors авахад алдаа гарлаа");
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="rounded-md border bg-white p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Зураг</TableHead>
            <TableHead>Нэр</TableHead>
            <TableHead>Үүсгэсэн огноо</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
