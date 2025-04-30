"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function KeyPage() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem(
        "admin_access_token",
        JSON.stringify({
          token: input,
          timestamp: Date.now(),
        })
      );
      router.replace("/admin");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="p-6 rounded-md border w-full max-w-sm bg-white shadow-md space-y-4"
      >
        <h1 className="text-lg font-semibold">Enter Admin Password</h1>
        <input
          type="password"
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"
          placeholder="Password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Нэвтрэх
        </button>
      </form>
    </div>
  );
}
