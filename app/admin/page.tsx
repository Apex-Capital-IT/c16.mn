import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Plus, Tag } from "lucide-react";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentPosts } from "@/components/admin/recent-posts";

export const metadata: Metadata = {
  title: "Admin Dashboard | News App",
  description: "Admin dashboard for the News App",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/posts/new" passHref>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
          <Link href="/admin/categories/new" passHref>
            <Button size="sm" variant="outline" className="gap-1">
              <Tag className="h-4 w-4" />
              New Category
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest published articles</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPosts />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Posts</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/admin/posts/new" passHref>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create Post
                  </Button>
                </Link>
                <Link href="/admin/posts" passHref>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    All Posts
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-2">
              <h3 className="text-sm font-medium">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/admin/categories/new" passHref>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Create Category
                  </Button>
                </Link>
                <Link href="/admin/categories" passHref>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2">
                    <Tag className="h-4 w-4" />
                    All Categories
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
