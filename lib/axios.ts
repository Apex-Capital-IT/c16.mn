import axios from 'axios';

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

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance; 