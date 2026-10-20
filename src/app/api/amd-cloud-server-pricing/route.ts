import { getAmdCloudProducts } from "@/lib/amd-cloud-server-pricing";

export async function GET() {
  try {
    return Response.json({ products: await getAmdCloudProducts() });
  } catch {
    return Response.json(
      { error: "AMD Cloud pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
