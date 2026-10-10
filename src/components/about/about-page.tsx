import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { links } from "@/data/content";
import {
  aboutMilestones,
  aboutPhotos,
  aboutSources,
  aboutValues,
} from "@/data/about";
import styles from "./about.module.css";

const offerings = [
  {
    name: "VPS",
    text: "Môi trường riêng cho website, ứng dụng và công cụ self-host.",
    icon: "server",
    href: links.vps,
  },
  {
    name: "Cloud Server",
    text: "Lựa chọn tài nguyên đám mây theo nhu cầu triển khai hệ thống.",
    icon: "cloud",
    href: links.cloud,
  },
  {
    name: "Thuê Máy Chủ",
    text: "Phần cứng dành riêng cho những nhu cầu vận hành chuyên biệt.",
    icon: "cpu",
    href: links.dedicated,
  },
  {
    name: "Colocation",
    text: "Không gian datacenter để đặt và kết nối thiết bị của bạn.",
    icon: "building",
    href: links.colocation,
  },
];

export function AboutPage() {
  return (
    <main id="noi-dung" className={styles.page}>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Đường dẫn trang">
            <Link href="/">Trang chủ</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Giới thiệu</span>
          </nav>
          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <span className="eyebrow">VỀ INTERDATA</span>
              <h1 id="about-title">
                Công nghệ vững vàng.
                <br />
                <span>Kết nối dài lâu.</span>
              </h1>
              <p>
                InterData là thương hiệu thuộc Công ty Cổ phần Inter Group, cung
                cấp dịch vụ hạ tầng số cho doanh nghiệp, lập trình viên và các
                dự án công nghệ.
              </p>
              <p className={styles.heroNote}>
                Phía sau mỗi dịch vụ là con người, kinh nghiệm và những kết nối
                cùng khách hàng, đối tác, cộng đồng.
              </p>
              <div className={styles.actions}>
                <a href="#cau-chuyen" className="button primary">
                  Khám phá InterData <Icon name="arrow" />
                </a>
                <a href={links.contact} className={styles.textLink}>
                  Kết nối với chúng tôi <Icon name="external" />
                </a>
              </div>
            </div>
            <div className={styles.heroVisual}>
              <figure className={styles.heroPhoto}>
                <Image
                  {...aboutPhotos.welcome}
                  alt={aboutPhotos.welcome.alt}
                  preload
                  sizes="(max-width: 959px) calc(100vw - 40px), (max-width: 1440px) 52vw, 680px"
                />
                <figcaption>
                  Đón sinh viên FPT Polytechnic tại InterData{" "}
                  <span>21.02.2025</span>
                </figcaption>
              </figure>
              <a href={aboutSources.career} className={styles.heroInset}>
                <Image
                  {...aboutPhotos.booth}
                  alt={aboutPhotos.booth.alt}
                  sizes="(max-width: 639px) 144px, 220px"
                />
                <span>
                  Gặp gỡ thế hệ công nghệ tiếp theo <Icon name="external" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <nav
        className={styles.sectionNavigation}
        aria-label="Nội dung trang Giới thiệu"
      >
        <div className="container">
          <a href="#cau-chuyen">Về chúng tôi</a>
          <a href="#ha-tang-interdata">Hạ tầng & dịch vụ</a>
          <a href="#con-nguoi">Con người & văn hóa</a>
          <a href="#hanh-trinh">Hoạt động & kết nối</a>
        </div>
      </nav>

      <section
        id="cau-chuyen"
        className={`section ${styles.story}`}
        aria-labelledby="story-title"
      >
        <div className="container">
          <div className={styles.storyLayout}>
            <div>
              <span className="eyebrow">CÂU CHUYỆN INTERDATA</span>
              <h2 id="story-title">
                Đưa công nghệ đến gần
                <br />
                những nhu cầu thực tế.
              </h2>
            </div>
            <div className={styles.storyCopy}>
              <p>
                Từ website và ứng dụng đến hệ thống doanh nghiệp, hạ tầng là nơi
                dữ liệu được lưu trữ và công việc được vận hành. InterData cung
                cấp VPS, Cloud Server, máy chủ vật lý và chỗ đặt máy chủ để
                khách hàng lựa chọn theo bài toán của mình.
              </p>
              <p>
                Chúng tôi hướng tới việc kết nối dịch vụ hạ tầng với các giải
                pháp công nghệ, giúp doanh nghiệp đưa hệ thống lên môi trường
                trực tuyến và phát triển theo từng giai đoạn.
              </p>
            </div>
          </div>
          <div className={styles.purpose}>
            <Icon name="network" />
            <div>
              <h3>
                Hạ tầng là điểm bắt đầu. Giá trị nằm ở cách bạn sử dụng nó.
              </h3>
              <p>
                Định hướng của InterData là mang công nghệ đến những hoạt động
                cụ thể: vận hành website, phát triển ứng dụng, tổ chức dữ liệu
                và kết nối hệ thống.
              </p>
            </div>
          </div>
          <div className={styles.values}>
            {aboutValues.map((value, index) => (
              <article key={value.title} className={styles.value}>
                <div className={styles.valueTop}>
                  <Icon name={value.icon} />
                  <span>0{index + 1}</span>
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="ha-tang-interdata"
        className={`section ${styles.infrastructure} dark`}
        aria-labelledby="infrastructure-title"
      >
        <div className="container">
          <div className={styles.infrastructureLayout}>
            <div className={styles.infrastructureCopy}>
              <span className="eyebrow">HẠ TẦNG & DỊCH VỤ</span>
              <h2 id="infrastructure-title">
                Một nền tảng.
                <br />
                Nhiều hướng triển khai.
              </h2>
              <p>
                Khách hàng có thể bắt đầu từ một máy chủ ảo, lựa chọn Cloud
                Server hoặc sử dụng phần cứng riêng. Mỗi lựa chọn phù hợp với
                một nhu cầu về tài nguyên, quyền quản trị và cách vận hành.
              </p>
              <p>
                Thông qua hợp tác cùng VNPT VinaPhone TP.HCM, InterData kết nối
                thế mạnh dịch vụ với hạ tầng datacenter và năng lực kết nối của
                đối tác.
              </p>
              <a href={aboutSources.vnpt} className={styles.lightLink}>
                Tìm hiểu hợp tác với VNPT <Icon name="external" />
              </a>
            </div>
            <figure className={styles.infrastructurePhoto}>
              <Image
                {...aboutPhotos.datacenter}
                alt={aboutPhotos.datacenter.alt}
                sizes="(max-width: 959px) calc(100vw - 40px), 45vw"
              />
              <figcaption>
                InterData và VNPT tại IDC Điện Biên Phủ, TP.HCM · 2024
              </figcaption>
            </figure>
          </div>
          <div className={styles.offerings}>
            {offerings.map((service) => (
              <a
                href={service.href}
                className={styles.offering}
                key={service.name}
              >
                <Icon name={service.icon} />
                <h3>{service.name}</h3>
                <p>{service.text}</p>
                <span>
                  Tìm hiểu dịch vụ <Icon name="arrow" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="con-nguoi"
        className={`section ${styles.people}`}
        aria-labelledby="people-title"
      >
        <div className="container">
          <div className={styles.peopleHeading}>
            <div>
              <span className="eyebrow">CON NGƯỜI & VĂN HÓA</span>
              <h2 id="people-title">
                Cùng làm việc.
                <br />
                Cùng chia sẻ. Cùng phát triển.
              </h2>
            </div>
            <p>
              InterData khuyến khích sự hợp tác giữa các thành viên, tinh thần
              học hỏi và cách tiếp cận sáng tạo khi giải quyết vấn đề.
            </p>
          </div>
          <div className={styles.peopleLayout}>
            <div className={styles.photoGrid}>
              <figure className={styles.workshopPhoto}>
                <Image
                  {...aboutPhotos.workshop}
                  alt={aboutPhotos.workshop.alt}
                  sizes="(max-width: 959px) calc(100vw - 40px), 55vw"
                />
                <figcaption>
                  Chia sẻ kinh nghiệm nghề Web Dev tại văn phòng · 21.02.2025
                </figcaption>
              </figure>
              <figure>
                <Image
                  {...aboutPhotos.server}
                  alt={aboutPhotos.server.alt}
                  sizes="(max-width: 639px) calc(100vw - 40px), 28vw"
                />
                <figcaption>Tìm hiểu máy chủ từ thiết bị thực tế</figcaption>
              </figure>
              <figure>
                <Image
                  {...aboutPhotos.team}
                  alt={aboutPhotos.team.alt}
                  sizes="(max-width: 639px) calc(100vw - 40px), 28vw"
                />
                <figcaption>
                  InterData tại FIT Career Day · 16.03.2026
                </figcaption>
              </figure>
            </div>
            <div className={styles.peopleCopy}>
              <article>
                <span className={styles.step}>01</span>
                <h3>Chia sẻ từ công việc thật</h3>
                <p>
                  Trong chương trình đón sinh viên FPT Polytechnic, đại diện
                  InterData chia sẻ về nghề lập trình và trực tiếp giới thiệu
                  cấu trúc máy chủ, tủ rack.
                </p>
              </article>
              <article>
                <span className={styles.step}>02</span>
                <h3>Kết nối với người làm công nghệ</h3>
                <p>
                  Tại FIT Career Day 2026, nhân sự InterData gặp gỡ ứng viên,
                  trao đổi về lĩnh vực Hosting, VPS, Cloud Server và cơ hội nghề
                  nghiệp.
                </p>
              </article>
              <article>
                <span className={styles.step}>03</span>
                <h3>Mở rộng cơ hội học hỏi</h3>
                <p>
                  Các hoạt động hợp tác với trường học gắn việc tìm hiểu công
                  nghệ với trải nghiệm tại doanh nghiệp và định hướng nghề
                  nghiệp.
                </p>
              </article>
              <a className={styles.textLink} href={links.careers}>
                Khám phá cơ hội tại InterData <Icon name="external" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="hanh-trinh"
        className={`section ${styles.journey}`}
        aria-labelledby="journey-title"
      >
        <div className="container">
          <div className={styles.journeyHeading}>
            <div>
              <span className="eyebrow">HOẠT ĐỘNG & KẾT NỐI</span>
              <h2 id="journey-title">
                Những kết nối trên hành trình phát triển.
              </h2>
            </div>
            <p>
              Từ hợp tác hạ tầng đến kết nối giáo dục, mỗi hoạt động mở thêm một
              cơ hội đồng hành cùng đối tác và cộng đồng.
            </p>
          </div>
          <div className={styles.milestones}>
            {aboutMilestones.map((event) => (
              <article key={event.isoDate} className={styles.milestone}>
                <a
                  href={event.href}
                  className={styles.eventPhoto}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={event.image}
                    alt={event.alt}
                    width={event.width}
                    height={event.height}
                    sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 959px) 45vw, 30vw"
                  />
                </a>
                <div className={styles.eventCopy}>
                  <div className={styles.eventMeta}>
                    <span>{event.category}</span>
                    <time dateTime={event.isoDate}>{event.date}</time>
                  </div>
                  <h3>
                    <a href={event.href}>{event.title}</a>
                  </h3>
                  <p>{event.description}</p>
                  <a href={event.href} className={styles.textLink}>
                    Đọc câu chuyện <Icon name="external" />
                    <span className="sr-only">: {event.title}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          <a
            href="https://interdata.vn/blog/su-kien/"
            className={styles.moreEvents}
          >
            Xem thêm hoạt động của InterData <Icon name="arrow" />
          </a>
        </div>
      </section>

      <section
        id="ket-noi-interdata"
        className={`section ${styles.contact}`}
        aria-labelledby="contact-title"
      >
        <div className="container">
          <div className={styles.contactLayout}>
            <div>
              <span className="eyebrow">KẾT NỐI VỚI INTERDATA</span>
              <h2 id="contact-title">
                Bắt đầu từ nhu cầu
                <br />
                của bạn.
              </h2>
              <p>
                Chia sẻ về website, ứng dụng hoặc hệ thống đang triển khai. Cùng
                InterData tìm hướng lựa chọn hạ tầng phù hợp.
              </p>
              <div className={styles.actions}>
                <a href={links.contact} className="button primary">
                  Trao đổi với InterData <Icon name="external" />
                </a>
                <Link href="/#dich-vu" className={styles.textLink}>
                  Khám phá dịch vụ <Icon name="arrow" />
                </Link>
              </div>
            </div>
            <div className={styles.companyDetails}>
              <span className={styles.companyLabel}>
                THÔNG TIN DOANH NGHIỆP
              </span>
              <h3>Công ty Cổ phần Inter Group</h3>
              <p>Thương hiệu dịch vụ hạ tầng số: InterData</p>
              <dl>
                <div>
                  <dt>Mã số thuế</dt>
                  <dd>0316918910</dd>
                </div>
                <div>
                  <dt>Hotline</dt>
                  <dd>
                    <a href="tel:1900636822">1900 636 822</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:info@interdata.vn">info@interdata.vn</a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
