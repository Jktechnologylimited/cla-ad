/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async headers() {
    return [{
      source: "/api/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "https://cecilialearningacademy.com.ng" },
        { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
      ],
    }];
  },
};
module.exports = nextConfig;
