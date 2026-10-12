import { getVpsProducts } from "@/lib/vps-pricing";
import { pricingGids } from "@/data/vps-pricing";

export async function GET(request: Request) {
  const gid = Number(new URL(request.url).searchParams.get("gid"));
  if (!Number.isInteger(gid) || !pricingGids.includes(gid))
    return Response.json({ error: "Unknown VPS group" }, { status: 400 });
  try {
    return Response.json({ products: await getVpsProducts(gid) });
  } catch {
    return Response.json(
      { error: "Pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
