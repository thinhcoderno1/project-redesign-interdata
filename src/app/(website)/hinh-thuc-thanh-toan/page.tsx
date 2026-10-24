import { withPageSchema } from "@/components/seo/page-schema";
import { getLegalDocument } from "@/data/legal-documents";
import {
  LegalMarkdownPage,
  legalMetadata,
} from "@/components/legal/legal-markdown-page";

const document = getLegalDocument("hinh-thuc-thanh-toan");

export const metadata = legalMetadata(document);

function Page() {
  return <LegalMarkdownPage document={document} />;
}

export default withPageSchema(Page, {
  path: "/hinh-thuc-thanh-toan/",
  metadata,
});
