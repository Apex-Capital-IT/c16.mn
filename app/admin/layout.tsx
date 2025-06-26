"use client";

import { Sidebar } from "@/components/admin/sidebar";
import type React from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Guard all /admin pages except /admin/login
      if (pathname !== "/admin/login") {
        const loggedIn = localStorage.getItem("admin_logged_in");
        if (!loggedIn) {
          router.replace("/admin/login");
        }
      }
    }
  }, [router, pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out ml-[250px] data-[sidebar-collapsed=true]:ml-[60px] data-[sidebar-collapsed=true]:w-[calc(100%-60px)] w-[calc(100%-250px)]">
        {children}
      </main>
    </div>
  );
}
