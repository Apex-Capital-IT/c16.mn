"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Home, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-bold text-xl">
          <span className="text-primary">News</span>
          <span>Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          <Link href="/admin" passHref>
            <Button
              variant={isActive("/admin") ? "secondary" : "ghost"}
              className="w-full justify-start gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/posts" passHref>
            <Button
              variant={isActive("/admin/posts") ? "secondary" : "ghost"}
              className="w-full justify-start gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </Button>
          </Link>
          <Link href="/admin/categories" passHref>
            <Button
              variant={isActive("/admin/categories") ? "secondary" : "ghost"}
              className="w-full justify-start gap-2">
              <FileText className="h-4 w-4" />
              Categories
            </Button>
          </Link>
        </nav>
      </div>
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
