import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

async function getArticlesByCategory(category: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/news?category=${category}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch articles");
    return await res.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category;
  const articles = await getArticlesByCategory(category);

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          No articles found in this category
        </h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">{category} News</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: any, index: number) => (
            <div
              key={article._id}
              className="border rounded-lg overflow-hidden"
            >
              <Link href={`/${article.category}/${index + 1}`} prefetch={false}>
                <div className="relative h-48">
                  <Image
                    src={article.newsImage || "/medeenii_cover1.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 hover:text-red-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {article.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span className="mr-4">
                      {new Date(article.publishedDate).toLocaleDateString()}
                    </span>
                    <span>By {article.authorName}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
