import Link from "next/link";
import {
  links,
  reviewMode,
  services,
  showEditorialNotes,
  solutions,
} from "@/data/content";
import { HomeSectionLink } from "./home-section-link";
import { legalDocuments } from "@/data/legal-documents";
import styles from "./footer.module.css";

export function Footer() {
  return (
    <footer className="footer dark">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-company">
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
              <HomeSectionLink key={s.id} section={s.id}>
                {s.id === "proxmox" ? "Triển khai Proxmox / CEPH" : s.name}
              </HomeSectionLink>
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
            <h2>Hỗ trợ & Tài khoản</h2>
            <a href={links.ticket}>Gửi ticket</a>
            <a href={links.register}>Đăng ký</a>
            <a href={links.login}>Đăng nhập</a>
            <a href={links.sla}>Cam kết dịch vụ</a>
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
          <div>
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
  );
}
