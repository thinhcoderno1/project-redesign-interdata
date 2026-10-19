import { getVibePlans } from "@/lib/vps-vibe-coding-pricing";

export async function GET() {
  try {
    return Response.json(
      { plans: await getVibePlans() },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return Response.json({ error: "Pricing unavailable" }, { status: 503 });
  }
}
