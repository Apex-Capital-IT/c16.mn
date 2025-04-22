import Image from "next/image";
import { Clock, Eye, MessageSquare } from "lucide-react";
import axios from "axios";
import { NewsArticle } from "@/lib/axios";
import Link from "next/link";

async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const response = await axios.get<NewsArticle[]>(
      "https://c16-mn.onrender.com/api/news",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    // Filter by category and sort by date (oldest first)
    return response.data
      .filter(
        (article) => article.category.toLowerCase() === category.toLowerCase()
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

type Props = {
  params: Promise<{
    category: string;
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const articles = await getNewsByCategory(resolvedParams.category);
  const articleIndex = parseInt(resolvedParams.id) - 1; // Convert 1-based index to 0-based
  const article = articles[articleIndex];

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-gray-600">
            The requested article could not be found.
          </p>
          <Link
            href="/"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="mb-4">
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                {article.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock size={14} className="mr-1" />
              <span className="mr-4">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
              <span>By {article.authorName}</span>
            </div>
          </div>

          {/* Article Image */}
          <div className="relative h-[400px] w-full mb-8 overflow-hidden rounded-lg">
            <Image
              src={
                article.newsImages[0] ||
                "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg"
              }
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">{article.description}</p>
            <div className="text-gray-800 whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center border-t pt-6">
            {articleIndex > 0 && (
              <Link
                href={`/${resolvedParams.category}/${articleIndex}`}
                className="text-blue-600 hover:underline flex items-center"
              >
                <span className="mr-2">←</span> Previous Article
              </Link>
            )}
            {articleIndex < articles.length - 1 && (
              <Link
                href={`/${resolvedParams.category}/${articleIndex + 2}`}
                className="text-blue-600 hover:underline flex items-center ml-auto"
              >
                Next Article <span className="ml-2">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
