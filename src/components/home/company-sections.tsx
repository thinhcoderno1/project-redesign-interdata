import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { partners } from "@/data/content";

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
