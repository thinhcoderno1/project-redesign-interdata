"use client";

import SourceImage from "./source-image";
import { useState } from "react";
import { withAssetPrefix } from "./assets";

const testimonials = [
  {
    name: "Lê Minh Hưng",
    company: "SEO Việt",
    logo: "/social-proof/logos/logo-seoviet.png",
    content:
      "Sau 1 thời gian trải nghiệm và đã sử dụng dịch vụ của InterData thì Hưng đánh giá chất lượng dịch vụ khá là tốt. Hưng cũng dùng dịch vụ rất nhiều bên ở Việt Nam rồi thì thấy dịch vụ không thua kém bất kể bên nào, nhiều khi còn nhỉnh hơn các bên. Hệ thống ổn định, đặc biệt giá thành tốt hơn so với các bên trên thị trường. Mong muốn của Hưng cũng như tất cả khách hàng là InterData sẽ duy trì sự ổn định bền vững ở hiện tại và tương lai.",
  },
  {
    name: "Vĩnh Minh Đạo",
    company: "RealDev",
    logo: "/social-proof/logos/logo-realdev.png",
    content:
      "Với tư cách là đơn vị sử dụng trực tiếp và cung cấp dịch vụ website đến khách hàng toàn quốc, mình đã sử dụng dịch vụ của các đơn vị cung cấp VPS, Hosting, Dedicate từ trong nước đến nước ngoài. Sau khi sử dụng dịch vụ VPS tại InterData, mình rất ấn tượng với cấu hình chuẩn chỉnh và giá trị thực tế của dịch vụ. Mình đánh giá rất cao thái độ cầu thị của toàn thể công ty InterData và chất lượng sản phẩm dịch vụ.",
  },
  {
    name: "Trịnh Bảo",
    company: "BALICO",
    logo: "/social-proof/logos/balico.png",
    content:
      "Mình thấy khá hài lòng với dịch vụ Cloud AMD của InterData. Website chạy ổn định, hiệu suất và các tính năng đều đáp ứng tốt nhu cầu của mình. Có lúc cũng gặp vài trục trặc nhỏ, nhưng đội ngũ kỹ thuật xử lý rất nhanh và nhiệt tình. Nhìn chung, dùng dịch vụ của InterData mình cảm thấy rất yên tâm.",
  },
  {
    name: "Trường Phong",
    company: "Công ty TNHH Giải pháp Công nghệ Trường Phong",
    logo: "/social-proof/logos/logo-themewpgiare-truongphong.png",
    content:
      "Từ lúc chuyển qua dùng VPS của InterData, mình thấy website chạy mượt hơn hẳn, hiếm khi gặp lỗi. Đội ngũ hỗ trợ cũng rất chuyên nghiệp, lúc nào cần là phản hồi liền. Hiện tại thì mình hoàn toàn hài lòng với dịch vụ này.",
  },
  {
    name: "Thắng Nguyễn",
    company: "UMIX Việt Nam",
    logo: "/social-proof/logos/logo-umix-vietnam.png",
    content:
      "Tôi đã chuyển website Umix sang chạy ở InterData, điều tôi hài lòng nhất chính là sự nhiệt tình của các nhân viên, hỗ trợ mọi vấn đề một cách nhanh chóng ngay cả lúc nửa đêm.",
  },
  {
    name: "Trần Mạnh Hùng",
    company: "Digizone Việt Nam",
    logo: "/social-proof/logos/logo-digizone-vietnam.png",
    content:
      "Bên mình là Agency về thiết kế web và Ads nên rất chú trọng về tính ổn định, bảo mật của VPS, Hosting để đảm bảo chất lượng dịch vụ với khách hàng. Từ khi dùng dịch vụ của InterData thì mình thấy hạ tầng mạnh, cập nhật các dòng cấu hình server mới, tốc độ kết nối nhanh và đội ngũ hỗ trợ nhiệt tình. Mình tin tưởng vào chất lượng dịch vụ của InterData sẽ luôn đảm bảo ổn định và bảo mật cao.",
  },
  {
    name: "Đặng Hải Triều",
    company: "Đồng Hồ Hải Triều",
    logo: "/social-proof/logos/logo-donghohaitrieu.png",
    content:
      "Chất lượng dịch vụ rất tốt! Đội ngũ hỗ trợ mau chóng, phối hợp nhịp nhàng để hỗ trợ mấy ca khó. Linh hoạt xử lý mấy tình huống ngoài phạm vi trách nhiệm luôn. Rất tuyệt vời.",
  },
  {
    name: "Tạ Quốc Khánh",
    company: "Công ty Cổ phần Jobke",
    logo: "/social-proof/logos/logo-jobkey.png",
    content:
      "Đội ngũ hỗ trợ kỹ thuật nhiệt tình và nhanh chóng. Tôi sẽ giới thiệu thêm cho bạn bè và đối tác của mình về dịch vụ của InterData trong thời gian tới.",
  },
];

