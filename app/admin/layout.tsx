import { Sidebar } from "@/components/admi/sidebar";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="fixed h-screen">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 overflow-auto ml-64">{children}</main>
    </div>
  );
}
