import { PostEditor } from "@/components/admin/post-editor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Post | News App",
  description: "Create a new post for your news app",
};

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
      <PostEditor />
    </div>
  );
}
