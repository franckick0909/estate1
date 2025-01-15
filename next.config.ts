import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.pexels.com', 'via.placeholder.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        pathname: '/dldrwtewc/image/upload/**',
      },
    ],
  },
};

export default nextConfig;
