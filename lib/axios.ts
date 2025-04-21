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

export interface Author {
  _id: string;
  authorName: string;
  authorImage: string;
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
    newsImage:
      "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    authorName: "Admin",
    authorImage:
      "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    publishedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "fallback-2",
    title: "Another Sample News Article",
    description: "This is another sample news article for build time.",
    category: "Technology",
    newsImage:
      "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    authorName: "Admin",
    authorImage:
      "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    publishedDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Sample fallback data for authors
export const fallbackAuthorData: Author[] = [
  {
    _id: "fallback-author-1",
    authorName: "Admin",
    authorImage:
      "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "fallback-author-2",
    authorName: "John Doe",
    authorImage:
      "https://unread.today/files/007afc64-288a-4208-b9d7-3eda84011c1d/6b14a94472c91bd94f086dac96694c79.jpeg",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://c16-mn.onrender.com",
  timeout: 40000, // 40 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // During build time, return fallback data instead of throwing an error
    if (
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PHASE === "phase-production-build"
    ) {
      console.warn("Using fallback data during build process");
      return Promise.resolve({ data: fallbackNewsData });
    }

    // Log the error for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });

    // Handle specific error cases
    if (error.response?.status === 508) {
      console.error("Loop detected in API request. Check your API configuration.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
