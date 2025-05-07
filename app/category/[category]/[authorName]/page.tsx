// ene nittlel iin fe
import Image from "next/image";
import Link from "next/link";
import { Clock, InstagramIcon, FacebookIcon, YoutubeIcon } from "lucide-react";
import axios from "axios";
import { NewsArticle } from "@/lib/axios";

// Fetch articles by author
async function getArticlesByAuthor(authorName: string): Promise<NewsArticle[]> {
  try {
    const res = await axios.get<{ status: string; data: NewsArticle[]; count: number }>(
      "https://c16-mn.onrender.com/api/news",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    if (res.data.status === "success" && Array.isArray(res.data.data)) {
      const decodedAuthorName = decodeURIComponent(authorName).trim();
      return res.data.data
        .filter((article: NewsArticle) => 
          article.authorName?.trim() === decodedAuthorName
        )
        .sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

// Fetch author info
async function getAuthorInfo(authorName: string) {
  try {
    const res = await axios.get<{ authors: any[] }>(
      "https://c16-mn.onrender.com/api/authors",
      {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );
    return res.data.authors.find(
      (author: any) =>
        author.authorName?.trim().toLowerCase() ===
        decodeURIComponent(authorName).trim().toLowerCase()
    );
  } catch {
    return null;
  }
}

interface PageParams {
  params: Promise<{
    category: string;
    authorName: string;
  }>;
}

export default async function AuthorPage({ params }: PageParams) {
  const resolvedParams = await params;
  const { category, authorName } = resolvedParams;
 
  const articles = await getArticlesByAuthor(authorName);
  const author = await getAuthorInfo(authorName);

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-1/4 border-r border-gray-200 pr-6 hidden md:block">
          <div className="sticky top-20">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Зохиолч
            </h2>
            {author ? (
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                <Image
                  src={author.authorImage || "/images/default-avatar.png"}
                  alt={author.authorName}
                  width={50}
                  height={50}
                  className="rounded-full w-[50px] h-[50px] mx-auto mb-3 object-cover"
                />
                <p className="text-base font-bold text-gray-800 mb-2">
                  {author.authorName}
                </p>
                {author.socialMedia ? (
                  <a
                    href={author.socialMedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 text-sm font-medium hover:underline">
                    {author.socialMedia.includes("instagram") && (
                      <InstagramIcon className="w-4 h-4 mr-1" />
                    )}
                    {author.socialMedia.includes("facebook") && (
                      <FacebookIcon className="w-4 h-4 mr-1" />
                    )}
                    {author.socialMedia.includes("youtube") && (
                      <YoutubeIcon className="w-4 h-4 mr-1" />
                    )}
                    Social
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">Холбоос байхгүй</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Зохиолч олдсонгүй</p>
            )}
          </div>
        </aside>

        {/* Article List */}
        <section className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-8">
            {decodeURIComponent(authorName)} - нийтлэлүүд
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/${article.category}/${
                  articles.findIndex((a) => a._id === article._id) + 1
                }`}
                className="block border rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
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
                  <h2 className="text-lg font-semibold">{article.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
