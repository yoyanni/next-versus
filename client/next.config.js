/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets the client import values (not just types) from ../shared
  experimental: { externalDir: true },
  // The site is a demo, so keep every page and file out of search results.
  // Don't add a robots.txt that disallows crawling instead: a crawler it
  // blocks never sees this header, and can still list the URL from links
  // (see docs/decisions/0005-noindex-header-not-robots-txt.md)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
}

module.exports = nextConfig
