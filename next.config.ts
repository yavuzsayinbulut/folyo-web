import type { NextConfig } from "next";

// Spring Boot API. Tarayici API'ye hep bu origin uzerinden gider; cookie ve CSRF ayni origin'de kalir, CORS gerekmez.
const apiUrl = process.env.API_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${apiUrl}/api/:path*` },
      { source: "/oauth2/:path*", destination: `${apiUrl}/oauth2/:path*` },
      { source: "/login/oauth2/:path*", destination: `${apiUrl}/login/oauth2/:path*` },
    ];
  },
};

export default nextConfig;
