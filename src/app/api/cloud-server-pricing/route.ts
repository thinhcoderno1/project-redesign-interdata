import { cloudGids } from "@/data/cloud-server";
import { getCloudProducts } from "@/lib/cloud-server-pricing";

export async function GET(request: Request) {
  const gid = Number(new URL(request.url).searchParams.get("gid"));
  if (!Number.isInteger(gid) || !cloudGids.includes(gid))
    return Response.json(
      { error: "Unknown Cloud Server group" },
      { status: 400 },
    );
  try {
    return Response.json({ products: await getCloudProducts(gid) });
  } catch {
    return Response.json(
      { error: "Pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
