import { LoginForm } from "@/components/admin/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | News App",
  description: "Login to the News App admin panel",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">News Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the admin dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
