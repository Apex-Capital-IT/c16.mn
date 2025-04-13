import Link from "next/link";
import axiosInstance, { NewsArticle } from "@/lib/axios";

async function getCategories(): Promise<string[]> {
  try {
    const res = await axiosInstance.get<NewsArticle[]>('/api/news');
    // Get unique categories from news
    const categories = [...new Set(res.data.map(article => article.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
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
            key={category}
            href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
            className="block py-2 hover:text-red-600 transition-colors"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}
