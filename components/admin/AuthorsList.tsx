"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Author {
  _id: string;
  authorName: string;
  authorImage: string;
  createdAt: string;
}

export default function AuthorsList() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch("/api/authors");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch authors");
        }
        console.log(response);
        setAuthors(data.authors || []);
      } catch (error) {
        console.error("Error fetching authors:", error);
        toast.error("Зохиолчдын жагсаалтыг авахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (authors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Зохиолч олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {authors.map((author) => (
        <Card key={author._id}>
          <CardHeader>
            <h3 className="text-lg font-semibold">{author.authorName}</h3>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={author.authorImage}
                alt={author.authorName}
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
