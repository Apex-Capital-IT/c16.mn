import Image from "next/image";
import { Clock, Eye, MessageSquare } from "lucide-react";
import { getArticleById } from "@/lib/api";

interface ArticlePageProps {
  params: {
    category: string;
    id: string;
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const category = params.category;
  const id = params.id;
  const article = await getArticleById(category, id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Clock size={14} className="mr-1" />
            <span className="mr-4">
              {new Date(article.publishedDate).toLocaleDateString()}
            </span>
            <span>By {article.authorName}</span>
          </div>

          <div className="relative h-[500px] w-full mb-8 overflow-hidden rounded-lg">
            <Image
              src={article.newsImage || "/medeenii_cover1.jpg"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">{article.description}</p>
            {article.content && (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            )}
          </div>

          <div className="mt-8 flex items-center space-x-4 text-gray-500">
            <div className="flex items-center">
              <Eye size={16} className="mr-1" />
              <span>{article.views || 0} views</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={16} className="mr-1" />
              <span>{article.comments?.length || 0} comments</span>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
} 