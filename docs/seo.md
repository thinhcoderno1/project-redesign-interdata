# Crawl and indexing

Public pages inherit `index, follow` from the root layout, with large image previews and unrestricted snippet/video preview lengths for Googlebot. This policy is independent of `NEXT_PUBLIC_CONTENT_MODE`; the content-review flag still controls which editorial material is displayed.

`/robots.txt` allows all user agents to crawl `/` and points to `https://interdata.vn/sitemap.xml`. Assets and public APIs are not blocked. Internal review pages remain crawlable so crawlers can read their `noindex` directive.

Exceptions:

- `/content-review/`: `noindex, nofollow`.
- Nonempty `/blog/?q=...` searches: `noindex, follow`.
- Missing pages: Next.js `notFound()` emits `noindex`.

Canonical URLs remain on `https://interdata.vn/`, including blog posts fetched from `admin.interdata.vn`. Blog pagination has its own canonical URL; `page=1`, tracking parameters and unused query parameters are removed from the canonical. Search/category state is preserved when relevant. Existing URL redirects remain unchanged.

## Sharing images

The default OG image is the supplied 800 × 800 PNG at `/images/og/interdata.png`, configured in `src/lib/social-image.ts`. Routes with their own Open Graph objects explicitly reuse that descriptor because Next.js replaces nested metadata rather than deep-merging it. Twitter cards use the same image. Black Friday retains its own `/images/black-friday/og-image.png`. Blog articles use their first valid content image, then their featured image or the default brand image when no content image exists.

## Sitemap

The native Next.js sitemap includes all public static routes, discovered from the same service, solution and legal-document collections used by the site, plus every published, unprotected WordPress post. It does not list API endpoints, internal review pages, search results, tracking URLs or redirect aliases.

WordPress pages are fetched in groups of 100 with at most four concurrent requests and hourly revalidation. Only slim post metadata is requested. Blog `lastmod` uses the CMS modification time; static pages omit `lastmod` because there is no trustworthy per-page modification date. Duplicate and malformed entries are omitted. A source outage throws rather than publishing an incomplete sitemap; an existing ISR response can remain available while regeneration retries. The generator rejects more than 499 CMS pages so a future site exceeding one sitemap's capacity must be split instead of silently truncated.

## Verification

`npm run test:seo:data` checks route coverage, robots policy, CMS pagination, drafts/protected posts, duplicate entries, dates and source failures. After `npm run build` and starting a production preview on port 3100, run `npm run test:seo` (`QA_BASE_URL` can override the preview). This HTTP-only test checks every public static route, a blog post, search/review/missing-page exclusions, canonicals, robots.txt, sitemap XML and blocking HTTP headers without executing GA4 or sending test visits. Results are saved under `artifacts/seo/`.

Deploy the Next.js application for these changes to affect the live domain. Then submit `https://interdata.vn/sitemap.xml` in Google Search Console and inspect live URLs. This code does not change Cloudflare, reverse-proxy bot controls or WordPress indexing settings.

References: [Google robots meta directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