const ratings = [
  {
    platform: "Google",
    score: "4.3",
    href: "https://maps.app.goo.gl/A7GAGdvTqqbjYhmu6",
  },
  {
    platform: "Facebook",
    score: "5.0",
    href: "https://www.facebook.com/interdata.com.vn/reviews",
  },
  {
    platform: "HostAdvice",
    score: "5.0",
    href: "https://hostadvice.com/hosting-company/inter-group-joint-stock-company-reviews/",
  },
];

const SHOW_PUBLIC_RATINGS = false;

const pressArticles = [
  {
    href: "https://baoangiang.com.vn/vps-interdata-giai-phap-may-chu-ao-toi-uu-hieu-suat-va-chi-phi-a475417.html",
    thumb: "/social-proof/press/thumb-angiang.png",
    partnerLogo: "/social-proof/press/baoangiang.png",
    title: "VPS InterData: Giải pháp máy chủ ảo tối ưu hiệu suất và chi phí",
  },
  {
    href: "https://baohatinh.vn/thue-vps-tai-interdata-giai-phap-toi-uu-ha-tang-online-cho-doanh-nghiep-post304939.html",
    thumb: "/social-proof/press/Thumb-baohatinh.jpg",
    partnerLogo: "/social-proof/press/baohatinh.png",
    title:
      "Thuê VPS tại InterData: Giải pháp tối ưu hạ tầng online cho doanh nghiệp",
  },
  {
    href: "https://vnexpress.net/interdata-dua-giai-phap-viet-ra-thi-truong-quoc-te-4539197.html",
    thumb: "/social-proof/press/thumb-vnexpress.webp",
    partnerLogo: "/social-proof/press/vnexpress.png",
    title: "InterData đưa giải pháp Việt ra thị trường quốc tế",
  },
  {
    href: "https://thanhnien.vn/interdata-va-vnpt-hop-tac-chien-luoc-va-khai-thac-ha-tang-datacenter-185240701161300605.htm",
    thumb: "/social-proof/press/thumb-baothanhnien.webp",
    partnerLogo: "/social-proof/press/baothanhnien.webp",
    title:
      "InterData và VNPT hợp tác chiến lược và khai thác hạ tầng Datacenter",
  },
  {
    href: "https://cafef.vn/interdata-tang-mien-phi-luu-tru-web-nvme-dung-luong-6gb-toc-do-mang-1gbps-20230223134836995.chn",
    thumb: "/social-proof/press/thumb-cafef.png",
    partnerLogo: "/social-proof/press/cafef.png",
    title:
      "InterData tặng miễn phí lưu trữ web NVMe dung lượng 6GB, tốc độ mạng 1Gbps",
  },
  {
    href: "https://vtv.vn/cong-nghe/greencloud-hop-tac-cung-interdata-trien-khai-ha-tang-server-tai-viet-nam-20230411104845847.htm",
    thumb: "/social-proof/press/thumb-vtv.png",
    partnerLogo: "/social-proof/press/vtv.webp",
    title:
      "GreenCloud hợp tác cùng InterData triển khai hạ tầng Server tại Việt Nam",
  },
  {
    href: "https://dantri.com.vn/suc-manh-so/interdata-ra-mat-goi-cloud-server-network-port-10gbps-tai-viet-nam-20221123162831826.htm",
    thumb: "/social-proof/press/thumb-dantri.webp",
    partnerLogo: "/social-proof/press/dantri.webp",
    title: "InterData ra mắt gói Cloud Server Network Port 10Gbps tại Việt Nam",
  },
  {
    href: "https://www.24h.com.vn/doanh-nghiep/interdata-va-eztech-ky-ket-thoa-thuan-hop-tac-chien-luoc-cung-cap-giai-phap-ha-tang-datacenter-c849a1569291.html",
    thumb: "/social-proof/press/thumb-24h.jpg",
    partnerLogo: "/social-proof/press/24h.png",
    title:
      "InterData và EZTech ký kết thỏa thuận hợp tác chiến lược cung cấp giải pháp hạ tầng Datacenter",
  },
  {
    href: "https://vietnamnet.vn/interdata-hop-tac-vnpt-khai-thac-ha-tang-datacenter-va-cac-dich-vu-the-manh-2301215.html",
    thumb: "/social-proof/press/thumb-vietnamnet.jpg",
    partnerLogo: "/social-proof/press/Logo_Vietnamnet.png",
    title:
      "InterData hợp tác VNPT khai thác hạ tầng Datacenter và các dịch vụ thế mạnh",
  },
  {
    href: "https://baolamdong.vn/thong-tin-can-biet/202405/le-ky-ket-mou-giua-interdata-va-truong-dai-hoc-yersin-da-lat-b180e1a/",
    thumb: "/social-proof/press/thumb-lamdong.jpg",
    partnerLogo: "/social-proof/press/lamdong.png",
    title: "Lễ ký kết MOU giữa InterData và Trường Đại học Yersin Đà Lạt",
  },
  {
    href: "https://vtcnews.vn/interdata-hop-tac-cung-eztech-phat-trien-ha-tang-server-cloud-gpu-ar872150.html",
    thumb: "/social-proof/press/thumb-vtc.webp",
    partnerLogo: "/social-proof/press/vtcnews.webp",
    title: "InterData hợp tác cùng EZTech phát triển hạ tầng server cloud GPU",
  },
];

