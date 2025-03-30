import { CategoryForm } from "@/components/admin/category-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Category | News App",
  description: "Create a new category for your news app",
};

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create New Category</h1>
      <CategoryForm />
    </div>
  );
}
