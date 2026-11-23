# InterData Blog

`/blog/` uses the existing website layout, Header/Footer, Be Vietnam Pro fonts and blue design tokens. The page includes a hero/search form, all API categories, featured and newest posts, latest guides, News/Events, Promotions and Careers. Search, category filtering and pagination use shareable query parameters (`q`, `category`, `page`) and render on the server.

The featured section pairs one large image-led article with a titled list of three smaller articles on a pale InterData blue surface. Category badges and publication dates use live post data; each article has one full-card link. Below 960px the lead and list stack vertically. The unfiltered index requests ten posts: four featured, followed by six newest posts without repeating featured articles. Search and paginated views retain twelve posts per page.

## Source and caching

- Public WordPress REST API: `https://admin.interdata.vn/wp-json/wp/v2/`, configured in `src/lib/blog-source.ts` for both the blog and homepage resource feeds.
- Posts and nonempty categories are discovered from the API; category IDs and article records are not hardcoded. Category filters include descendants. “Hướng dẫn phổ biến” uses eight editorially selected article slugs from `popularGuideSlugs` in `src/data/blog.ts`, in the order requested by the user. Titles, images, dates and links still come from the CMS. A single published-post query fetches the selection, then restores the configured order; missing or unpublished articles are omitted without substituting unrelated posts. This is an editorial selection rather than a ranking by traffic. The new CMS does not support `orderby=post_views`.
- Published posts only. Requests have a 15-second timeout and 300-second Next.js data cache/revalidation. Independent blog sections stream into their own Suspense boundaries.
- An API failure shows a retry state; an empty search shows an empty-results state. Source outages are distinct from missing posts. Protected or unpublished content is never displayed.

## Single posts

The blog listing and articles use the same Black Friday 2026 banner as the homepage. `src/data/promotions.ts` defines the shared artwork, destination and analytics name. Each blog page request renders one banner, with placement weights of 60% early, 30% middle and 10% end. The listing places it after featured posts, after the latest section or before the bottom CTA; filtered/search/paginated listings insert it after 3 cards, 6 cards or the final card. Short result sets cap the insertion to their actual length. Article positions are after the opening, at a safe section boundary near the middle or after the body. Posts without a safe middle boundary redistribute that weight to early/end. HTML blocks, paragraphs, tables, code and source headings remain intact.

`getBlogPromotionPlacement()` uses Next.js `connection()` so the choice occurs at request time, without hydration randomization or moving a banner after first paint. CMS fetches retain their five-minute cache, while article HTML is rendered per request. Native links and the server-rendered banner work without JavaScript. The banner is labelled as an InterData offer, preserves its full 5:1 image ratio and includes a readable campaign title/CTA on small screens. It does not appear in the shared navigation or outside blog routes.

The client component queues `view_promotion` and `select_promotion` on the existing GTM `dataLayer`. An impression requires a loaded image, an active tab and at least 50% of the unit visible continuously for one second, once per banner mount; native clicks (including middle-clicks) queue selection events. Payloads include `ecommerce.promotion_id`, `promotion_name`, `creative_name`, `creative_slot` (e.g. `blog_article_early`) and `page_path` without query strings. To report CTR, configure the existing GTM container to forward these events to GA4 and compare selections/views by slot; this change does not modify or publish GTM configuration.

`/blog/[slug]/` renders published articles per request using the five-minute CMS data cache. Includes title, categories, author, Vietnam-local dates, estimated reading time and related posts. The article frame follows the supplied `khung-html.md`: opening copy, blue left-bordered H2s, existing CTA panels, FAQ and conclusion treatments, and the source disclaimer when present. The source's manual TOC is replaced to avoid duplication. Text, links, images, tables and commands remain sourced from the original article; no placeholder copy, writing instructions, additional FAQs or marketing claims are generated. `docs/blog-post-template.html` archives the supplied frame with all HTML comments removed.

