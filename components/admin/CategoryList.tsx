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

type Category = {
  _id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch("/api/categories");
        let data;
        
        try {
          data = await res.json();
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          throw new Error("Ангилал авахад алдаа гарлаа - Серверээс буруу хариу ирлээ");
        }
        
        if (!res.ok) {
          throw new Error(data.error || data.message || "Ангилал авахад алдаа гарлаа");
        }
        
        setCategories(Array.isArray(data.categories) ? data.categories : []);
      } catch (error) {
        console.error("Ангилал авахад алдаа гарлаа", error);
        setError(error instanceof Error ? error.message : "Ангилал авахад алдаа гарлаа");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
            <TableHead>Нэр</TableHead>
            <TableHead>Үүсгэсэн огноо</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                Ангилал олдсонгүй
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 