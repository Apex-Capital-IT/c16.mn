import Link from "next/link";
import axiosInstance, { NewsArticle, fallbackNewsData } from "@/lib/axios";

interface CategoryCount {
  name: string;
  count: number;
}

async function getCategories(): Promise<CategoryCount[]> {
  try {
    const res = await axiosInstance.get<NewsArticle[]>("/api/news");
    // Count articles per category
    const categoryCounts = res.data.reduce(
      (acc: { [key: string]: number }, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1;
        return acc;
      },
      {}
    );

    // Convert to array and sort by count
    const categories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return categories;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    // Return fallback categories during build or when API is unavailable
    if (
      process.env.NODE_ENV === "production" ||
      error.code === "ECONNREFUSED"
    ) {
      console.warn("Using fallback categories");
      const fallbackCounts = fallbackNewsData.reduce(
        (acc: { [key: string]: number }, article) => {
          acc[article.category] = (acc[article.category] || 0) + 1;
          return acc;
        },
        {}
      );

      return Object.entries(fallbackCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    }
    return [];
  }
}

export default async function NewsCategories() {
  const categories = await getCategories();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/category/${category.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="block py-2 hover:text-red-600 transition-colors flex justify-between items-center"
          >
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
