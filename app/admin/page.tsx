"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");
    if (!token) {
      router.replace("/key");
    }
  }, [router]);

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
            value="142"
            change="↑ 20% from last month"
            icon={BarChart3}
          />
          <StatsCard
            title="Authors"
            value="12"
            change="+2 new authors"
            icon={Users}
          />
          <StatsCard
            title="Categories"
            value="8"
            change="+1 from last month"
            icon={FolderTree}
          />
          <StatsCard
            title="Page Views"
            value="24,563"
            change="↑ 12.5% from last month"
            icon={Eye}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 transition-all duration-200 hover:shadow-lg hover:border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Overview</CardTitle>
              <CardDescription className="text-muted-foreground">
                Blog post views for the last 30 days
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
