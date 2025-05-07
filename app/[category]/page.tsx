import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import axios from "axios";
import { NewsArticle } from "@/lib/axios";

async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const response = await axios.get<{ status: string; data: NewsArticle[]; count: number }>(
      "https://c16-mn.onrender.com/api/news",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    if (response.data.status === "success" && Array.isArray(response.data.data)) {
      return response.data.data
        .filter((article) => article.category.toLowerCase() === category.toLowerCase())
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

type Props = {
  params: Promise<{
    category: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const articles = await getNewsByCategory(resolvedParams.category);

  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">
            No articles found in {resolvedParams.category}
          </h1>
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
        <h1 className="text-3xl font-bold mb-8 capitalize">
          {resolvedParams.category} News
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: NewsArticle, index: number) => (
            <div
              key={article._id}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/${resolvedParams.category}/${index + 1}`}
                prefetch={false}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      article.newsImages?.[0] ||
                      "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg"
                    }
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
                  <h2 className="text-xl font-semibold mb-2 hover:text-red-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span className="mr-4">
                      {new Date(article.createdAt).toLocaleDateString()}
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
