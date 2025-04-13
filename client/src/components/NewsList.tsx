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
        setNews(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching news");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">News List</h2>
      <div className="grid gap-4">
        {news.map((item) => (
          <div key={item._id} className="border rounded-lg p-4 shadow">
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            {item.image && (
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover mb-2 rounded" />
            )}
            <p className="text-gray-700 mb-2">{item.content}</p>
            <div className="text-sm text-gray-500">
              Category: {item.category}
              <br />
              Created: {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsList; 