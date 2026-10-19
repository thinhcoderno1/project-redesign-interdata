import Image from "next/image";
import { Building2, GraduationCap } from "lucide-react";
import { claims, partners, reviewMode } from "@/data/content";
import { WorldMap } from "./world-map";
import { ClaimNote } from "./claim-note";

export function CapacitySection({
  withBadgeIcons = false,
}: {
  withBadgeIcons?: boolean;
}) {
  const visibleClaims = claims.filter(
    (c) => reviewMode || c.status === "approved",
  );
  const capacityClaim = visibleClaims.find((c) => c.id === "business");
  return (
    <section id="nang-luc" className="capacity section">
      <WorldMap />
      <div className="container capacity-content">
        <span className="eyebrow">
          {withBadgeIcons && <Building2 size={16} aria-hidden="true" />}
          NĂNG LỰC INTERDATA
        </span>
        <h2>
          {capacityClaim?.text || "Hạ tầng cho doanh nghiệp và người dùng"}
        </h2>
        <p>
          InterData cung cấp dịch vụ máy chủ và giải pháp triển khai cho
          website, ứng dụng và hệ thống doanh nghiệp. Mỗi nhu cầu được xem xét
          theo tài nguyên và yêu cầu vận hành thực tế.
        </p>
        <div className="stat-grid">
          {visibleClaims
            .filter((c) => ["years", "customers", "servers"].includes(c.id))
            .map((c) => {
              const [number, ...label] = c.text.split(" ");
              return (
                <div key={c.id}>
                  <strong>{number}</strong>
                  <span>{label.join(" ")}</span>
                </div>
              );
            })}
        </div>
        <ClaimNote />
      </div>
    </section>
  );
}

export function EducationSection({
  title = "Cùng các trường đại học, cao đẳng",
  withBadgeIcons = false,
}: {
  title?: string;
  withBadgeIcons?: boolean;
}) {
  return (
    <section id="doi-tac" className="education section">
      <div className="container">
        <div className="education-heading">
          <span className="eyebrow">
            {withBadgeIcons && <GraduationCap size={16} aria-hidden="true" />}
            KẾT NỐI CÙNG GIÁO DỤC
          </span>
          <h2>{title}</h2>
          <p>
            Các trường được giới thiệu trong nội dung chương trình Free Hosting
            của InterData.
          </p>
        </div>
        <div className="partner-grid">
          {partners.map((p) => (
            <div key={p.asset} className="partner">
              <Image
                src={`/images/${p.asset}.webp`}
                alt={p.name}
                width={200}
                height={96}
                sizes="(max-width: 640px) 35vw, 160px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
