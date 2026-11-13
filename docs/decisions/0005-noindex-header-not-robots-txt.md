# 0005. Keep the site out of search engines with `X-Robots-Tag`, not `robots.txt`

- Status: Accepted
- Date: 2026-11-13

## Context

- The site is a demo. Its pages, and the API's JSON, shouldn't show up in search results.
- A `robots.txt` with `Disallow: /` only stops crawling, not indexing. A search engine can still list a disallowed URL it finds through links elsewhere, with no title or snippet. It also can't fetch the page, so it never sees a `noindex` on it.
- A `noindex` in a `<meta name="robots">` tag covers only HTML pages, and only once the page has been fetched.

## Decision

- Every response gets the header `X-Robots-Tag: noindex, nofollow`:
  - **Client:** `headers()` in `client/next.config.js`, with `source: "/:path*"`. That covers pages, `public/` files and `_next/` assets, and Vercel applies it.
  - **API:** a middleware at the top of `server/src/app.ts`, before every route, `/health` included.
- There's no `robots.txt`, so crawlers can fetch any URL and see the header.

## Consequences

- Nothing from the site or the API gets indexed, and anything already indexed drops out the next time it's crawled.
- Crawlers still fetch pages. That's cheap: the client is on Vercel, and the API's reads aren't rate limited but are small apart from `GET /api/fighters`.
- To make the site public later, remove both and don't add a `robots.txt` disallow in their place.
