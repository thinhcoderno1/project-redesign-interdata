# S3 Object Storage

- Route: `/s3-object-storage/`
- Reference design: `/thue-vps/`; reuse its CSS Modules, illustration cards,
  carousel behavior, infrastructure rows, comparison table, company sections and CTA.
- Server-rendered content: `src/components/s3-object-storage/s3-object-storage-page.tsx`.
- Local carousel: `src/components/s3-object-storage/s3-scenarios.tsx`.
- Content and options: `src/data/s3-object-storage.ts`.
- Local styles: `src/components/s3-object-storage/s3-object-storage.module.css`.
- Original bucket illustration: `public/images/s3-object-storage/object-storage.svg`.
- Generated S3 hero: `public/images/s3-object-storage/hero-object-storage-v1.webp`;
  generation prompt and provenance: `docs/s3-object-storage-hero-image-prompt.json`.
- Reuse the VPS use-case illustrations and infrastructure images.
- Three generated option backgrounds are stored in `public/images/s3-object-storage/`
  as `option-application-media-v1.webp`, `option-backup-storage-v1.webp` and
  `option-dedicated-infrastructure-v1.webp`. Prompts:
  `docs/s3-object-storage-option-image-prompts.json`.
- `solutions` entry `s3` links navigation and the homepage carousel to this route.
  Existing footer section links are retained.

## Commercial scope

Three proposed options: Application & Media, Backup & Storage, Dedicated Infrastructure.
No prices, billing cycles, checkout URLs, capacity quotas, SLA, durability figures,
or priced Offer/Product schema. Each option links to `/lien-he/`.
No demonstration labels, approval status or internal commercial notes in the UI.
Do not imply all AWS features, a particular storage implementation, data location,
CDN, Object Lock, encryption at rest, or managed operations are included by default.
Confirm the chosen implementation and commercial scope before adding commitments.
Inherited root robots settings remain unchanged.

## Technical references reviewed 2026-10-22

- [Amazon S3 concepts and use cases](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [Object versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)
- [Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html)
- [Ceph S3 API feature matrix](https://docs.ceph.com/en/latest/radosgw/s3/)

These explain storage concepts, not InterData entitlements. Ceph is an example of
API compatibility differences, not a claim that this solution runs on Ceph.

## Validation

```powershell
npm run dev
npm run test:s3-object-storage
npm run lint
npm run build
```

Browser checks cover nine viewports from 320 to 1920px, loaded images, overflow,
three unpriced contact options, keyboard and touch carousel interaction, FAQ,
metadata/schema, no-JavaScript fallback, reduced motion, navigation and automated
WCAG A/AA rules. Evidence is saved under `artifacts/s3-object-storage/`.

For production QA, start the built app on a separate port, then set
`TEST_BASE_URL` and optionally `TEST_ARTIFACT_DIR` before running the browser check.
Local validation does not constitute deployment or an active storage endpoint.

Verified locally on 2026-10-22: ESLint, formatting and `npm run build` passed.
The production browser run passed all nine viewports, keyboard/touch interaction,
mobile/desktop navigation, no-JavaScript rendering and reduced motion, with no
runtime errors or automated WCAG A/AA violations. Full result:
`artifacts/s3-object-storage/production/results.json`.
VPS source and the previous VMware H1 change were preserved.
