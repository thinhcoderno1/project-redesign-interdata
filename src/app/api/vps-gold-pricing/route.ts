import { getGoldProducts } from "@/lib/vps-gold-pricing";

export async function GET() {
  try {
    return Response.json({ products: await getGoldProducts() });
  } catch {
    return Response.json(
      { error: "Gold pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
