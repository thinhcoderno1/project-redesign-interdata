import Link from "next/link";
import { Mail, MessageCircle, PhoneCall, MapPin, Clock3 } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { links } from "@/data/content";
import { contactDetails } from "@/data/contact";
import { ContactRequest } from "./contact-request";
import { OfficeMap } from "./office-map";
import styles from "./contact.module.css";

function FacebookMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.7 22v-9.1h3.1l.5-3.6h-3.6V7c0-1 .3-1.8 1.8-1.8h1.9V2c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.9v2.5H6.8v3.6h3.1V22h3.8Z" />
    </svg>
  );
}

const channels = [
  {
    title: "Gọi trực tiếp",
    text: contactDetails.hotline,
    description: "Trao đổi về dịch vụ và nhu cầu của bạn.",
    href: contactDetails.hotlineHref,
    icon: PhoneCall,
    action: "Gọi hotline",
  },
  {
    title: "Gửi email",
    text: contactDetails.email,
    description: "Gửi thông tin và nội dung cần trao đổi.",
    href: `mailto:${contactDetails.email}`,
    icon: Mail,
    action: "Viết email",
  },
  {
    title: "Chat qua Zalo",
    text: "InterData Official Account",
    description: "Kết nối qua kênh Zalo của InterData.",
    href: contactDetails.zalo,
    icon: MessageCircle,
    action: "Mở Zalo",
  },
  {
    title: "Kết nối Facebook",
    text: "InterData",
    description: "Nhắn tin và theo dõi hoạt động mới.",
    href: contactDetails.facebook,
    icon: FacebookMark,
    action: "Mở Facebook",
  },
];

export function ContactPage() {
  return (
    <main id="noi-dung" className={styles.page}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Đường dẫn trang">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Liên hệ</span>
          </nav>
          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <span className="eyebrow">LIÊN HỆ INTERDATA</span>
              <h1 id="contact-title">
                Cùng trao đổi.
                <br />
                <span>Tìm hướng triển khai.</span>
              </h1>
              <p>
                Bạn đang tìm hạ tầng cho website, ứng dụng hay hệ thống doanh
                nghiệp? Chia sẻ nhu cầu để cùng InterData lựa chọn hướng triển
                khai phù hợp.
              </p>
              <div className={styles.actions}>
                <a href="#gui-yeu-cau" className="button primary">
                  Trao đổi nhu cầu <Icon name="arrow" />
                </a>
                <a href="#van-phong" className={styles.textLink}>
                  <MapPin size={19} aria-hidden="true" /> Tìm văn phòng
                </a>
              </div>
            </div>
            <aside
              className={`${styles.supportPanel} dark`}
              aria-labelledby="support-title"
            >
              <div className={styles.supportIcon}>
                <Icon name="headphones" />
              </div>
              <span className={styles.panelLabel}>ĐÃ SỬ DỤNG DỊCH VỤ?</span>
              <h2 id="support-title">
                Bạn cần hỗ trợ
                <br />
                về dịch vụ đang dùng?
              </h2>
              <p>
                Gửi ticket trong hệ thống hỗ trợ để trao đổi và theo dõi yêu cầu
                của bạn.
              </p>
              <a href={links.ticket} className={styles.ticketLink}>
                Gửi yêu cầu hỗ trợ <Icon name="external" />
              </a>
              <div className={styles.supportPhone}>
                <PhoneCall size={19} aria-hidden="true" />
                <span>
                  Hotline{" "}
                  <a href={contactDetails.hotlineHref}>
                    {contactDetails.hotline}
                  </a>
                </span>
              </div>
            </aside>
          </div>
          <div className={styles.channels} aria-label="Các kênh liên hệ">
            {channels.map(
              ({
                title,
                text,
                description,
                href,
                icon: ChannelIcon,
                action,
              }) => (
                <a
                  key={title}
                  href={href}
                  className={styles.channel}
                  {...(href.startsWith("https:")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className={styles.channelIcon}>
                    <ChannelIcon
                      size={24}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </span>
                  <h2>{title}</h2>
                  <strong>{text}</strong>
                  <p>{description}</p>
                  <span className={styles.channelAction}>
                    {action}{" "}
                    <Icon
                      name={href.startsWith("https:") ? "external" : "arrow"}
                    />
                  </span>
                </a>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="gui-yeu-cau"
        className={`section ${styles.requestSection}`}
        aria-labelledby="request-title"
      >
        <div className={`container ${styles.requestLayout}`}>
          <div className={styles.requestCopy}>
            <span className="eyebrow">TRAO ĐỔI NHU CẦU</span>
            <h2 id="request-title">
              Một vài thông tin.
              <br />
              Bắt đầu cuộc trao đổi.
            </h2>
            <p>
              Cho chúng tôi biết bạn cần triển khai gì, dịch vụ đang quan tâm và
              cách liên hệ thuận tiện.
            </p>
            <div className={styles.preparation}>
              <h3>Bạn có thể chia sẻ thêm</h3>
              <ul>
                <li>
                  <Icon name="check" /> Website, ứng dụng hoặc phần mềm đang sử
                  dụng
                </li>
                <li>
                  <Icon name="check" /> Cấu hình dự kiến và nhu cầu mở rộng
                </li>
                <li>
                  <Icon name="check" /> Thời điểm triển khai hoặc chuyển dịch vụ
                </li>
              </ul>
            </div>
            <div className={styles.workHours}>
              <Clock3 size={22} aria-hidden="true" />
              <div>
                <strong>Giờ làm việc văn phòng</strong>
                <p>{contactDetails.hours}</p>
              </div>
            </div>
            <a className={styles.textLink} href={contactDetails.mobileHref}>
              Gọi số tư vấn {contactDetails.mobile} <Icon name="arrow" />
            </a>
          </div>
          <ContactRequest />
        </div>
      </section>

      <section
        id="van-phong"
        className={`section ${styles.officeSection}`}
        aria-labelledby="office-title"
      >
        <div className="container">
          <div className={styles.officeHeading}>
            <div>
              <span className="eyebrow">GẶP GỠ TẠI VĂN PHÒNG</span>
              <h2 id="office-title">Tìm đường đến InterData.</h2>
            </div>
            <p>
              Chọn địa điểm để xem bản đồ và chỉ đường. Bạn có thể liên hệ trước
              để hẹn thời gian trao đổi.
            </p>
          </div>
          <OfficeMap />
        </div>
      </section>

      <section
        className={`section ${styles.nextSteps}`}
        aria-labelledby="next-title"
      >
        <div className={`container ${styles.nextLayout}`}>
          <div>
            <span className="eyebrow">TÌM HIỂU THÊM</span>
            <h2 id="next-title">
              Bắt đầu từ dịch vụ
              <br />
              phù hợp với bạn.
            </h2>
          </div>
          <div className={styles.nextLinks}>
            <Link href="/#dich-vu">
              <span>
                <strong>Khám phá dịch vụ hạ tầng</strong>
                <small>VPS, Cloud Server, máy chủ và colocation</small>
              </span>
              <Icon name="arrow" />
            </Link>
            <Link href={links.about}>
              <span>
                <strong>Hiểu thêm về InterData</strong>
                <small>Con người, dịch vụ và các hoạt động kết nối</small>
              </span>
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
