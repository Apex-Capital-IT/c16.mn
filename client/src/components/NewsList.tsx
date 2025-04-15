import React, { useEffect, useState } from "react";
import { getNews, News } from "../services/news.service";

const NewsList: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNews();
        setNews(data as News[]);
        setLoading(false);
      } catch (err) {
        setError("Мэдээг татахад алдаа гарлаа");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div className="text-center p-4">Уншиж байна...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Алдаа: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Мэдээний жагсаалт</h2>
      <div className="grid gap-4">
        {news.map((item) => (
          <div key={item._id} className="border rounded-lg p-4 shadow">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            
            {item.newsImages && item.newsImages.length > 0 && (
              <div className="mb-4">
                <img 
                  src={item.newsImages[0]} 
                  alt={item.title} 
                  className="w-full h-48 object-cover mb-2 rounded" 
                />
              </div>
            )}
            
            <p className="text-gray-700 mb-2">{item.content}</p>
            
            <div className="flex items-center mb-2">
              {item.authorImage && (
                <img 
                  src={item.authorImage} 
                  alt={item.authorName} 
                  className="w-8 h-8 rounded-full mr-2" 
                />
              )}
              <span className="text-sm text-gray-600">{item.authorName}</span>
            </div>
            
            <div className="text-sm text-gray-500">
              Ангилал: {item.category}
              {item.banner && <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Баннер</span>}
              <br />
              Үүсгэсэн: {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList; 