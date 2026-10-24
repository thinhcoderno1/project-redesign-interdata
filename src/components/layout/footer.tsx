import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ReceiptText } from "lucide-react";
import {
  links,
  reviewMode,
  services,
  showEditorialNotes,
  solutions,
} from "@/data/content";
import { legalDocuments } from "@/data/legal-documents";
import styles from "./footer.module.css";
import { FooterSocialLinks } from "./footer-social-links";

export function Footer() {
  return (
    <footer className="footer dark">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-company">
            <p>CÔNG TY CỔ PHẦN INTER GROUP</p>
            <address className={styles.companyDetail}>
              <MapPin size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>
                240 Nguyễn Đình Chính,
                <br />
                P. Phú Nhuận, TP. HCM
              </span>
            </address>
            <a className={styles.companyDetail} href="tel:1900636822">
              <Phone size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>1900 636 822</span>
            </a>
            <a className={styles.companyDetail} href="mailto:info@interdata.vn">
              <Mail size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>info@interdata.vn</span>
            </a>
            <span className={styles.companyDetail}>
              <ReceiptText size={18} strokeWidth={1.6} aria-hidden="true" />
              <span>MST: 0316918910</span>
            </span>
            <a
              className={styles.companyCertificate}
              href="https://online.gov.vn/nen-tang/f334417e-c23e-42c6-8a77-38320b876977"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bộ Công Thương — Xem thông tin website InterData"
            >
              <Image
                src="/images/footer/bo-cong-thuong.png"
                alt="Đã thông báo Bộ Công Thương"
                width={148}
                height={56}
                unoptimized
              />
            </a>
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
              <Link key={s.id} href={s.href}>
                {s.id === "proxmox" ? "Triển khai Proxmox / CEPH" : s.name}
              </Link>
            ))}
          </div>
          <div>
            <h2>Về InterData</h2>
            <Link href={links.about}>Giới thiệu</Link>
            <a href={links.blog}>Blog & Tin tức</a>
            <a href={links.promotion}>Khuyến mãi</a>
            <Link href={links.contact}>Liên hệ</Link>
          </div>
          <div>
            <h2>Hướng dẫn</h2>
            <Link href="/blog/huong-dan-gui-yeu-cau-ho-tro-tai-interdata/">
              Gửi Ticket hỗ trợ
            </Link>
            <Link href="/blog/thay-doi-thong-tin-quan-tri-interdata/">
              Thay đổi thông tin tài khoản quản lý dịch vụ
            </Link>
            <Link href="/blog/huong-dan-dang-ky-ten-mien-tai-interdata/">
              Đăng ký tên miền
            </Link>
          </div>
        </div>
        <nav className={styles.policies} aria-label="Chính sách & Điều khoản">
          <h2>Chính sách & Điều khoản</h2>
          <div>
            <Link href={links.privacy}>Chính sách bảo mật</Link>
            {legalDocuments.map((document) => (
              <Link key={document.slug} href={`/${document.slug}/`}>
                {document.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="footer-bottom">
          <span>© 2026 InterData</span>
          <FooterSocialLinks />
        </div>
        {reviewMode && showEditorialNotes && (
          <div className="review-footer">
            Bản thiết kế để duyệt nội dung ·{" "}
            <a href="/content-review">Các mục cần xác nhận</a>
          </div>
        )}
      </div>
    </footer>
  );
}
