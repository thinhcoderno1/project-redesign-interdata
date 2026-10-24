"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from "react";
import { TESTIMONIALS } from "./data";
import { withAssetPrefix } from "./assets";

const STAR_PATH =
  "M8 1l1.854 3.756L14 5.429l-3 2.923.708 4.127L8 10.354l-3.708 2.125L5 8.352 2 5.429l4.146-.673z";

export default function Testimonials() {
  const ratings = [
    {
      platform: "Google",
      stars: 4.3,
      href: "https://maps.app.goo.gl/A7GAGdvTqqbjYhmu6",
    },
    {
      platform: "Facebook",
      stars: 5.0,
      href: "https://www.facebook.com/interdata.com.vn/reviews",
    },
    {
      platform: "HostAdvice",
      stars: 5.0,
      href: "https://hostadvice.com/hosting-company/inter-group-joint-stock-company-reviews/",
    },
  ];

  const GAP = 24;
  const MAX_CARD = 460;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(MAX_CARD);
  const [perView, setPerView] = useState(1);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      let pv = Math.max(1, Math.floor((w + GAP) / (MAX_CARD + GAP)));
      pv = Math.min(pv, total);
      const card = Math.min(MAX_CARD, Math.floor((w - (pv - 1) * GAP) / pv));
      setPerView(pv);
      setCardW(card);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [total]);

  const step = cardW + GAP;
  const canScroll = total > perView;
  const slides = canScroll
    ? [...TESTIMONIALS, ...TESTIMONIALS.slice(0, perView)]
    : TESTIMONIALS;

  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (
      !canScroll ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = setInterval(() => setIndex((i) => i + 1), 4500);
    return () => clearInterval(id);
  }, [canScroll, paused, total]);

  const handleTransitionEnd = () => {
    if (index >= total) {
      setAnim(false);
      setIndex(0);
    }
  };
  useEffect(() => {
    if (!anim) {
      const id = setTimeout(() => setAnim(true), 40);
      return () => clearTimeout(id);
    }
  }, [anim]);

  const go = (i: number) => {
    setAnim(true);
    setIndex(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? ((i % total) + total) % total
        : i,
    );
  };
  const next = () => go(index + 1);
  const prev = () => go(index <= 0 ? total - 1 : index - 1);
  const activeDot = ((index % total) + total) % total;

  const arrowBtn = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "1px solid #E9ECEF",
    background: "#fff",
    color: "#003B9A",
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    flexShrink: 0,
  } as const;

  return (
    <section
      className="id-testimonials-section"
      aria-labelledby="canhme-customers-title"
      style={{ padding: "64px 0", background: "#fff", overflow: "hidden" }}
    >
      <div>
        <div>
          <div
            className="id-testimonials-heading"
            style={{ textAlign: "center", marginBottom: 48, padding: "0 24px" }}
          >
            <div className="id-section-badge">FEEDBACKS</div>
            <h2
              id="canhme-customers-title"
              className="id-section-title"
              style={{
                color: "#1A1A2E",
                fontSize: 36,
                textTransform: "uppercase",
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: "0.05em",
              }}
            >
              Khách hàng nói gì về InterData?
            </h2>
          </div>

          <div
            className="id-testimonials-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setPaused(false);
            }}
            style={{
              padding: "4px 24px 4px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {canScroll && (
              <button
                className="id-testimonials-arrow is-prev"
                aria-label="Trước"
                onClick={prev}
                style={arrowBtn}
              >
                &lsaquo;
              </button>
            )}

            <div
              className="id-testimonials-viewport"
              ref={viewportRef}
              style={{ overflow: "hidden", flex: 1 }}
            >
              <div
                onTransitionEnd={handleTransitionEnd}
                style={{
                  display: "flex",
                  gap: GAP,
                  transform: `translateX(${-index * step}px)`,
                  transition: anim
                    ? "transform 0.6s cubic-bezier(0.4,0,0.2,1)"
                    : "none",
                }}
              >
                {slides.map((t, si) => (
                  <div
                    key={si}
                    aria-hidden={si >= total || undefined}
                    className={`id-testimonial-card ${
                      expandedFeedback === t.name ? "is-expanded" : ""
                    }`}
                    style={{
                      display: "flex",
                      alignSelf: "flex-start",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid #E9ECEF",
                      background: "#fff",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                      height: expandedFeedback === t.name ? "auto" : 320,
                      minHeight: 320,
                      width: cardW,
                      flexShrink: 0,
                      transition: "box-shadow 0.25s ease",
                    }}
                  >
                    {/* LEFT — 38% */}
                    <div
                      className="id-testimonial-profile"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: 28,
                        width: "38%",
                        flexShrink: 0,
                        background: "#F4F6FB",
                        borderRight: "1px solid #E9ECEF",
                      }}
                    >
                      <div
                        className="id-testimonial-logo"
                        style={{
                          background: "#fff",
                          borderRadius: 12,
                          padding: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          maxHeight: 64,
                          border: "1px solid #E9ECEF",
                        }}
                      >
                        <img
                          src={withAssetPrefix(t.logo)}
                          alt={t.company}
                          style={{
                            maxHeight: 40,
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      <div
                        className="id-testimonial-stars"
                        style={{ display: "flex", gap: 2, marginBottom: 16 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="#FBBF24"
                          >
                            <path d={STAR_PATH} />
                          </svg>
                        ))}
                      </div>

                      <div
                        className="id-testimonial-author"
                        style={{ marginTop: "auto" }}
                      >
                        <p
                          className="id-testimonial-name"
                          style={{
                            fontWeight: 700,
                            color: "#1A1A2E",
                            lineHeight: 1.2,
                          }}
                        >
                          {t.name}
                        </p>
                        <p
                          className="id-testimonial-company"
                          style={{
                            color: "#3D43ED",
                            fontWeight: 500,
                            marginTop: 4,
                            lineHeight: 1.35,
                          }}
                        >
                          {t.company}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT — 62% */}
                    <div
                      className="id-testimonial-body"
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        padding: "28px 28px 28px 36px",
                        overflow: "hidden",
                        flex: 1,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: "18rem",
                          lineHeight: 1,
                          color: "rgba(61,67,237,0.07)",
                          fontFamily: "Georgia, serif",
                          position: "absolute",
                          top: "-2rem",
                          left: "-1rem",
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      >
                        &ldquo;
                      </span>

                      <div
                        style={{
                          position: "relative",
                          zIndex: 10,
                          width: "100%",
                        }}
                      >
                        <p
                          className={`id-testimonial-content ${
                            expandedFeedback === t.name ? "is-expanded" : ""
                          }`}
                          style={{
                            color: "#444",
                            lineHeight: 1.65,
                            fontWeight: 500,
                            overflowWrap: "break-word",
                          }}
                        >
                          {t.content}
                        </p>

                        <button
                          className="id-testimonial-toggle"
                          type="button"
                          onClick={() =>
                            setExpandedFeedback(
                              expandedFeedback === t.name ? null : t.name,
                            )
                          }
                          aria-expanded={expandedFeedback === t.name}
                          tabIndex={si >= total ? -1 : 0}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 14,
                            padding: 0,
                            border: "none",
                            background: "transparent",
                            color: "#0A55D9",
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {expandedFeedback === t.name
                            ? "Thu gọn"
                            : "Xem đầy đủ"}
                          <span aria-hidden="true">
                            {expandedFeedback === t.name ? "↑" : "↓"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {canScroll && (
              <button
                className="id-testimonials-arrow is-next"
                aria-label="Sau"
                onClick={next}
                style={arrowBtn}
              >
                &rsaquo;
              </button>
            )}
          </div>

          {canScroll && (
            <div
              className="id-testimonials-dots"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginTop: 24,
              }}
            >
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Tới đánh giá ${i + 1}`}
                  aria-current={activeDot === i ? "true" : undefined}
                  onClick={() => go(i)}
                  style={{
                    width: activeDot === i ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    background: activeDot === i ? "#003B9A" : "#D1D5DB",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              marginTop: 48,
              padding: "0 16px",
            }}
          >
            {ratings.map((r, idx) => (
              <a
                key={r.platform}
                href={r.href}
                target="_blank"
                rel="nofollow noopener"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 28px",
                  borderRadius: 16,
                  border: "1px solid #E9ECEF",
                  background: "#F8F9FA",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    color: "#666",
                    fontSize: 15,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.platform}
                </span>

                <span
                  style={{
                    width: 1,
                    height: 24,
                    background: "rgba(0,0,0,0.12)",
                    flexShrink: 0,
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {[...Array(5)].map((_, i) => {
                    const fill = Math.min(1, Math.max(0, r.stars - i));
                    return (
                      <svg key={i} width="20" height="20" viewBox="0 0 16 16">
                        <defs>
                          <linearGradient id={`sg-${idx}-${i}`}>
                            <stop
                              offset={`${fill * 100}%`}
                              stopColor="#FBBF24"
                            />
                            <stop
                              offset={`${fill * 100}%`}
                              stopColor="#E5E7EB"
                            />
                          </linearGradient>
                        </defs>
                        <path d={STAR_PATH} fill={`url(#sg-${idx}-${i})`} />
                      </svg>
                    );
                  })}
                </div>

                <span
                  style={{
                    color: "#1A1A2E",
                    fontWeight: 800,
                    fontSize: 22,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {r.stars}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
