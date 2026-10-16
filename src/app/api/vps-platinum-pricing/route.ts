import { platinumGroups } from "@/data/vps-platinum";
import { getPlatinumProducts } from "@/lib/vps-platinum-pricing";

export async function GET(request: Request) {
  const value = new URL(request.url).searchParams.get("gid") ?? "101";
  const group = platinumGroups.find(({ gid }) => String(gid) === value);
  if (!group)
    return Response.json({ error: "Unknown Platinum group" }, { status: 400 });
  try {
    return Response.json({ products: await getPlatinumProducts(group.gid) });
  } catch {
    return Response.json(
      { error: "Platinum pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
