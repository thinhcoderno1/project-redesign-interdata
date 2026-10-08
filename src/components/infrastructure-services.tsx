import { services } from "@/data/content";
import {
  cloudCatalog,
  vpsCatalog,
  type CatalogService,
} from "@/data/service-catalog";
import { Icon } from "./icon";
import styles from "./infrastructure-services.module.css";

const priceFormat = new Intl.NumberFormat("vi-VN");

function ServiceCardIcon() {
  return (
    <span className={styles.icon} aria-hidden="true">
      <svg viewBox="0 0 52 52" fill="none">
        <path d="M5 39 25 29l22 11-20 11L5 39Z" fill="#dceaff" />
        <path d="m5 35 20-10 22 11-20 11L5 35Z" fill="#98c3ff" />
        <path d="M5 35v4l22 12v-4L5 35Z" fill="#74adff" />
        <path d="m27 47 20-11v4L27 51v-4Z" fill="#1875ee" />
        <path d="m14 9 15-7 15 8-15 8-15-9Z" fill="#eaf3ff" />
        <path d="M14 9v26l15 8V18L14 9Z" fill="#c6deff" />
        <path d="m29 18 15-8v25l-15 8V18Z" fill="#1681ff" />
        <path d="m18 9 11-5 10 6-10 5-11-6Z" fill="#b6d6ff" />
        <path
          d="m17 16 9 5m-9 1 9 5m-9 1 9 5"
          stroke="#75aaff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="m33 20 7-4m-7 10 7-4m-7 10 7-4"
          stroke="#bfe1ff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="m17 33 3 2m2-1 4 2"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function ProductCard({ service }: { service: CatalogService }) {
  return (
    <article className={styles.card} data-catalog-service={service.id}>
      <div className={styles.cardTop}>
        <ServiceCardIcon />
        <div className={styles.heading}>
          <span className={styles.platform}>{service.platform}</span>
          <h3>{service.name}</h3>
        </div>
      </div>
      <p className={styles.description}>{service.description}</p>
      <div className={styles.priceBlock}>
        <div className={styles.priceLine}>
          <span className={styles.priceLabel}>
            {service.id === "vps-n8n" ? "Gói tham khảo" : "Giá từ"}
          </span>
          <p className={styles.price}>
            <strong>
              {priceFormat.format(service.price)}
              <span>đ</span>
            </strong>
            <span>/{service.period}</span>
          </p>
        </div>
      </div>
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
                <div className={styles.cardTop}>
                  <ServiceCardIcon />
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
                <ul className={styles.features}>
                  {service.features.map((feature) => (
                    <li key={feature}>
                      <Icon name="check" />
                      {feature}
                    </li>
                  ))}
                </ul>
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
