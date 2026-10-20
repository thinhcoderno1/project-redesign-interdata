import Image from "next/image";
import { ArrowRight, Layers3 } from "lucide-react";
import { cloudServices } from "@/data/cloud-server";
import styles from "./service-range.module.css";

export function CloudServiceRange() {
  return (
    <section className={styles.range} aria-labelledby="cloud-range-title">
      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.eyebrow}>
            <span>
              <Layers3 size={16} aria-hidden="true" />
              ĐA DẠNG LỰA CHỌN
            </span>
          </div>
          <h2 id="cloud-range-title">
            CÁC DÒNG CLOUD SERVER TẠI <span>INTERDATA</span>
          </h2>
          <p>
            <span>
              Hai nền tảng CPU, nhiều lựa chọn tài nguyên cho website và ứng
              dụng.
            </span>
            <span>
              Chọn nền tảng phần cứng và môi trường triển khai theo ứng dụng bạn
              cần.
            </span>
          </p>
        </div>
      </div>
      <div className={styles.cards}>
        {cloudServices.map((service) => (
          <article
            key={service.id}
            className={styles.card}
            id={`cloud-range-panel-${service.id}`}
            aria-labelledby={`cloud-range-heading-${service.id}`}
            data-cloud-service={service.id}
          >
            <Image
              src={`/images/cloud-server/${service.image}.webp`}
              alt=""
              fill
              sizes="(min-width: 1344px) 612px, (min-width: 1200px) calc((100vw - 120px) / 2), (min-width: 900px) calc((100vw - 88px) / 2), (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
              className={styles.background}
            />
            <div className={styles.cardContent}>
              <h3 id={`cloud-range-heading-${service.id}`}>{service.name}</h3>
              <p className={styles.description}>{service.description}</p>
              <a className={styles.detailLink} href={service.href}>
                Xem chi tiết{" "}
                <span className={styles.srOnly}>{service.name}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
