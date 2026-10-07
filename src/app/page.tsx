import Image from "next/image";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Consultation } from "@/components/consultation";
import { Icon } from "@/components/icon";
import { WorldMap } from "@/components/world-map";
import {
  articles,
  claims,
  infrastructure,
  links,
  partners,
  press,
  reviewMode,
  services,
  showEditorialNotes,
  solutions,
  testimonials,
} from "@/data/content";

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkText,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <a className="text-link" href={href}>
          {linkText}
          <Icon name="arrow" />
        </a>
      )}
    </div>
  );
}
function ClaimNote() {
  return reviewMode && showEditorialNotes ? (
    <p className="review-note">
      Nội dung theo brief, đang chờ duyệt.{" "}
      <Link href="/content-review">
        Xem trạng thái xác nhận <Icon name="external" />
      </Link>
    </p>
  ) : null;
}
export default function Home() {
  const visibleClaims = claims.filter(
    (c) => reviewMode || c.status === "approved",
  );
  const featureClaims = visibleClaims.filter((c) =>
    ["uptime", "support", "bandwidth"].includes(c.id),
  );
  const capacityClaim = visibleClaims.find((c) => c.id === "business");
  return (
    <>
      <Navigation />
      <main id="noi-dung">
        <section className="hero-shell" aria-labelledby="hero-title">
          <div className="hero">
            <Image
              src="/images/hero-datacenter-aisle.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-photo"
            />
            <div className="hero-overlay" />
            <div className="hero-content">
              <span className="hero-badge">
                <Icon name="network" />
                HẠ TẦNG CHO HỆ THỐNG CỦA BẠN
              </span>
              <h1 id="hero-title">
                VPS, Cloud Server
                <br />
                và hạ tầng máy chủ
                <br className="mobile-break" /> tại Việt Nam
              </h1>
              <p>
                Từ một website đến hệ thống doanh nghiệp.
                <br className="desktop-break" /> Chọn tài nguyên và cách triển
                khai phù hợp cùng InterData.
              </p>
              <div className="hero-actions">
                <a href={links.about} className="button hero-primary">
                  About Us <Icon name="arrow" />
                </a>
                <a href={links.contact} className="button hero-secondary">
                  Liên hệ <Icon name="external" />
                </a>
              </div>
              <ClaimNote />
            </div>
            {showEditorialNotes && (
              <span className="photo-credit">
                Ảnh minh họa datacenter · PxHere / CC0
              </span>
            )}
          </div>
        </section>
        <section
          id="uu-dai"
          className={`promotions container${featureClaims.length > 0 ? " promotions-with-features" : ""}`}
          aria-label="Chương trình ưu đãi"
        >
          {featureClaims.length > 0 && (
            <ul className="hero-features">
              {featureClaims.map((c, i) => (
                <li key={c.id}>
                  <Icon name={["shield", "headphones", "network"][i]} />
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          )}
          <a className="promotion-artwork" href={links.promotion}>
            <Image
              src="/images/banner-khuyen-mai.jpg"
              width={2048}
              height={432}
              alt="Săn ưu đãi VPS / Cloud Server – tối ưu đến 80% chi phí"
              sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1199px) calc(100vw - 64px), (max-width: 1343px) calc(100vw - 96px), 1248px"
            />
          </a>
        </section>
        <section id="dich-vu" className="section services">
          <div className="container">
            <SectionHeading
              eyebrow="DỊCH VỤ HẠ TẦNG"
              title="Chọn nền tảng để vận hành hệ thống"
              description="Máy chủ ảo, tài nguyên đám mây hay phần cứng riêng — bắt đầu từ nhu cầu sử dụng và cách bạn muốn quản trị."
            />
            <div className="service-grid">
              {services.map((s) => (
                <article className="service-card" key={s.id}>
                  <div className="service-top">
                    <span className="icon-box">
                      <Icon name={s.icon} />
                    </span>
                    <span className="service-type">{s.type}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <ul>
                    {s.features.map((f) => (
                      <li key={f}>
                        <Icon name="check" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a className="service-link" href={s.href}>
                    {s.cta}
                    <Icon name="arrow" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="giai-phap" className="solutions dark section">
          <div className="container solution-layout">
            <div className="solution-intro">
              <span className="eyebrow">GIẢI PHÁP TRIỂN KHAI</span>
              <h2>
                Từ tài nguyên
                <br />
                đến môi trường
                <br />
                chạy ứng dụng
              </h2>
              <p>
                Đã xác định bài toán? Trao đổi cách tổ chức máy ảo, container và
                lưu trữ trên nền hạ tầng phù hợp.
              </p>
              <a href="#nhu-cau" className="text-link">
                Tìm hướng triển khai <Icon name="arrow" />
              </a>
            </div>
            <div className="solution-list">
              {solutions.map((s, i) => (
                <article id={s.id} className="solution-card" key={s.id}>
                  <div className="solution-icon">
                    <Icon name={s.icon} />
                  </div>
                  <div>
                    <span className="solution-number">
                      0{i + 1} / {s.tags}
                    </span>
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    <a className="text-link" href={links.contact}>
                      Trao đổi về{" "}
                      {i === 0
                        ? "Proxmox"
                        : i === 1
                          ? "Kubernetes"
                          : "S3 Storage"}{" "}
                      <Icon name="external" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="nang-luc" className="capacity section">
          <WorldMap />
          <div className="container capacity-content">
            <span className="eyebrow">NĂNG LỰC INTERDATA</span>
            <h2>
              {capacityClaim?.text || "Hạ tầng cho doanh nghiệp và người dùng"}
            </h2>
            <p>
              InterData cung cấp dịch vụ máy chủ và giải pháp triển khai cho
              website, ứng dụng và hệ thống doanh nghiệp. Mỗi nhu cầu được xem
              xét theo tài nguyên và yêu cầu vận hành thực tế.
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
        <section id="khach-hang" className="feedback section">
          <div className="container">
            <SectionHeading
              eyebrow="GÓC NHÌN TỪ KHÁCH HÀNG"
              title="Câu Chuyện Thành Công Cùng InterData"
              description="Những chia sẻ về trải nghiệm sử dụng dịch vụ và làm việc với đội ngũ hỗ trợ."
            />
            <div className="testimonial-layout">
              {testimonials.map((t, i) => (
                <article
                  className={`testimonial testimonial-${i}`}
                  key={t.name}
                >
                  <div className="quote-header">
                    <span className="quote-mark" aria-hidden="true">
                      “
                    </span>
                    <Image
                      className="customer-logo"
                      src={t.logo}
                      alt={t.company}
                      width={140}
                      height={48}
                      sizes="140px"
                    />
                  </div>
                  <blockquote>{t.quote}</blockquote>
                  <div className="attribution">
                    {i !== 0 && (
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={56}
                        height={56}
                        sizes="56px"
                      />
                    )}
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.company}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="bao-chi" className="press section">
          <div className="container">
            <SectionHeading
              eyebrow="INTERDATA TRÊN BÁO CHÍ"
              title="Báo Chí Nói Gì Về InterData?"
              description="Các bài viết về hoạt động, công nghệ và hợp tác của InterData. Nội dung do từng cơ quan báo chí xuất bản."
            />
            <div className="press-grid">
              {press.map((p) => (
                <article key={p.href} className="press-article">
                  <a
                    href={p.href}
                    className="press-image"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={p.image}
                      alt=""
                      width={720}
                      height={440}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </a>
                  <span className="publication">{p.publication}</span>
                  <h3>
                    <a href={p.href}>{p.title}</a>
                  </h3>
                  <a className="text-link" href={p.href}>
                    Đọc trên {p.publication} <Icon name="external" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="doi-tac" className="education section">
          <div className="container">
            <div className="education-heading">
              <span className="eyebrow">KẾT NỐI CÙNG GIÁO DỤC</span>
              <h2>Cùng các trường đại học, cao đẳng</h2>
              <p>
                Các trường được giới thiệu trong nội dung chương trình Free
                Hosting của InterData.
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
        <Consultation />
        <section id="ha-tang" className="infrastructure dark section">
          <div className="infra-background" aria-hidden="true">
            <Image
              src="/images/viettel-idc.jpg"
              alt=""
              fill
              sizes="100vw"
              className="infra-photo"
            />
            <div className="infra-overlay" />
          </div>
          <div className="container infrastructure-layout">
            <div className="infra-content">
              <span className="eyebrow">NỀN TẢNG PHÍA SAU DỊCH VỤ</span>
              <h2>
                Hạ tầng được lựa chọn
                <br />
                cho từng hệ thống
              </h2>
              <div className="infra-items">
                {infrastructure
                  .filter((item) => reviewMode || item.status === "approved")
                  .map((item) => (
                    <div key={item.name}>
                      <Icon name={item.icon} />
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <ClaimNote />
              <a href={links.contact} className="text-link">
                Trao đổi yêu cầu kỹ thuật <Icon name="arrow" />
              </a>
              {showEditorialNotes && (
                <p className="photo-credit">
                  Ảnh minh họa datacenter · Viettel-IDC.jpg (tệp người dùng cung cấp)
                </p>
              )}
            </div>
          </div>
        </section>
        <section id="tai-nguyen" className="resources section">
          <div className="container">
            <SectionHeading
              eyebrow="KIẾN THỨC & TIN TỨC"
              title="Hiểu hạ tầng. Chủ động triển khai."
              href={links.blog}
              linkText="Khám phá blog"
            />
            <div className="resource-layout">
              {articles.map((a, i) => (
                <article
                  key={a.href}
                  className={i === 0 ? "resource-feature" : "resource-row"}
                >
                  {a.image && (
                    <a href={a.href} tabIndex={-1} aria-hidden="true">
                      <Image
                        src={a.image}
                        alt=""
                        width={960}
                        height={540}
                        sizes={
                          i === 0
                            ? "(max-width: 768px) 100vw, 50vw"
                            : "(max-width: 640px) 96px, 180px"
                        }
                      />
                    </a>
                  )}
                  <div>
                    <span className="article-category">{a.category}</span>
                    <h3>
                      <a href={a.href}>{a.title}</a>
                    </h3>
                    {i === 0 && (
                      <p>
                        Những thông số cần đối chiếu trước khi chọn tài nguyên
                        cho hệ thống của bạn.
                      </p>
                    )}
                    <a href={a.href} className="text-link">
                      Đọc bài viết <Icon name="arrow" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
            <div className="resource-bottom">
              <p>Đang tìm chương trình ưu đãi cho dịch vụ?</p>
              <a href={links.promotion} className="text-link">
                Xem tin khuyến mãi và điều kiện áp dụng <Icon name="arrow" />
              </a>
            </div>
          </div>
        </section>
        <section id="lien-he" className="final-section container">
          <div className="final-cta">
            <div>
              <span className="eyebrow">TRAO ĐỔI CÙNG INTERDATA</span>
              <h2>
                Cấu hình phù hợp bắt đầu
                <br />
                từ một bài toán rõ ràng.
              </h2>
              <p>
                Cho chúng tôi biết ứng dụng, mức tải và kế hoạch của bạn.
                <br className="desktop-break" /> Cùng xác định dịch vụ và phương
                án triển khai tiếp theo.
              </p>
            </div>
            <a className="button primary" href={links.contact}>
              Liên hệ tư vấn <Icon name="arrow" />
            </a>
          </div>
        </section>
      </main>
      <footer className="footer dark">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-company">
              <Link href="/" className="footer-logo">
                <Image
                  src="/images/logo.webp"
                  alt="InterData"
                  width={500}
                  height={174}
                  sizes="180px"
                />
              </Link>
              <p>CÔNG TY CỔ PHẦN INTER GROUP</p>
              <address>
                240 Nguyễn Đình Chính,
                <br />
                P. Phú Nhuận, TP. Hồ Chí Minh
              </address>
              <a href="tel:1900636822">1900 636 822</a>
              <a href="mailto:info@interdata.vn">info@interdata.vn</a>
              <span>MST: 0316918910</span>
            </div>
            <div>
              <h2>Dịch vụ</h2>
              {services.map((s) => (
                <a key={s.id} href={s.href}>
                  {s.name}
                </a>
              ))}
            </div>
            <div>
              <h2>Giải pháp</h2>
              {solutions.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  {s.name}
                </a>
              ))}
            </div>
            <div>
              <h2>Về InterData</h2>
              <a href={links.about}>Giới thiệu</a>
              <a href={links.blog}>Blog & Tin tức</a>
              <a href={links.promotion}>Khuyến mãi</a>
              <a href={links.contact}>Liên hệ</a>
            </div>
            <div>
              <h2>Hỗ trợ & Tài khoản</h2>
              <a href={links.ticket}>Gửi ticket</a>
              <a href={links.register}>Đăng ký</a>
              <a href={links.login}>Đăng nhập</a>
              <a href={links.sla}>Cam kết dịch vụ</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 InterData</span>
            <div>
              <a href={links.privacy}>Chính sách bảo mật</a>
              <a href={links.terms}>Điều khoản sử dụng</a>
              <a href="#trang-chu">Về đầu trang ↑</a>
            </div>
          </div>
          {reviewMode && showEditorialNotes && (
            <div className="review-footer">
              Bản thiết kế để duyệt nội dung ·{" "}
              <a href="/content-review">Các mục cần xác nhận</a>
            </div>
          )}
        </div>
      </footer>
    </>
  );
}
