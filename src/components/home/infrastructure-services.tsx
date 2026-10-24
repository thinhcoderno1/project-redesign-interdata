import Image from "next/image";
import { Cloud, Server, type LucideIcon } from "lucide-react";
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

function ServerRackIcon() {
  return (
    <svg
      className={styles.titleIcon}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M5 8h14M5 14h14M8 5h4M8 11h4M8 17h4" />
      <circle cx="16" cy="5" r="0.5" />
      <circle cx="16" cy="11" r="0.5" />
      <circle cx="16" cy="17" r="0.5" />
    </svg>
  );
}

function ProductCard({
  service,
  icon: ServiceIcon,
}: {
  service: CatalogService;
  icon: LucideIcon;
}) {
  return (
    <article className={styles.card} data-catalog-service={service.id}>
      <ServiceArtwork serviceId={service.id} />
      <div className={styles.cardTop}>
        <div className={styles.heading}>
          <span className={styles.platform}>{service.platform}</span>
          <h3>
            <ServiceIcon
              className={styles.titleIcon}
              size={24}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            <span>{service.name}</span>
          </h3>
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
        <span className="eyebrow">
          <Icon name="server" />
          DỊCH VỤ HẠ TẦNG
        </span>
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
              <ProductCard key={service.id} service={service} icon={Server} />
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
              <ProductCard key={service.id} service={service} icon={Cloud} />
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
                      <ServerRackIcon />
                      <span>
                        {service.id === "colocation"
                          ? "Colocation – Chỗ Đặt Máy Chủ"
                          : service.name}
                      </span>
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
