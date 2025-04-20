/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://c16-mn.onrender.com/api/:path*'
          : 'http://localhost:8000/api/:path*',
      },
    ];
  },
  // Set the port for production
  env: {
    PORT: process.env.PORT || 3000,
  },
};

module.exports = nextConfig; 