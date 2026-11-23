import { getBestPlansRelease } from "@/lib/black-friday-best-plans";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(getBestPlansRelease(), {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}
