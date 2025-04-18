"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Home, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Tag,
  Settings,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarNavProps) {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const items = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Posts",
      href: "/admin/posts",
      icon: FileText,
    },
    {
      title: "Authors",
      href: "/admin/authors",
      icon: Users,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: Tag,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div
        className={cn(
          "flex flex-col border-r bg-background h-screen",
          isOpen ? "w-64" : isMobile ? "w-0" : "w-16",
          "transition-all duration-300 ease-in-out",
          className
        )}>
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            {isOpen ? (
              <span>c16.mn Admin</span>
            ) : (
              <span className="sr-only">c16.mn Admin</span>
            )}
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 px-2 py-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent",
                  !isOpen && "justify-center"
                )}>
                <item.icon className="h-5 w-5" />
                {isOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto border-t p-4">
          <Button variant="outline" className={cn("w-full", !isOpen && "p-2")}>
            <LogOut className="h-5 w-5" />
            {isOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
}
