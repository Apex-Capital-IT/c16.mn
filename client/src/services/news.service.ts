import axios from "axios";

const API_URL = "http://https://c16-mn.onrender.com/api";

export interface News {
  _id: string;
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

export const createNews = async (formData: FormData) => {
  const response = await axios.post(`${API_URL}/create/news`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getNews = async () => {
  const response = await axios.get(`${API_URL}/news`);
  return response.data;
};
