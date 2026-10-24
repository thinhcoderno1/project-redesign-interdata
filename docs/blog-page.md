# InterData Blog

`/blog/` uses the existing website layout, Header/Footer, Be Vietnam Pro fonts and blue design tokens. The page includes a hero/search form, all API categories, featured and newest posts, popular guides, News/Events, Promotions and Careers. Search, category filtering and pagination use shareable query parameters (`q`, `category`, `page`) and render on the server.

## Source and caching

- Public WordPress REST API: `https://interdata.vn/blog/wp-json/wp/v2/`.
- Posts and nonempty categories are discovered from the API; category IDs and article records are not hardcoded. Category filters include descendants. Popular guides use this installation's supported `orderby=post_views`, search for “hướng dẫn”, and exclude News, Promotions and Careers.
- Published posts only. Requests have a 15-second timeout and 300-second Next.js data cache/revalidation. Independent blog sections stream into their own Suspense boundaries.
- An API failure shows a retry state; an empty search shows an empty-results state. Source outages are distinct from missing posts. Protected or unpublished content is never displayed.

## Single posts

`/blog/[slug]/` renders published articles on demand with five-minute revalidation. Includes title, categories, author, Vietnam-local dates, estimated reading time and related posts. The article frame follows the supplied `khung-html.md`: opening copy, blue left-bordered H2s, existing CTA panels, FAQ and conclusion treatments, and the source disclaimer when present. The source's manual TOC is replaced to avoid duplication. Text, links, images, tables and commands remain sourced from the original article; no placeholder copy, writing instructions, additional FAQs or marketing claims are generated. `docs/blog-post-template.html` archives the supplied frame with all HTML comments removed.

The featured image is hidden on single posts; images within the article and social-sharing image metadata are retained. The H2 table of contents sits at the top of the left sticky sidebar, above its existing service CTA. The sidebar has its own scrolling area for long contents lists. Below 960px, the TOC appears above the article in a single column.

`sanitize-html` filters incoming HTML and removes HTML comments, scripts, styles, event handlers and unsafe URLs. `htmlparser2` extracts headings and applies presentation wrappers to existing content. A small allowlist retains source service-carousel markup with scoped styling; React handles its scrolling controls without executing source inline scripts. It remains horizontally scrollable without JavaScript. Source text is compared with rendered text during verification. Tables, lists, code and approved YouTube/Vimeo embeds retain responsive formatting.

Canonical/Open Graph metadata and BlogPosting JSON-LD are generated from the source article. The project's existing preview noindex setting remains inherited. Missing articles use Next.js `notFound()` and a custom empty page; Next.js may return an HTTP 200 shell for streamed not-found responses, with noindex metadata.

Blog links from shared navigation, homepage resource feeds and article content point to local routes. Existing one-segment category URLs such as `/blog/tuyen-dung/` redirect to their local category view. Uploads and third-party references retain their source URLs. Featured images use the existing trusted Next Image host configuration, with a visual fallback when unavailable.

## Verification

```powershell
npm run test:blog:data
npm run test:blog
npm run test:resources:data
npm run typecheck
npm run build
```

The data check covers query contracts, descendant categories, published/protected posts, source failures, empty pages, sanitization, internal links and TOC anchors. The browser check covers actual API articles, form search, categories, pagination, old category links, single posts, missing posts, JSON-LD, server rendering without JavaScript, widths 320–1920px and Axe WCAG A/AA. Screenshots and results are saved under ignored `artifacts/blog/`. Set `QA_BASE_URL` for a different server.
