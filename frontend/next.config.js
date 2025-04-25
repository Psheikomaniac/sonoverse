/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable CSS modules
  cssModules: true,
  // Configure CSS handling
  webpack(config) {
    return config;
  },
}

module.exports = nextConfig