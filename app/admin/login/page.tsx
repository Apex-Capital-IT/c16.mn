"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Нэвтрэх нэр болон нууц үгээ оруулна уу");
      return;
    }
    setLoading(true);
    // Mock login: any non-empty credentials are accepted.
    await new Promise((r) => setTimeout(r, 400));
    localStorage.setItem("admin_auth", btoa(unescape(encodeURIComponent(`${username}:${password}`))));
    localStorage.setItem("admin_logged_in", "true");
    toast.success("Амжилттай нэвтэрлээ");
    router.push("/admin");
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
            <p className="text-center text-xs text-muted-foreground">
              Demo: <code>admin</code> / <code>admin</code> (ямар ч утга зөвшөөрнө)
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 