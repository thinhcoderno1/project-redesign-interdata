import { getAmdProducts } from "@/lib/vps-amd-pricing";

export async function GET() {
  try {
    return Response.json({ products: await getAmdProducts() });
  } catch {
    return Response.json(
      { error: "AMD pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
