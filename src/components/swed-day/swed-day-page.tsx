"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Cpu,
  Flame,
  Globe2,
  HardDrive,
  Info,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
  Sparkles,
  TicketPercent,
  Zap,
} from "lucide-react";
import { MobilePricingSlider } from "@/components/shared/mobile-pricing-slider";
import { checkoutUrl, formatVnd, productSpecs } from "@/data/vps-pricing";
import {
  swedDayOffers,
  swedDayStore,
  type SwedDayCycle,
  type SwedDayProduct,
} from "@/data/swed-day";
import { getSwedDaySchedule } from "@/lib/swed-day-schedule";
import { splitCountdown } from "@/lib/flash-sale";
import styles from "./swed-day.module.css";

function CouponCode({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copying = useRef(false);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    if (copying.current) return;
    copying.current = true;
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("error");
    } finally {
      copying.current = false;
      timer.current = setTimeout(() => setStatus("idle"), 3000);
    }
  }
  return (
    <div className={styles.copyWrap}>
      <button
        className={styles.code}
        type="button"
        onClick={copy}
        aria-label={`Sao chép mã ${code}`}
      >
        <span>{code}</span>
        {status === "copied" ? (
          <Check size={18} aria-hidden="true" />
        ) : (
          <Copy size={18} aria-hidden="true" />
        )}
      </button>
      <span role="status" className={styles.copyStatus}>
        {status === "copied"
          ? "Đã sao chép mã!"
          : status === "error"
            ? "Chưa sao chép được. Bạn có thể chọn và sao chép mã."
            : ""}
      </span>
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
  const schedule = now === null ? null : getSwedDaySchedule(now);
  const units = schedule
    ? splitCountdown(schedule.remainingSeconds)
    : ["--", "--", "--", "--"];
  return (
    <div className={styles.countdownPanel}>
      <p className={styles.countdownLabel} role="status">
        <span
          className={styles.statusDot}
          data-live={schedule?.live || undefined}
        />
        {schedule?.live
          ? "Đang diễn ra · Kết thúc sau"
          : "Phiên ưu đãi tiếp theo bắt đầu sau"}
      </p>
      <div
        className={styles.countdown}
        role="timer"
        aria-live="off"
        aria-label={
          schedule?.live
            ? "Thời gian còn lại của Flash Sale"
            : "Thời gian đến Flash Sale tiếp theo"
        }
      >
        {units.map((value, index) => (
          <div key={index} className={styles.timeUnit}>
            <strong>{value}</strong>
            <span>{["Ngày", "Giờ", "Phút", "Giây"][index]}</span>
          </div>
        ))}
      </div>
      <p className={styles.nextSession}>
        {schedule
          ? `Thứ Tư, ${new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(schedule.startsAt)}`
          : "Thứ Tư hằng tuần"}
        <span>10:00–13:00 · Giờ Việt Nam (UTC+7)</span>
      </p>
    </div>
  );
}

function Specs({ product }: { product: SwedDayProduct }) {
  const specs = productSpecs(product, true);
  const primary = specs.filter((spec) =>
    /vCore|vCPU|RAM|SSD|NVMe|Network Port/i.test(spec),
  );
  const extra = specs.filter((spec) => !primary.includes(spec));
  const line = (spec: string) => {
    const Icon = /vCore|vCPU/i.test(spec)
      ? Cpu
      : /RAM/i.test(spec)
        ? MemoryStick
        : /SSD|NVMe/i.test(spec)
          ? HardDrive
          : /IPv/i.test(spec)
            ? Globe2
            : Network;
    return (
      <li key={spec}>
        <Icon size={18} aria-hidden="true" />
        <span>{spec}</span>
      </li>
    );
  };
  return (
    <div className={styles.specs}>
      <ul>{primary.map(line)}</ul>
      {extra.length > 0 && (
        <details>
          <summary>
            Cấu hình chi tiết <ChevronDown size={15} aria-hidden="true" />
          </summary>
          <ul>{extra.map(line)}</ul>
        </details>
      )}
    </div>
  );
}

