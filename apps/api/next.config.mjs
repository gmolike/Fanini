// apps/api/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@faninitiative/shared"],

  // Wichtig für Path Aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": new URL("./src", import.meta.url).pathname,
      "@/domain": new URL("./src/domain", import.meta.url).pathname,
      "@/application": new URL("./src/application", import.meta.url).pathname,
      "@/infrastructure": new URL("./src/infrastructure", import.meta.url)
        .pathname,
      "@/presentation": new URL("./src/presentation", import.meta.url).pathname,
    };
    return config;
  },

  // API Routes only - kein Frontend
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },

  // CORS Headers für API
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3001", // Frontend URL
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
