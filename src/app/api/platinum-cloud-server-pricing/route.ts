import { getPlatinumCloudProducts } from "@/lib/platinum-cloud-server-pricing";

export async function GET() {
  try {
    return Response.json({ products: await getPlatinumCloudProducts() });
  } catch {
    return Response.json(
      { error: "Platinum Cloud pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
