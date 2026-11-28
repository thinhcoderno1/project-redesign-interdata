"use client";

import {
  ArrowRight,
  CalendarDays,
  Cloud,
  Gift,
  Info,
  LockKeyhole,
  Server,
  Zap,
} from "lucide-react";
import {
  blackFridayFlashSale,
  blackFridayFlashSaleConditions,
  blackFridayFlashSaleUpcomingDates,
} from "@/data/black-friday";
import {
  blackFridayFlashSaleFreeOffers,
  blackFridayFlashSaleGroups,
} from "@/data/black-friday-flash-sale";
import { splitCountdown } from "@/lib/flash-sale";
import { useFlashSaleRelease } from "./use-flash-sale-release";
import styles from "./flash-sale-offers.module.css";

const countdownLabels = ["Ngày", "Giờ", "Phút", "Giây"];
const groupIcons = { vps: Server, cloud: Cloud };
const openingDateLabel = new Intl.DateTimeFormat("vi-VN", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});
const upcomingDateLabel = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Ho_Chi_Minh",
});
const bannerTimeLabel = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Ho_Chi_Minh",
});
const upcomingDates = blackFridayFlashSaleUpcomingDates.map((date) => ({
  date,
  label: upcomingDateLabel.format(new Date(date)),
}));

function OfferAction({
  label,
  checkoutHref,
}: {
  label: string;
  checkoutHref: string;
}) {
  return (
    <>
      <div className={styles.locked}>
        <LockKeyhole size={14} aria-hidden="true" /> Đang cập nhật
      </div>
      <a
        className={styles.register}
        href={checkoutHref}
        rel="nofollow"
        aria-label={`Đăng ký ngay ${label}`}
      >
        Đăng ký ngay <ArrowRight size={16} aria-hidden="true" />
      </a>
    </>
  );
}

export function FlashSaleOffers() {
  const { release } = useFlashSaleRelease();
  const startsAt = release?.startsAt ?? blackFridayFlashSale.startsAt;
  const openingDate = new Date(startsAt ?? NaN);
  const hasOpeningDate = Number.isFinite(openingDate.getTime());
  const openingDay = hasOpeningDate
    ? openingDateLabel.format(openingDate)
    : null;
  const bannerTime = hasOpeningDate
    ? bannerTimeLabel.format(openingDate).replace(/\s+/g, "")
    : null;
  const live = release?.status === "live";
  const values = splitCountdown(0);
  return (
    <section
      id="flash-sale"
      className={styles.section}
      aria-labelledby="flash-sale-title"
    >
      <div className="container">
        <header className={styles.hero}>
          <svg
            className={styles.heroBolt}
            viewBox="0 0 244 276"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M140 10 29 153h75l-26 113 137-153h-81l34-103z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>

          <div className={styles.intro}>
            <p className={styles.eyebrow}>
              <Zap size={15} aria-hidden="true" /> Black Friday 2026
            </p>
            <h2 id="flash-sale-title">
              Flash <span>Sale</span>
            </h2>
            {bannerTime && openingDay && (
              <p className={styles.event}>
                <CalendarDays size={17} aria-hidden="true" />
                <time dateTime={startsAt ?? undefined}>
                  {bannerTime} · {openingDay}
                </time>
              </p>
            )}
            {upcomingDates.length > 0 && (
              <p className={styles.upcoming}>
                <span>Khung giờ tiếp theo</span>
                <span className={styles.upcomingDates}>
                  {upcomingDates.map(({ date, label }) => (
                    <time key={date} dateTime={date}>
                      {label}
                    </time>
                  ))}
                </span>
              </p>
            )}
          </div>

          <div className={styles.clock}>
            <p className={styles.clockHeading}>
              {live && <span className={styles.indicator} aria-hidden="true" />}
              {live ? "Flash Sale đã mở" : "Flash Sale tiếp theo"}
            </p>
            <div
              className={styles.countdown}
              role="timer"
              aria-live="off"
              aria-label={values
                .map((value, index) => `${value} ${countdownLabels[index]}`)
                .join(", ")}
            >
              {values.map((value, index) => (
                <div key={countdownLabels[index]} aria-hidden="true">
                  <strong>{value}</strong>
                  <span>{countdownLabels[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className={styles.group} aria-labelledby="flash-gifts-title">
          <div className={styles.groupHeading}>
            <span className={styles.groupIcon}>
              <Gift size={18} aria-hidden="true" />
            </span>
            <h3 id="flash-gifts-title">Quà tặng đặc biệt</h3>
          </div>
          {blackFridayFlashSaleFreeOffers.map((offer) => {
            const headingId = `flash-${offer.id}-title`;
            return (
              <article
                className={styles.free}
                data-offer={offer.id}
                aria-labelledby={headingId}
                key={offer.id}
              >
                <div className={styles.freeInfo}>
                  <span className={styles.freeIcon}>
                    <Gift size={29} aria-hidden="true" />
                  </span>
                  <div>
                    <h4 id={headingId}>Tặng miễn phí {offer.plan}</h4>
                    {"specs" in offer && <p>{offer.specs}</p>}
                    {"subtitle" in offer && <p>{offer.subtitle}</p>}
                  </div>
                </div>
                <div className={styles.freePrice}>
                  0<span>đ</span>
                </div>
                <div className={styles.freeEnd}>
                  <OfferAction
                    label={`${offer.plan} miễn phí`}
                    checkoutHref={offer.checkoutHref}
                  />
                </div>
              </article>
            );
          })}
        </section>

        {blackFridayFlashSaleGroups.map(
          ({ id, title, checkoutHref, offers }) => {
            const Icon = groupIcons[id];
            const headingId = `flash-${id}-title`;
            return (
              <section
                className={styles.group}
                key={id}
                aria-labelledby={headingId}
              >
                <div className={styles.groupHeading}>
                  <span className={styles.groupIcon}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h3 id={headingId}>{title}</h3>
                </div>
                <div className={styles.grid}>
                  {offers.map(({ id: offerId, plan, specs, discount }) => (
                    <article
                      className={styles.ticket}
                      data-service={id}
                      data-offer={offerId}
                      key={offerId}
                    >
                      <div className={styles.ticketBody}>
                        <div className={styles.discount}>
                          Giảm <strong>{discount}%</strong>
                        </div>
                        <h4>
                          {plan} <span className={styles.specs}>{specs}</span>
                        </h4>
                      </div>
                      <div className={styles.ticketEnd}>
                        <OfferAction
                          label={`${plan} ${specs} giảm ${discount}%`}
                          checkoutHref={checkoutHref}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          },
        )}

        <details className={styles.flashTerms}>
          <summary>
            <Info size={18} aria-hidden="true" /> Điều kiện áp dụng
          </summary>
          <ul>
            {blackFridayFlashSaleConditions.map((condition) => (
              <li key={condition}>{condition}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
