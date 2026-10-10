import Image from "next/image";
import type { CSSProperties } from "react";
import { technologyPartnerGroups } from "@/data/technology-partners";
import styles from "./technology-partners.module.css";

type Partner = (typeof technologyPartnerGroups)[number]["partners"][number];
const partners = technologyPartnerGroups.flatMap<Partner>((group) => [
  ...group.partners,
]);
const sides = [
  { side: "left", partners: partners.slice(0, 10), rows: [2, 2, 2, 2, 2] },
  { side: "right", partners: partners.slice(10, 20), rows: [2, 2, 2, 2, 2] },
] as const;

function placePartners(side: (typeof sides)[number]) {
  let index = 0;
  const curve = [1, 0.55, 0, 0.55, 1];
  return side.rows.flatMap((count, row) =>
    Array.from({ length: count }, (_, column) => ({
      partner: side.partners[index++],
      row: row + 1,
      column: column + 1,
      offset: curve[row],
    })),
  );
}

export function TechnologyPartners() {
  return (
    <section
      id="doi-tac-cong-nghe"
      className={`${styles.section} section`}
      aria-labelledby="technology-partners-title"
    >
      <div className="container">
        <div className={styles.heading}>
          <span className="eyebrow">HỆ SINH THÁI CÔNG NGHỆ</span>
          <h2 id="technology-partners-title">Đối Tác Công Nghệ</h2>
          <p>Kết nối công nghệ, nền tảng và hạ tầng cùng InterData.</p>
        </div>
        <div className={styles.ecosystem}>
          <div className={styles.globe} aria-hidden="true">
            <Image
              src="/images/technology-partners/globe.svg"
              alt=""
              width={600}
              height={580}
              sizes="(max-width: 640px) 280px, (max-width: 1023px) 360px, (max-width: 1250px) 40vw, 500px"
            />
          </div>
          {sides.map((side) => (
            <ul
              key={side.side}
              className={`${styles.logos} ${styles[side.side]}`}
              aria-label={`Logo công nghệ ${side.side === "left" ? "bên trái" : "bên phải"} địa cầu`}
            >
              {placePartners(side).map(({ partner, row, column, offset }) => (
                <li
                  key={partner.name}
                  className={`${styles.tile} ${styles[partner.shape]}`}
                  style={
                    {
                      "--orbit-row": row,
                      "--orbit-column": column,
                      "--orbit-offset": offset,
                    } as CSSProperties
                  }
                >
                  <Image
                    src={`/images/technology-partners/${partner.asset}`}
                    alt={partner.name}
                    width={240}
                    height={120}
                    sizes="140px"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
