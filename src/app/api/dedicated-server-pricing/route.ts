import { getDedicatedProducts } from "@/lib/dedicated-server-pricing";
export async function GET() {
  try {
    return Response.json({ products: await getDedicatedProducts() });
  } catch {
    return Response.json(
      { error: "Dedicated Server pricing temporarily unavailable" },
      { status: 503 },
    );
  }
}
