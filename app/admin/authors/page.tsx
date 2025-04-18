"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import AuthorForm from "@/components/admin/AuthorForm";
import { AuthorList } from "@/components/admin/author-list";

export default function AuthorsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader
        title="Зохиолчид"
        description="Зохиолчдын жагсаалт"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Шинэ зохиолч
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Шинэ зохиолч нэмэх</DialogTitle>
                <DialogDescription>
                  Зохиолчийн мэдээллийг оруулна уу
                </DialogDescription>
              </DialogHeader>
              <AuthorForm />
            </DialogContent>
          </Dialog>
        }
      />

      <AuthorList />
    </div>
  );
}
