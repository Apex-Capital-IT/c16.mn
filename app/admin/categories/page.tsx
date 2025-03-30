import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoriesList } from "@/components/admin/categories-list";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Link href="/admin/categories/new" passHref>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Category
          </Button>
        </Link>
      </div>
      <CategoriesList />
    </div>
  );
}
