import { serializeSchema } from "@/lib/structured-data";

export function StructuredData({ data, id }: { data: unknown; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeSchema(data) }}
    />
  );
}
