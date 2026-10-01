/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "upload.wikimedia.org",
      "unread.today",
      "picsum.photos",
      "i.pravatar.cc",
    ],
  },
};

module.exports = nextConfig;
