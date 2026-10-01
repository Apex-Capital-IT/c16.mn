"use client";

import { Suspense } from "react";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { Overview } from "@/components/admin/overview";
import { RecentPosts } from "@/components/admin/recent-posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Users, FolderTree, Eye, LucideIcon } from "lucide-react";
import AdminDashboardLoading from "./loading";
import { Skeleton } from "@/components/ui/skeleton";
import { adminStore } from "@/components/admin/mock-store";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  loading?: boolean;
}

function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <Card className="transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-2" />
          <Skeleton className="h-3 w-[120px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-success">{change}</span>
        </p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const totalPosts = adminStore.news.length;
  const totalAuthors = adminStore.authors.length;
  const totalCategories = adminStore.categories.length;
  const totalViews = adminStore.news.reduce((sum, n) => sum + (n.views || 0), 0);
  return (
    <Suspense fallback={<AdminDashboardLoading />}>
      <div className="flex flex-col gap-8 p-6 bg-background">
        <DashboardHeader
          title="Dashboard"
          description="Welcome to your blog website admin panel"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Posts"
            value={String(totalPosts)}
            change="↑ 20% from last month"
            icon={BarChart3}
          />
          <StatsCard
            title="Authors"
            value={String(totalAuthors)}
            change="Идэвхтэй зохиолчид"
            icon={Users}
          />
          <StatsCard
            title="Categories"
            value={String(totalCategories)}
            change="Нийт ангилал"
            icon={FolderTree}
          />
          <StatsCard
            title="Page Views"
            value={totalViews.toLocaleString()}
            change="↑ 12.5% from last month"
            icon={Eye}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 transition-all duration-200 hover:shadow-lg hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Overview</CardTitle>
              <CardDescription className="text-muted-foreground">
                Ангилал тус бүрийн нийт үзэлт
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3 transition-all duration-200 hover:shadow-lg hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Recent Posts
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Recently published posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentPosts />
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
