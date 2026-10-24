export function schemaNodes(values) {
  return values.flatMap((value) => {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) return schemaNodes(parsed);
    if (parsed?.["@graph"]) return schemaNodes(parsed["@graph"]);
    return parsed?.["@type"] ? [parsed] : [];
  });
}

export async function readSchemaNodes(page) {
  return schemaNodes(
    await page.locator('script[type="application/ld+json"]').allTextContents(),
  );
}
