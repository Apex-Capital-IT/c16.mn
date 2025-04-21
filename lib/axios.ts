import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://c16-mn.onrender.com";

interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  newsImage: string;
  authorName: string;
  authorImage: string;
  banner: boolean;
  slug: string;
  publishedDate: string;
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

export const fallbackNewsData: NewsArticle[] = [
  {
    _id: "1",
    title: "Монгол Улсын эдийн засгийн төлөв байдал",
    description: "Монгол Улсын эдийн засгийн сүүлийн үеийн мэдээллийн тойм",
    content: "Дэлгэрэнгүй агуулга...",
    category: "Эдийн засгийн мэдээ",
    newsImage: "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    authorName: "Б.Болд",
    authorImage: "/authors/author1.jpg",
    banner: true,
    slug: "mongol-ulsyn-ediin-zasgiin-tolov-baidal",
    publishedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
export type { NewsArticle };
