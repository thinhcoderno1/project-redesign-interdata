import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { StructuredData } from "@/components/seo/structured-data";
import { buildSiteSchema } from "@/lib/structured-data";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div id="trang-chu" aria-hidden="true" />
      <Navigation />
      {children}
      <Footer />
      <StructuredData id="site-structured-data" data={buildSiteSchema()} />
    </>
  );
}
