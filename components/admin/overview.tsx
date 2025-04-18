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

const data = [
  {
    name: "Jan",
    total: 1200,
  },
  {
    name: "Feb",
    total: 1900,
  },
  {
    name: "Mar",
    total: 2100,
  },
  {
    name: "Apr",
    total: 2400,
  },
  {
    name: "May",
    total: 2700,
  },
  {
    name: "Jun",
    total: 3000,
  },
  {
    name: "Jul",
    total: 2500,
  },
  {
    name: "Aug",
    total: 2800,
  },
  {
    name: "Sep",
    total: 3200,
  },
  {
    name: "Oct",
    total: 3500,
  },
  {
    name: "Nov",
    total: 3700,
  },
  {
    name: "Dec",
    total: 3900,
  },
];

export function Overview() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[350px] w-full" />
        <div className="flex justify-between">
          {Array.from({ length: 12 }).map((_, i) => (
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