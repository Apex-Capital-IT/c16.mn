import Link from "next/link";
import { getCategories } from "@/lib/db";

export default function NewsCategories() {
  const categories = getCategories();

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-black",
      green: "bg-black",
      purple: "bg-black",
      orange: "bg-black",
      red: "bg-black",
      indigo: "bg-black",
      pink: "bg-black",
    };
    return colorMap[color] || "bg-gray-500";
  };

  return (
    <div className="news-categories bg-gray-50 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      <div className="space-y-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex items-center justify-between p-3 bg-white rounded-md hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <span
                className={`w-3 h-3 rounded-full ${getColorClass(
                  category.color
                )} mr-3`}
              ></span>
              <span className="font-medium">{category.name}</span>
            </div>
            <span className="text-sm text-gray-500">{category.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