function Stars() {
  return (
    <span className="proof-stars" role="img" aria-label="5 trên 5 sao">
      {[0, 1, 2, 3, 4].map((star) => (
        <svg key={star} viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 1l1.854 3.756L14 5.429l-3 2.923.708 4.127L8 10.354l-3.708 2.125L5 8.352 2 5.429l4.146-.673z" />
        </svg>
      ))}
    </span>
  );
}

export default function SocialProofSection() {
  const [paused, setPaused] = useState(false);
  const testimonialLoops = [testimonials, testimonials];
  const pressLoops = [pressArticles, pressArticles];

  return (
    <section
      className={`section social-proof-section${paused ? " proof-is-paused" : ""}`}
    >
      <div className="container">
        <header className="proof-heading center">
          <span className="eyebrow on-light">FEEDBACKS</span>
          <h2 className="section-title">Khách hàng nói gì về InterData?</h2>
          <p>
            Trải nghiệm thực tế từ doanh nghiệp, agency và đội ngũ đang vận hành
            website trên hạ tầng InterData.
          </p>
        </header>

        <div className="proof-controls">
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "Tiếp tục chuyển động" : "Tạm dừng chuyển động"}
          </button>
        </div>
        <div
          tabIndex={0}
          role="region"
          className="feedback-rail"
          aria-label="Đánh giá của khách hàng"
        >
          <div className="feedback-track">
            {testimonialLoops.map((items, loopIndex) => (
              <div
                className="feedback-loop-group"
                key={loopIndex}
                aria-hidden={loopIndex === 1 ? true : undefined}
                inert={loopIndex === 1 ? true : undefined}
              >
                {items.map((item) => (
                  <article
                    className="feedback-card"
                    key={`${loopIndex}-${item.name}`}
                  >
                    <div className="feedback-card-head">
                      <div className="feedback-logo">
                        <SourceImage
                          src={withAssetPrefix(item.logo)}
                          alt={`Logo ${item.company}`}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <Stars />
                    </div>
                    <details className="feedback-details">
                      <summary>
                        <p>“{item.content}”</p>
                        <span className="feedback-toggle" aria-hidden="true" />
                      </summary>
                    </details>
                    <footer>
                      <strong>{item.name}</strong>
                      <span>{item.company}</span>
                    </footer>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        {SHOW_PUBLIC_RATINGS && (
          <div
            className="rating-strip"
            aria-label="Đánh giá InterData trên các nền tảng"
          >
            <span className="rating-strip-label">Đánh giá công khai</span>
            {ratings.map((rating) => (
              <a
                href={rating.href}
                key={rating.platform}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                <span>{rating.platform}</span>
                <b>{rating.score}</b>
                <Stars />
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M5 3h8v8M13 3 4 12M11 9v4H3V5h4" />
                </svg>
              </a>
            ))}
          </div>
        )}

        <div className="press-block">
          <header className="press-heading">
            <div>
              <span className="eyebrow on-light">PRESS</span>
              <h2>Báo chí nói gì về InterData</h2>
            </div>
            <p>
              Các dấu mốc về hạ tầng, công nghệ và hợp tác của InterData được
              ghi nhận trên nhiều kênh báo chí.
            </p>
          </header>

          <div
            tabIndex={0}
            role="region"
            className="press-rail"
            aria-label="Bài viết báo chí về InterData"
          >
            <div className="press-track">
              {pressLoops.map((items, loopIndex) => (
                <div className="press-loop-group" key={loopIndex}>
                  {items.map((item) => (
                    <a
                      className="press-proof-card"
                      href={item.href}
                      key={`${loopIndex}-${item.href}`}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                    >
                      <div className="press-proof-image">
                        <SourceImage
                          src={withAssetPrefix(item.thumb)}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                        <span>
                          <SourceImage
                            src={withAssetPrefix(item.partnerLogo)}
                            alt="Logo đơn vị báo chí"
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                      </div>
                      <div className="press-proof-body">
                        <h3>{item.title}</h3>
                        <span>
                          Đọc bài viết
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
