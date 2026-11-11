# Google Tag Manager

Container ID: `GTM-W5ST9ZZQ`.

`src/components/analytics/google-tag-manager.tsx` is included once at the start of the root layout's body. The standard GTM bootstrap uses `next/script` with `afterInteractive`; it preserves an existing `window.dataLayer`, queues `gtm.js`, and loads the container asynchronously. Next.js keeps the script initialized across client-side navigation. No additional package is required.

The hidden `noscript` iframe appears before application content for browsers with JavaScript disabled. Next.js may prepend its own hidden streaming boundary. Tracking is enabled only in production (`next build` / `next start`), and omitted in `next dev`.

## GA4 and navigation

GA4 is managed inside the user's GTM container. The previous direct GA4 installation was removed. The application does not load `gtag.js` separately, configure a GA4 measurement ID, or manually send `page_view` or route-change events. Page-view behavior and other tags remain controlled by the published GTM/GA4 configuration.

## Verification

Run `npm run build`, start a production preview on port 3100, then run:

```powershell
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3100
# In a second terminal:
npm run test:analytics
```

`QA_BASE_URL` can select another production preview URL. The check intercepts the GTM container and no-JavaScript iframe with local fixtures, so no container tags execute or send QA traffic. It verifies one asynchronous container load per document, one bootstrap event, preservation of the existing data layer, Next Link navigation, query changes, back navigation, reload, absence of direct GA4 scripts, and the no-JavaScript fallback placement. Results are saved to `artifacts/analytics/verification.json`.

This verifies the website integration, not the tags configured in the GTM account. Use GTM Preview / Tag Assistant on the deployed website to inspect those tags.

References: [Next.js Script](https://nextjs.org/docs/app/api-reference/components/script), [Google Tag Manager installation](https://support.google.com/tagmanager/answer/14847097), [Google data layer](https://developers.google.com/tag-platform/tag-manager/datalayer).
