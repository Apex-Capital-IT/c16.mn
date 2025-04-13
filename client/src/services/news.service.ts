import axios from "axios";

const API_URL = "http://localhost:3000/api";

export interface News {
  _id: string;
  title: string;
  content: string;
  category: string;
  image?: string;
  createdAt: string;
}

export const createNews = async (newsData: Omit<News, "_id" | "createdAt">) => {
  const response = await axios.post(`${API_URL}/news`, newsData);
  return response.data;
};

export const getNews = async () => {
  const response = await axios.get(`${API_URL}/news`);
  return response.data;
}; 