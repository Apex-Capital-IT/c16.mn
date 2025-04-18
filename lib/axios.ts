import axios from "axios";

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

// Sample fallback data for build time
export const fallbackNewsData: NewsArticle[] = [
  {
    _id: "fallback-1",
    title: "Sample News Article",
    description: "This is a sample news article for build time.",
    category: "General",
    newsImage: "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    authorName: "Admin",
    authorImage: "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    publishedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "fallback-2",
    title: "Another Sample News Article",
    description: "This is another sample news article for build time.",
    category: "Technology",
    newsImage: "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    authorName: "Admin",
    authorImage: "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    publishedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 5 second timeout
});

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // During build time, return fallback data instead of throwing an error
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('Using fallback data during build process');
      return Promise.resolve({ data: fallbackNewsData });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
