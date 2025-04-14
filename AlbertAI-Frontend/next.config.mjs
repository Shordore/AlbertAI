/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // API configuration
  env: {
    BACKEND_API_URL: 'http://localhost:5000',
  },
  // Fix the 404 issues with chunks
  webpack: (config) => {
    config.optimization.moduleIds = "deterministic";
    config.optimization.runtimeChunk = { name: "runtime" };
    config.optimization.splitChunks = {
      cacheGroups: {
        framework: {
          name: "framework",
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
          priority: 40,
          chunks: "all",
          enforce: true,
        },
        commons: {
          name: "commons",
          minChunks: 2,
          priority: 20,
          chunks: "all",
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
};

export default nextConfig;
