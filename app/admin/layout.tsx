import { Sidebar } from "@/components/admin/sidebar";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out ml-[250px] data-[sidebar-collapsed=true]:ml-[60px] data-[sidebar-collapsed=true]:w-[calc(100%-60px)] w-[calc(100%-250px)]">
        {children}
      </main>
    </div>
  );
}
