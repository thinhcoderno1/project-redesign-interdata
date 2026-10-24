import { withPageSchema } from "@/components/seo/page-schema";
import { getLegalDocument } from "@/data/legal-documents";
import {
  LegalMarkdownPage,
  legalMetadata,
} from "@/components/legal/legal-markdown-page";

const document = getLegalDocument("huong-dan-thanh-toan-vnpay");

export const metadata = legalMetadata(document);

function Page() {
  return <LegalMarkdownPage document={document} />;
}

export default withPageSchema(Page, {
  path: "/huong-dan-thanh-toan-vnpay/",
  metadata,
});
