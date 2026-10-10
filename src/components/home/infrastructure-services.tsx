import Image from "next/image";
import { services } from "@/data/content";
import {
  cloudCatalog,
  vpsCatalog,
  type CatalogService,
} from "@/data/service-catalog";
import { Icon } from "@/components/ui/icon";
import styles from "./infrastructure-services.module.css";

function ServiceArtwork({ serviceId }: { serviceId: string }) {
  return (
    <span className={styles.artwork} aria-hidden="true">
      <Image
        src={`/images/services-3d/${serviceId}.webp`}
        alt=""
        fill
        sizes="(max-width: 639px) 240px, (max-width: 1023px) 260px, 360px"
      />
    </span>
  );
}

function ProductCard({ service }: { service: CatalogService }) {
  return (
    <article className={styles.card} data-catalog-service={service.id}>
      <ServiceArtwork serviceId={service.id} />
      <div className={styles.cardTop}>
        <div className={styles.heading}>
          <span className={styles.platform}>{service.platform}</span>
          <h3>{service.name}</h3>
        </div>
      </div>
      <p className={styles.description}>{service.description}</p>
      <a
        href={service.href}
        className={`button ${styles.button}`}
        aria-label={`Xem dịch vụ ${service.name}`}
      >
        Xem dịch vụ <Icon name="arrow" />
      </a>
    </article>
  );
}

export function InfrastructureServices() {
  return (
    <section
      id="dich-vu"
      className={styles.catalog}
      aria-label="Dịch vụ hạ tầng"
    >
      <div className="container">
        <span className="eyebrow">DỊCH VỤ HẠ TẦNG</span>
        <section
          id="dich-vu-vps"
          className={styles.group}
          aria-labelledby="vps-catalog-title"
        >
          <header className={styles.groupHeader}>
            <div>
              <h2 id="vps-catalog-title">Dịch vụ VPS</h2>
              <p>
                Chọn nền tảng và môi trường phù hợp để vận hành website, ứng
                dụng và công cụ của bạn.
              </p>
            </div>
            <a className="text-link" href={services[0].href}>
              Xem tất cả VPS <Icon name="arrow" />
            </a>
          </header>
          <div className={styles.vpsGrid}>
            {vpsCatalog.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
        </section>
        <section
          id="dich-vu-cloud"
          className={styles.group}
          aria-labelledby="cloud-catalog-title"
        >
          <header className={styles.groupHeader}>
            <div>
              <h2 id="cloud-catalog-title">Dịch vụ Cloud Server</h2>
              <p>
                Lựa chọn dòng CPU và tài nguyên đám mây theo nhu cầu triển khai
                hệ thống.
              </p>
            </div>
            <a className="text-link" href={services[1].href}>
              Xem Cloud Server <Icon name="arrow" />
            </a>
          </header>
          <div className={styles.twoGrid}>
            {cloudCatalog.map((service) => (
              <ProductCard key={service.id} service={service} />
            ))}
          </div>
        </section>
        <section
          id="dich-vu-may-chu"
          className={styles.group}
          aria-labelledby="physical-catalog-title"
        >
          <header className={styles.groupHeader}>
            <div>
              <h2 id="physical-catalog-title">
                Dịch vụ Thuê Máy Chủ &amp; Colocation
              </h2>
              <p>
                Thuê phần cứng riêng hoặc đặt thiết bị của bạn tại datacenter.
              </p>
            </div>
          </header>
          <div className={styles.twoGrid}>
            {services.slice(2).map((service) => (
              <article
                className={`${styles.card} ${styles.physicalCard}`}
                key={service.id}
                data-catalog-service={service.id}
              >
                <ServiceArtwork serviceId={service.id} />
                <div className={styles.cardTop}>
                  <div className={styles.heading}>
                    <span className={styles.platform}>{service.type}</span>
                    <h3>
                      {service.id === "colocation"
                        ? "Colocation – Chỗ Đặt Máy Chủ"
                        : service.name}
                    </h3>
                  </div>
                </div>
                <p className={styles.description}>{service.description}</p>
                <a className={`button ${styles.button}`} href={service.href}>
                  {service.cta}
                  <Icon name="arrow" />
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