The featured image is hidden on single posts; images within the article are retained. Article OG/Twitter previews use the first valid image in the article HTML, including lazy-loaded image URLs. If the article has no image, previews fall back to its featured image, then the shared InterData brand image. BlogPosting JSON-LD retains the source featured image. The H2 table of contents sits at the top of the left sticky sidebar, above its existing service CTA. The sidebar has its own scrolling area for long contents lists. Below 960px, the TOC appears above the article in a single column.

`sanitize-html` filters incoming HTML and removes HTML comments, scripts, style elements, event handlers and unsafe URLs. `htmlparser2` extracts headings and applies presentation wrappers to existing content. CTA panels with styled InterData service, campaign or support buttons retain allowlisted inline presentation (colors, gradients, borders, spacing, typography and flex layout). Inline styles outside these detected panels are removed; CSS URLs, positioning, transforms and custom properties are rejected. Local CTA fallback styles do not override the source designs, and mobile rules stack columns and constrain widths. A small allowlist retains source service-carousel markup with scoped styling; React handles its scrolling controls without executing source inline scripts. It remains horizontally scrollable without JavaScript. Source text is compared with rendered text during verification. Tables, lists, code and approved YouTube/Vimeo embeds retain responsive formatting.

Canonical/Open Graph metadata and BlogPosting JSON-LD are generated from the source article. Public articles inherit index/follow. Internal search results and the review page use noindex; canonical URLs and sitemap behavior are documented in `docs/seo.md`. Missing articles use Next.js `notFound()` and a custom empty page; Next.js may return an HTTP 200 shell for streamed not-found responses, with noindex metadata.

Blog links from shared navigation, homepage resource feeds and article content point to local routes. CMS permalinks such as `https://admin.interdata.vn/post/` become `/blog/post/`; CMS category archives become local category filters. Existing one-segment category URLs such as `/blog/tuyen-dung/` redirect to their local category view. Canonical article URLs remain on `https://interdata.vn/blog/`. Uploads and third-party references retain their source URLs; relative article images resolve against the CMS origin. Featured images allow HTTPS uploads from `admin.interdata.vn/wp-content/uploads/` and legacy `interdata.vn/blog/wp-content/uploads/`, with a visual fallback when unavailable. CMS management endpoints are not rewritten into article links.

## Service UX Blocks

The current Flatsome service offer block (`interdata-bf26-*`) is adapted to the existing `interdata-plan-*` carousel markup by `src/lib/blog-plans.ts`. Titles, prices, badges, specifications and registration URLs remain sourced from the rendered WordPress API response. Its design is maintained locally under the `bf26` theme marker; source style elements, inline handlers and SVG are not executed or permitted. Known decorative icons use local SVG masks. Heading and badge reds have sufficient contrast for small text.

The block displays three cards above 800px, two at 481–800px and one up to 480px. Native horizontal scrolling supports touch and keyboard; React buttons move between pages, wrap at the ends and become disabled when all plans fit. Controls are scoped per block and reinitialize after article navigation. The legacy unprefixed carousel remains supported. Other UX Block templates need their own markup adapter and scoped styles rather than loading the whole WordPress theme.

The browser check verifies actual API plans and links, responsive card counts, local icons, navigation controls and accessibility. It also isolates the rendered block in a JavaScript-disabled document to verify native keyboard scrolling; the article route's existing Suspense streaming still requires JavaScript to reveal its completed page.

## Verification

```powershell
npm run test:blog:data
npm run test:blog
node scripts/verify-blog-promotions.mjs
npm run test:resources:data
npm run typecheck
npm run build
```

The data check covers query contracts, descendant categories, published/protected posts, source failures, empty pages, sanitization, internal links and TOC anchors. The browser check covers actual API articles, form search, categories, pagination, old category links, single posts, missing posts, JSON-LD, server rendering without JavaScript, widths 320–1920px and Axe WCAG A/AA. Screenshots and results are saved under ignored `artifacts/blog/`. Set `QA_BASE_URL` for a different server.
