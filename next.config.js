/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "upload.wikimedia.org", // ✅ for fallback author image
      "unread.today", // ✅ for article images
      "c16-mn.onrender.com", // ✅ if you host images here
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://c16-mn.onrender.com/api/:path*"
            : "https://c16-mn.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
