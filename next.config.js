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
            : "https://c16-mn.onrender.com/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
