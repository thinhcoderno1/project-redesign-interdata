import type { Metadata } from "next";
import type { ComponentType } from "react";
import { pageProfile, schemaServices } from "@/data/schema-pages";
import { absoluteUrl, buildPageSchema, schemaIds } from "@/lib/structured-data";
import { StructuredData } from "./structured-data";

type Options = { path: string; metadata: Metadata };

export function PageSchema({ path, metadata }: Options) {
  const profile = pageProfile(path);
  if (profile.service && metadata.description)
    profile.service.description = metadata.description;
  const data = buildPageSchema({ path, metadata, profile });
  if (path === "/") {
    data["@graph"][0].mentions = { "@id": `${absoluteUrl("/")}#services` };
    data["@graph"].push({
      "@type": "ItemList",
      "@id": `${absoluteUrl("/")}#services`,
      name: "Dịch vụ và giải pháp InterData",
      numberOfItems: schemaServices.length,
      itemListElement: schemaServices.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.name,
        url: absoluteUrl(service.href),
        item: {
          "@type": "Service",
          "@id": `${absoluteUrl(service.href)}#service`,
          name: service.name,
          url: absoluteUrl(service.href),
          provider: { "@id": schemaIds.organization },
        },
      })),
    });
  }
  return <StructuredData id="page-structured-data" data={data} />;
}

/** Wrap Server Component routes without relying on client-side pathname effects. */
export function withPageSchema<Props extends object>(
  Page: ComponentType<Props>,
  options: Options,
) {
  return function PageWithSchema(props: Props) {
    return (
      <>
        <Page {...props} />
        <PageSchema {...options} />
      </>
    );
  };
}
