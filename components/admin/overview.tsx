"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { adminStore } from "./mock-store";

function buildData() {
  return adminStore.categories.map((c) => ({
    name: c.categoryName.length > 12 ? c.categoryName.slice(0, 12) + "…" : c.categoryName,
    total: adminStore.news
      .filter((n) => n.category === c.slug || n.categoryName === c.categoryName)
      .reduce((sum, n) => sum + (n.views || 0), 0),
  }));
}

export function Overview() {
  const [loading, setLoading] = useState(true);
  const [data] = useState(buildData);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[350px] w-full" />
        <div className="flex justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-8" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 