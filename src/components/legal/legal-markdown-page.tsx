import type { Metadata } from "next";
import type { LegalDocument } from "@/data/legal-documents";
import { renderLegalDocument } from "@/lib/legal-markdown";
import { LegalDocumentLayout } from "./legal-document-layout";

export function legalMetadata(document: LegalDocument): Metadata {
  const { description } = renderLegalDocument(document);
  const title = `${document.label} | InterData`;
  const url = `https://interdata.vn/${document.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "InterData",
      locale: "vi_VN",
      type: "website",
    },
  };
}

export function LegalMarkdownPage({ document }: { document: LegalDocument }) {
  const { title, sections, html } = renderLegalDocument(document);
  return (
    <LegalDocumentLayout
      title={title}
      label={document.label}
      sections={sections}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </LegalDocumentLayout>
  );
}
