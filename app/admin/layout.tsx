import { Sidebar } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-end px-4">
          {/* <ThemeToggle /> */}
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
