import { getLinuxProducts } from "@/lib/vps-linux-pricing";

export async function GET() {
  try {
    return Response.json({ products: await getLinuxProducts() });
  } catch {
    return Response.json(
      { error: "Linux pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
