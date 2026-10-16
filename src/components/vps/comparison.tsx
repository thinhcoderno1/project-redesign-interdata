import { ArrowRight, Info, MessagesSquare } from "lucide-react";
import content from "@/data/vps-content.json";
import { vpsRangeServices } from "@/data/vps-service-range";
import { ComparisonRail } from "./comparison-rail";
import styles from "./comparison.module.css";

export function VpsComparison() {
  const blocks = content.comparison.blocks;
  const title = blocks.find((block) => block.tag === "h2")!.text;
  const paragraphs = blocks.filter((block) => block.tag === "p");
  const columns = content.comparison.columns.map((column) => {
    const service = vpsRangeServices.find((item) => item.id === column.key)!;
    return { ...column, href: service.href, description: service.description };
  });

  return (
    <section className={styles.section} aria-labelledby="vps-comparison-title">
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>
              {blocks.find((block) => block.tag === "span")!.text}
            </span>
            <h2 id="vps-comparison-title">
              {title.slice(0, -"InterData".length)}
              <span>InterData</span>
            </h2>
            <p>{paragraphs[0].text}</p>
          </div>
          <a className={styles.consult} href="/lien-he/">
            <MessagesSquare size={18} aria-hidden="true" />
            Liên hệ tư vấn
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        <ComparisonRail
          columns={columns}
          rows={content.comparison.rows}
          label={title}
        />
        <p className={styles.note}>
          <Info size={19} aria-hidden="true" />
          <span>{paragraphs[1].text}</span>
        </p>
      </div>
    </section>
  );
}
