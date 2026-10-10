import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

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
    </>
  );
}
