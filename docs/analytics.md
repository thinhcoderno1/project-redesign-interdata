# GA4

Measurement ID: `G-BHY0XZSXPX`.

`src/components/analytics/google-analytics.tsx` is included once in the root layout. It uses the existing `next/script` component with `afterInteractive`: the data-layer queue is initialized before the asynchronous Google tag loads. No additional package or client-side route observer is needed.

Tracking is enabled only in production builds (`next build` / `next start`), and is omitted in `next dev`. This does not deploy or change the WordPress CMS.

## Page views

The Google tag sends the initial page view and uses GA4 Enhanced Measurement for History API changes, including Next.js client navigation and query changes. The app does not manually send extra `page_view` events.

Keep **Enhanced Measurement → Page views → Page changes based on browser history events** enabled in the GA4 web stream. Do not add a second GA snippet or a manual page-view listener for this measurement ID.

## Verification

Run `npm run build`, start a production preview on port 3100, then run:

```powershell
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100
# In a second terminal:
npm run test:analytics
```

`QA_BASE_URL` can select another preview URL. The check loads the real Google tag and verifies one page view for initial load, a Next Link navigation without a document reload, query changes, back navigation and a full reload. It also checks that the tag and configuration load once per document. All Analytics collection requests are intercepted and answered locally to avoid adding test traffic to GA4 reports. Results are saved to `artifacts/analytics/verification.json`.

References: [Next.js Script](https://nextjs.org/docs/app/api-reference/components/script), [Google Analytics SPA measurement](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [Google Analytics page views](https://developers.google.com/analytics/devguides/collection/ga4/views).
