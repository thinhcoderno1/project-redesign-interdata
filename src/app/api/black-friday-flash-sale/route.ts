import { getBlackFridayFlashSaleRelease } from "@/lib/black-friday-flash-sale";

export const dynamic = "force-dynamic";

export function GET() {
  // Do not accept a client timestamp, or cache a response across the release time.
  return Response.json(getBlackFridayFlashSaleRelease(), {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
    },
  });
}
