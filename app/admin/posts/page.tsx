import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PostsList } from "@/components/admin/posts-list";

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <Link href="/admin/posts/new" passHref>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
      <PostsList />
    </div>
  );
}
