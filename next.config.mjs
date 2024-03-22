// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.vercel.com",
        port: "",
        pathname: "/image/upload/**",
      },
      {
        // Add this new pattern for your specific hostname
        protocol: "https",
        hostname: "a5rdvjikdjq8hcsq.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**", // Adjust this pathname pattern as necessary
      },
    ],
  },
};

export default nextConfig;
