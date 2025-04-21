/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://c16-mn.onrender.com/api/:path*"
            : "http://localhost:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
