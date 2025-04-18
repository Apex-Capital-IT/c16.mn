import Link from "next/link";
import axiosInstance, { NewsArticle, fallbackNewsData } from "@/lib/axios";

async function getCategories(): Promise<string[]> {
  try {
    const res = await axiosInstance.get<NewsArticle[]>('/api/news');
    // Get unique categories from news
    const categories = [...new Set(res.data.map(article => article.category))];
    return categories;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    // Return fallback categories during build or when API is unavailable
    if (process.env.NODE_ENV === 'production' || error.code === 'ECONNREFUSED') {
      console.warn('Using fallback categories');
      return [...new Set(fallbackNewsData.map(article => article.category))];
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
