/* eslint-disable @next/next/no-img-element */
import { PRESS } from "./data";
import { withAssetPrefix } from "./assets";

export default function PressSection() {
  const loopCards = [...PRESS, ...PRESS];

  return (
    <section
      className="id-press-section"
      aria-labelledby="canhme-press-title"
      style={{ background: "#fff", padding: "60px 0" }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          marginBottom: 40,
        }}
      >
        <div className="id-section-badge">INTERDATA</div>
        <h2
          id="canhme-press-title"
          className="id-section-title"
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "0.02em",
            color: "#1A1A2E",
            margin: 0,
          }}
        >
          Báo chí nói gì về InterData
        </h2>
      </div>

      <div
        className="press-card-mask"
        style={{ overflow: "hidden", padding: "4px 8px" }}
      >
        <div className="press-card-track">
          {loopCards.map((item, i) => (
            <a
              className="press-card"
              key={`card-${i}`}
              aria-hidden={i >= PRESS.length || undefined}
              tabIndex={i >= PRESS.length ? -1 : undefined}
              href={item.href}
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  height: 215,
                }}
              >
                <img
                  className="press-card-img"
                  src={withAssetPrefix(item.thumb)}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    background: "#fff",
                    border: "1px solid #E9ECEF",
                    borderRadius: 9999,
                    padding: "2px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 28,
                    maxWidth: 110,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <img
                    src={withAssetPrefix(item.partnerLogo)}
                    alt="logo"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>

              <div style={{ padding: 22 }}>
                <p
                  className="press-card-title"
                  style={{
                    color: "#1A1A2E",
                    fontWeight: 600,
                    lineHeight: 1.55,
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.title}
                </p>
                <span
                  className="press-card-link"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 14,
                    color: "#0A63FF",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  Đọc bài viết
                  <svg
                    className="press-card-arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6h8M7 3l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
