/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets the client import values (not just types) from ../shared
  experimental: { externalDir: true },
}

module.exports = nextConfig
