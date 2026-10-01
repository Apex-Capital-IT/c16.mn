"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { adminStore } from "./mock-store";

interface Post {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  views: number;
}

function buildRecent(): Post[] {
  return [...adminStore.news]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5)
    .map((n) => ({
      id: n._id,
      title: n.title,
      author: { name: n.authorName, avatar: n.authorImage },
      date: new Date(n.createdAt).toLocaleDateString(),
      views: n.views || 0,
    }));
}

export function RecentPosts() {
  const [loading, setLoading] = useState(true);
  const [recentPosts] = useState(buildRecent);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <Skeleton className="h-4 w-[60px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {recentPosts.map((post) => (
        <div key={post.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={post.author.avatar || "/placeholder.svg"}
              alt={post.author.name}
            />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <Link href={`/admin/posts/edit/${post.id}`} className="text-sm font-medium leading-none hover:underline">{post.title}</Link>
            <p className="text-sm text-muted-foreground">
              By {post.author.name} • {post.date}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {post.views.toLocaleString()} views
          </div>
        </div>
      ))}
    </div>
  );
}
