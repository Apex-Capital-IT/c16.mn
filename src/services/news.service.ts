import axios from "axios";

const API_URL = "https://a.apex.mn/";

export interface NewsArticle {
  _id: string;
  title: string;
  description: string;
  category: string;
  newsImage: string;
  youtubeUrl?: string;
  authorName: string;
  authorImage: string;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
}

export const getNews = async (category?: string): Promise<NewsArticle[]> => {
  try {
    const url = category
      ? `${API_URL}/news?category=${encodeURIComponent(category)}`
      : `${API_URL}/news`;

    const response = await axios.get<NewsArticle[]>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};

export const getFeaturedNews = async (): Promise<NewsArticle | null> => {
  try {
    const response = await axios.get<NewsArticle>(`${API_URL}/news/featured`);
    return response.data;
  } catch (error) {
    console.error("Error fetching featured news:", error);
    throw error;
  }
};

export const searchNews = async (query: string): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get<NewsArticle[]>(
      `${API_URL}/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching news:", error);
    throw error;
  }
};
