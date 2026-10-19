import { n8nServices, type N8nGid } from "@/data/vps-n8n";
import { getN8nProducts } from "@/lib/vps-n8n-pricing";
export async function GET(request: Request) {
  const gid = Number(new URL(request.url).searchParams.get("gid"));
  if (!n8nServices.some((service) => service.gid === gid))
    return Response.json({ error: "Unknown VPS service" }, { status: 400 });
  try {
    return Response.json({
      gid,
      products: await getN8nProducts(gid as N8nGid),
    });
  } catch {
    return Response.json(
      { error: "VPS pricing temporarily unavailable" },
      { status: 502 },
    );
  }
}
