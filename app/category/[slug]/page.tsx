import Image from "next/image";
import Link from "next/link";
import { Clock, Eye, MessageSquare } from "lucide-react";
import { getArticlesByCategory, getCategoryBySlug } from "@/lib/db";
import TrendingNews from "@/components/trending-news";

// Mark the component as async and type params as a Promise
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params to resolve the slug
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const articles = await getArticlesByCategory(slug);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Category not found</h1>
        <p>The category you are looking for does not exist.</p>
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
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600">
          Latest news and updates from {category.name} category
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {articles.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p>No articles found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="relative h-48">
                    {article.youtubeUrl ? (
                      <Link
                        href={article.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <iframe
                          width="100%"
                          height="230px"
                          src={article.youtubeUrl.replace("watch?v=", "embed/")} // Convert YouTube URL to embed format
                          title={article.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="object-cover"
                        />
                      </Link>
                    ) : (
                      <Image
                        src="/medeenii_cover.jpg"
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <Link href={`/article/${article.slug}`}>
                      <h2 className="text-xl font-semibold mb-2 hover:text-red-600 transition-colors">
                        {article.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span className="mr-4">{article.date}</span>
                      <Eye size={14} className="mr-1" />
                      <span className="mr-4">{article.views}</span>
                      {/* Note: 'comments' isn't in the Article type, remove or add to type if needed */}
                      {/* <span>{article.comments}</span> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <TrendingNews />
        </div>
      </div>
    </div>
  );
}
