import Link from "next/link";
import { mockCategories, getNewsByCategory } from "@/lib/mock-data";

interface CategoryCount {
  name: string;
  slug: string;
  count: number;
}

function getCategories(): CategoryCount[] {
  return mockCategories
    .map((c) => ({
      name: c.categoryName,
      slug: c.slug,
      count: getNewsByCategory(c.slug).length,
    }))
    .sort((a, b) => b.count - a.count);
}

export default function NewsCategories() {
  const categories = getCategories();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/${category.slug}`}
            className="flex py-2 hover:text-red-600 transition-colors justify-between items-center">
            <span>{category.name}</span>
            <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
