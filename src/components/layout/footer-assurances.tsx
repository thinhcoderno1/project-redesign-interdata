import Image from "next/image";
import { Banknote, Landmark } from "lucide-react";
import { FooterSocialLinks } from "./footer-social-links";
import styles from "./footer.module.css";

const paymentBrands = [
  { name: "VNPAY", image: "vnpay", width: 44 },
  { name: "MoMo", image: "momo", width: 24 },
  { name: "Visa", image: "visa", width: 38 },
  { name: "Mastercard", image: "mastercard", width: 32 },
  { name: "PayPal", image: "paypal", width: 44 },
] as const;

export function FooterAssurances() {
  return (
    <div className={styles.assurances}>
      <section aria-labelledby="footer-certificates-heading">
        <h2 id="footer-certificates-heading">Chứng chỉ website</h2>
        <ul className={styles.certificateList}>
          <li>
            <a
              className={styles.certificateItem}
              href="https://online.gov.vn/nen-tang/f334417e-c23e-42c6-8a77-38320b876977"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bộ Công Thương — Xem thông tin website InterData"
            >
              <Image
                src="/images/footer/bo-cong-thuong.png"
                alt="Đã thông báo Bộ Công Thương"
                width={108}
                height={41}
                unoptimized
              />
            </a>
          </li>
          {/* DMCA and Trustpilot await their registration links. */}
          <li className={styles.certificateItem}>
            <Image
              src="/images/footer/dmca.png"
              alt="DMCA Protected"
              width={88}
              height={44}
              unoptimized
            />
          </li>
          <li>
            <a
              className={styles.certificateItem}
              href="https://vi.hostadvice.com/hosting-company/inter-group-joint-stock-company-reviews/"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <span className={`${styles.brandLogo} ${styles.hostAdvice}`}>
                <Image
                  src="/images/footer/hostadvice.webp"
                  alt="HostAdvice"
                  width={440}
                  height={88}
                  unoptimized
                />
              </span>
            </a>
          </li>
          <li className={styles.certificateItem}>
            <span className={`${styles.brandLogo} ${styles.trustpilot}`}>
              <Image
                src="/images/footer/trustpilot.png"
                alt="Trustpilot"
                width={1048}
                height={453}
                unoptimized
              />
            </span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="footer-payments-heading">
        <h2 id="footer-payments-heading">Hỗ trợ thanh toán</h2>
        <ul className={styles.paymentList}>
          {paymentBrands.map((brand) => (
            <li
              key={brand.name}
              className={styles.paymentCard}
              title={brand.name}
            >
              <Image
                src={`/images/footer/${brand.image}.svg`}
                alt={brand.name}
                width={brand.width}
                height={24}
              />
            </li>
          ))}
          <li className={styles.paymentCard} title="Chuyển khoản">
            <Landmark
              size={20}
              strokeWidth={1.6}
              role="img"
              aria-label="Chuyển khoản"
            />
          </li>
          <li className={styles.paymentCard} title="Tiền mặt">
            <Banknote
              size={20}
              strokeWidth={1.6}
              role="img"
              aria-label="Tiền mặt"
            />
          </li>
        </ul>
      </section>

      <section aria-labelledby="footer-social-heading">
        <h2 id="footer-social-heading">Kết nối với InterData</h2>
        <FooterSocialLinks />
      </section>
    </div>
  );
}
