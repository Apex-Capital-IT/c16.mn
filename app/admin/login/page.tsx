"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin-auth`, {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`${username}:${password}`),
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        // Store login flag (for demo, use localStorage)
        localStorage.setItem("admin_logged_in", "true");
        router.push("/admin");
      } else {
        setError("Нэвтрэх нэр эсвэл нууц үг буруу байна");
      }
    } catch (err) {
      setError("Сүлжээний алдаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Админ нэвтрэх</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Нэвтрэх нэр"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Нууц үг"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 