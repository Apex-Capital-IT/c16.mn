"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import CategoryForm from "@/components/admin/CategoryForm";
import { CategoryList } from "@/components/admin/CategoryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCategoryCreated = () => {
    // Force the CategoryList to refresh
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Ангилалууд"
        description="Мэдээний ангилалуудыг удирдах"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Шинэ ангилал үүсгэх</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm onSuccess={handleCategoryCreated} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ангилалууд</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryList key={refreshKey} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
