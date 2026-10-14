import Image from "next/image";
import { ArrowRight } from "lucide-react";
import content from "@/data/vps-content.json";
import { vpsUseCases } from "@/data/vps-use-cases";
import styles from "./use-cases.module.css";

export function UseCases() {
  const header = content.landing.headers.UseCases;

  return (
    <section className={styles.useCases} aria-labelledby={header.id}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>ỨNG DỤNG THỰC TẾ</span>
          <h2 id={header.id}><span>VPS</span> Dùng Để Làm Gì?</h2>
          <p>{header.text}</p>
        </div>
        <div className={styles.grid}>
          {vpsUseCases.map((item) => (
            <article className={styles.card} key={item.image}>
              <div className={styles.illustration}>
                <Image
                  src={`/images/vps/use-cases-v2/${item.image}.webp`}
                  alt=""
                  width={900}
                  height={600}
                  sizes="(min-width: 1536px) 420px, (min-width: 1100px) 30vw, (min-width: 700px) 44vw, 90vw"
                />
              </div>
              <div className={styles.body}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a href={item.href}>
                  Tìm hiểu thêm
                  <span className="sr-only"> về {item.title.toLowerCase()}</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
