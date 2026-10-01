"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminList } from "./useAdminList";

type Category = {
  _id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export function CategoryList() {
  const {
    loading,
    error,
    items: categories,
    deleteItem,
  } = useAdminList<Category>({ endpoint: "categories", pageSize: 100 });
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`"${category.categoryName}" ангиллыг устгах уу?`)) return;
    setDeleting(category._id);
    await deleteItem(category._id);
    setDeleting(null);
    toast.success("Ангилал устгагдлаа");
  };

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
            <TableHead className="text-right">Үйлдэл</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
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
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deleting === category._id}
                    onClick={() => handleDelete(category)}
                    className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 