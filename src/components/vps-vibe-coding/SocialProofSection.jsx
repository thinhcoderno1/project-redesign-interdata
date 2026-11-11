"use client";

import SourceImage from "./source-image";
import { useState } from "react";
import { withAssetPrefix } from "./assets";

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
  const pressLoops = [pressArticles, pressArticles];

  return (
    <section
      className={`section social-proof-section${paused ? " proof-is-paused" : ""}`}
    >
      <div className="container">
        <div className="proof-controls">
          <button
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "Tiếp tục chuyển động" : "Tạm dừng chuyển động"}
          </button>
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
