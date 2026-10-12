import { getLegalDocument } from "@/data/legal-documents";
import {
  LegalMarkdownPage,
  legalMetadata,
} from "@/components/legal/legal-markdown-page";

const document = getLegalDocument("quy-dinh-doi-tra-va-hoan-tien");

export const metadata = legalMetadata(document);

export default function Page() {
  return <LegalMarkdownPage document={document} />;
}
