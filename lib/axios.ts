import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://c16-mn.onrender.com";

interface NewsArticle {
  title: string;
  content: string;
  category: string;
  newsImages: string[];
  authorName: string;
  authorImage: string;
  banner: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchNewsArticles = async (): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get<NewsArticle[]>(`${API_URL}/news`);
    return response.data;
  } catch (error) {
    console.error("News fetch error:", error);
    throw error;
  }
};

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
export type { NewsArticle };