export function SwedDayPage({ products }: { products: SwedDayProduct[] }) {
  const [cycle, setCycle] = useState<SwedDayCycle>("annually");
  const offer = swedDayOffers.find((item) => item.cycle === cycle)!;
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero} aria-labelledby="swed-title">
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>
              <Sparkles size={16} aria-hidden="true" /> THỨ TƯ HẰNG TUẦN · DEAL
              HỜI ĐÚNG HẸN
            </span>
            <h1 id="swed-title">
              <span className={styles.wordmark}>
                SWED <span>DAY</span>
                <i>.</i>
              </span>
              <span className={styles.heroHeadline}>DEALS CHỒNG DEALS</span>
            </h1>
            <p className={styles.heroDescription}>
              Hot Deals đã ưu đãi, nay còn hời hơn.
              <br />
              Chồng thêm mã giảm giá, tiết kiệm đến <strong>80%.</strong>
            </p>
            <div className={styles.heroActions}>
              <a href="#hot-deals" className={`button ${styles.lightButton}`}>
                Săn Hot Deals ngay <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a href="#flash-sale" className={styles.heroLink}>
                Lấy mã giảm thêm <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
            <div className={styles.schedulePill}>
              <Clock3 size={18} aria-hidden="true" />
              <span>
                <strong>10:00–13:00</strong> mỗi thứ Tư hằng tuần
              </span>
            </div>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.orbit} />
            <Sparkles className={styles.artSparkle} />
            <div className={styles.discountSeal}>
              <span>TIẾT KIỆM ĐẾN</span>
              <strong>
                80<small>%</small>
              </strong>
              <span>DEAL HỜI MỖI THỨ TƯ</span>
            </div>
            <div className={`${styles.floatingTicket} ${styles.ticketOne}`}>
              <TicketPercent size={25} />
              <span>
                HOT DEALS<strong>Giá tốt sẵn có</strong>
              </span>
              <Check size={19} />
            </div>
            <div className={`${styles.floatingTicket} ${styles.ticketTwo}`}>
              <Zap size={25} />
              <span>
                GIẢM THÊM<strong>10% · 15% · 20%</strong>
              </span>
              <span className={styles.ticketPlus}>+</span>
            </div>
            <span className={styles.artCaption}>
              Chọn chu kỳ dài. Nhận deal hời hơn.
            </span>
          </div>
        </div>
        <div className={styles.heroRibbon}>
          <div className={`container ${styles.ribbonInner}`}>
            <span>
              <Flame size={17} aria-hidden="true" /> HOT DEALS ĐỘC QUYỀN
            </span>
            <span>
              <TicketPercent size={17} aria-hidden="true" /> CHỒNG MÃ GIẢM ĐẾN
              20%
            </span>
            <span>
              <CalendarDays size={17} aria-hidden="true" /> HẸN BẠN MỖI THỨ TƯ
            </span>
          </div>
        </div>
      </section>

      <nav className={styles.sectionNav} aria-label="Nội dung SWED DAY">
        <div className="container">
          <a href="#hot-deals">
            <Server size={17} aria-hidden="true" /> Hot Deals
          </a>
          <a href="#flash-sale">
            <Zap size={17} aria-hidden="true" /> Flash Sale & mã ưu đãi
          </a>
          <a href="#dieu-kien">
            <Info size={17} aria-hidden="true" /> Điều kiện áp dụng
          </a>
        </div>
      </nav>

      <section
        id="hot-deals"
        className={styles.deals}
        aria-labelledby="deals-title"
      >
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className={styles.kicker}>
              <Flame size={17} aria-hidden="true" /> HOT DEALS SWED DAY
            </span>
            <h2 id="deals-title">
              Cấu hình mạnh. <span>Deal cực hời.</span>
            </h2>
            <p>Chọn gói VPS phù hợp, thêm mã SWED DAY để tối ưu chi phí.</p>
          </div>
          {products.length > 0 ? (
            <>
              <div className={styles.billingRow}>
                <div
                  className={styles.billingControl}
                  role="group"
                  aria-label="Chọn chu kỳ thanh toán"
                >
                  {swedDayOffers.map((item) => (
                    <button
                      type="button"
                      key={item.cycle}
                      aria-pressed={cycle === item.cycle}
                      onClick={() => setCycle(item.cycle)}
                    >
                      {item.years} năm<span>Mã giảm thêm {item.discount}%</span>
                    </button>
                  ))}
                </div>
                <p>
                  <RefreshCw size={16} aria-hidden="true" /> Giá gói cho toàn bộ
                  chu kỳ
                </p>
              </div>
              <MobilePricingSlider
                className={styles.planGrid}
                aria-label="Các gói Hot Deals SWED DAY"
              >
                {products.map((product, index) => {
                  const available =
                    product.available !== false &&
                    product.pricing.VND[cycle] !== undefined;
                  return (
                    <article
                      key={product.pid}
                      data-pid={product.pid}
                      className={`${styles.planCard} ${index === 1 ? styles.featuredPlan : ""}`}
                    >
                      <div className={styles.planTop}>
                        <span className={styles.planNumber}>0{index + 1}</span>
                        <Server
                          size={28}
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                      <h3>{product.name}</h3>
                      <p
                        className={styles.stock}
                        data-available={product.available !== false}
                      >
                        {product.available === false
                          ? "Tạm hết hàng"
                          : product.available
                            ? "Sẵn sàng đăng ký"
                            : "Kiểm tra tình trạng khi đăng ký"}
                      </p>
                      <div className={styles.price}>
                        <strong>{formatVnd(product.pricing.VND[cycle])}</strong>
                        <span>/ {offer.years} năm</span>
                      </div>
                      <p className={styles.priceNote}>
                        Giá Hot Deals · Chưa áp mã SWED DAY
                      </p>
                      <Specs product={product} />
                      {available ? (
                        <a
                          className={`button ${styles.pinkButton}`}
                          href={checkoutUrl(product, cycle)}
                          aria-label={`Đăng ký ${product.name}, chu kỳ ${offer.years} năm`}
                        >
                          Đăng ký ngay{" "}
                          <ArrowRight size={17} aria-hidden="true" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={`button ${styles.disabledButton}`}
                          disabled
                        >
                          {product.available === false
                            ? "Tạm hết hàng"
                            : "Chu kỳ chưa khả dụng"}
                        </button>
                      )}
                      <a className={styles.planCoupon} href="#flash-sale">
                        <TicketPercent size={15} aria-hidden="true" /> Lấy mã
                        giảm thêm {offer.discount}%{" "}
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </article>
                  );
                })}
              </MobilePricingSlider>
              <p className={styles.pricingFootnote}>
                <Info size={16} aria-hidden="true" /> Mã SWED DAY áp dụng trong
                khung 10:00–13:00 thứ Tư. Giá thanh toán cuối cùng được xác nhận
                tại trang đăng ký.
              </p>
            </>
          ) : (
            <div className={styles.unavailable}>
              <Server size={36} aria-hidden="true" />
              <h3>Bảng giá đang được cập nhật</h3>
              <p>
                Bạn có thể xem giá và đăng ký trực tiếp tại cửa hàng SWED DAY.
              </p>
              <a className={`button ${styles.pinkButton}`} href={swedDayStore}>
                Xem Hot Deals <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </section>

      <section
        id="flash-sale"
        className={styles.flashSale}
        aria-labelledby="flash-title"
      >
        <div className="container">
          <div className={styles.flashHeader}>
            <div>
              <span className={styles.kicker}>
                <Zap size={17} aria-hidden="true" /> DEALS CHỒNG DEALS
              </span>
              <h2 id="flash-title">
                FLASH{" "}
                <span>
                  SALE
                  <Zap aria-hidden="true" />
                </span>
              </h2>
              <p>Thêm một mã. Thêm một lần tiết kiệm.</p>
              <span className={styles.flashSchedule}>
                <CalendarDays size={18} aria-hidden="true" /> 10:00–13:00 thứ Tư
                hằng tuần
              </span>
            </div>
            <Countdown />
          </div>
          <div className={styles.couponGrid}>
            {swedDayOffers.map((item) => (
              <article
                key={item.code}
                className={`${styles.coupon} ${item.years === 3 ? styles.bestCoupon : ""}`}
              >
                <div className={styles.couponHeader}>
                  <span>CHU KỲ {item.years} NĂM</span>
                  {item.years === 3 ? (
                    <b>Ưu đãi cao nhất</b>
                  ) : (
                    <TicketPercent size={22} aria-hidden="true" />
                  )}
                </div>
                <p className={styles.couponDiscount}>
                  Giảm thêm
                  <strong>
                    {item.discount}
                    <span>%</span>
                  </strong>
                </p>
                <p className={styles.couponDescription}>
                  Chồng thêm trên giá Hot Deals
                </p>
                <div className={styles.ticketDivider} />
                <span className={styles.codeLabel}>MÃ ƯU ĐÃI CỦA BẠN</span>
                <CouponCode code={item.code} />
                <a
                  href="#hot-deals"
                  onClick={() => setCycle(item.cycle)}
                  className={styles.couponApply}
                >
                  Chọn gói {item.years} năm{" "}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
          <p className={styles.urgency}>
            <Flame size={20} aria-hidden="true" />
            <strong>Số lượng có hạn – Nhanh tay kẻo lỡ!</strong>
          </p>
        </div>
      </section>

      <section
        id="dieu-kien"
        className={styles.terms}
        aria-labelledby="terms-title"
      >
        <div className={`container ${styles.termsInner}`}>
          <div className={styles.termsHeading}>
            <Info size={25} aria-hidden="true" />
            <h2 id="terms-title">Lưu ý trước khi săn deal</h2>
          </div>
          <div>
            <p>
              Chỉ áp dụng với các <strong>HOT DEALS</strong> tại{" "}
              <a href={swedDayStore}>
                cửa hàng SWED DAY 2026{" "}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              , trong khung <strong>10:00–13:00 thứ Tư hằng tuần</strong> (giờ
              Việt Nam).
            </p>
            <ul>
              <li>
                <strong>Mã ONE TIME:</strong> Chỉ áp dụng cho lần thanh toán đầu
                tiên. Để hưởng ưu đãi dài hạn, Quý Khách nên cân nhắc đăng ký
                chu kỳ phù hợp.
              </li>
              <li>
                Chương trình không áp dụng cho thanh toán qua tài khoản credit
                tại InterData.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
