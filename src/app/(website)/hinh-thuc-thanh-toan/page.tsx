import { getLegalDocument } from "@/data/legal-documents";
import {
  LegalMarkdownPage,
  legalMetadata,
} from "@/components/legal/legal-markdown-page";

const document = getLegalDocument("hinh-thuc-thanh-toan");

export const metadata = legalMetadata(document);

export default function Page() {
  return <LegalMarkdownPage document={document} />;
}
