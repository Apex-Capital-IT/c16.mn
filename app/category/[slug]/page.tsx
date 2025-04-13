import Image from "next/image";
import Link from "next/link";
import { Clock, Eye } from "lucide-react";

async function getArticlesByCategory(categorySlug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) throw new Error('Failed to fetch articles');
    const allArticles = await res.json();
    
    // Convert the URL slug back to the original category name
    const categoryName = categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Filter articles by category
    const articles = allArticles.filter((article: any) => 
      article.category.toLowerCase() === categoryName.toLowerCase()
    );
    
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const articles = await getArticlesByCategory(params.slug);
  const categoryName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <p>No articles found in this category.</p>
        <Link
          href="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <p className="text-gray-600">
          Latest news and updates from {categoryName} category
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article: any) => (
              <div
                key={article._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={article.newsImage || "/medeenii_cover1.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span className="mr-4">
                      {new Date(article.publishedDate).toLocaleDateString()}
                    </span>
                    <span>By {article.authorName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
