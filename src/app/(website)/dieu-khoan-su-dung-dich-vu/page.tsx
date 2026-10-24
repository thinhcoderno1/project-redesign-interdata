import { withPageSchema } from "@/components/seo/page-schema";
import { getLegalDocument } from "@/data/legal-documents";
import {
  LegalMarkdownPage,
  legalMetadata,
} from "@/components/legal/legal-markdown-page";

const document = getLegalDocument("dieu-khoan-su-dung-dich-vu");

export const metadata = legalMetadata(document);

function Page() {
  return <LegalMarkdownPage document={document} />;
}

export default withPageSchema(Page, {
  path: "/dieu-khoan-su-dung-dich-vu/",
  metadata,
});
