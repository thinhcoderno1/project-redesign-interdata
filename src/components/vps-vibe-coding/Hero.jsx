"use client";

import { useEffect, useState } from "react";

const vibeProofSegments = [
  { text: "Landing page này được " },
  { text: "vibe code 100%", strong: true },
  { text: " khi tôi đang ngồi thưởng thức 1 tách " },
  { text: "Cafe Robusta kết hợp cùng Arabica", strong: true },
  { text: ". Còn bạn thì sao? 🤨", strong: true },
];
const vibeProofText = vibeProofSegments.map(({ text }) => text).join("");

export default function Hero() {
  const [isProofOpen, setIsProofOpen] = useState(true);
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    if (!isProofOpen) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(
        () => setTypedLength(vibeProofText.length),
        0,
      );
      return () => window.clearTimeout(id);
    }

    let intervalId;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setTypedLength((length) => {
          if (length >= vibeProofText.length) {
            window.clearInterval(intervalId);
            return length;
          }
          return length + 1;
        });
      }, 30);
    }, 220);

    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [isProofOpen]);

  function toggleProof() {
    setTypedLength(0);
    setIsProofOpen((open) => !open);
  }

  return (
    <section id="top" className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">Nơi Ý Tưởng Thành Hiện Thực</span>
          <h1>VPS Vibe Coding</h1>
          <p>
            Một chiếc máy chủ VPS đã cài sẵn mọi thứ. Bạn chỉ cần mô tả điều
            mình muốn bằng ngôn ngữ tự nhiên, AI dựng sản phẩm, InterData giữ
            cho sản phẩm chạy ổn định 24/7.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#gia">
              ĐĂNG KÝ NGAY
            </a>
            <a
              className="btn ghost"
              href="https://www.facebook.com/interdata.com.vn/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cần tư vấn?
            </a>
          </div>
          <div className="ticks">
            <span>1-click Deploy</span>
            <span>Dễ dàng triển khai</span>
            <span>Có domain dùng ngay</span>
            <span>Hỗ trợ 24/7</span>
          </div>
        </div>
        <div className="chat-card">
          <div className="window-bar">
            <i />
            <i />
            <i />
            <span>Vibe Coding - trò chuyện với AI</span>
          </div>
          <div className="chat-body">
            <p className="bubble user">
              Làm cho tôi trang bán hàng có giỏ hàng và thanh toán
              <span />
            </p>
            <p className="bubble ai">Đang dựng giao diện cho bạn...</p>
            <div className="preview">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      </div>
      <div className={`hero-vibe-widget${isProofOpen ? " is-open" : ""}`}>
        {
          <div
            className={`hero-vibe-proof${typedLength < vibeProofText.length ? " is-typing" : ""}`}
            id="hero-vibe-proof"
            hidden={!isProofOpen}
          >
            <button
              className="hero-vibe-proof-close"
              type="button"
              onClick={() => setIsProofOpen(false)}
              aria-label="Đóng câu chuyện vibe code"
            >
              ×
            </button>
            <p className="sr-only">{vibeProofText}</p>
            <p className="hero-vibe-proof-typed" aria-hidden="true">
              {vibeProofSegments.map((segment, index) => {
                const visibleText = segment.text.slice(
                  0,
                  Math.max(
                    0,
                    typedLength -
                      vibeProofSegments
                        .slice(0, index)
                        .reduce((length, item) => length + item.text.length, 0),
                  ),
                );
                return segment.strong ? (
                  <strong key={index}>{visibleText}</strong>
                ) : (
                  <span key={index}>{visibleText}</span>
                );
              })}
              <span className="hero-vibe-proof-cursor" />
            </p>
          </div>
        }
        <button
          className="hero-vibe-widget-button"
          type="button"
          aria-label={
            isProofOpen
              ? "Thu gọn câu chuyện vibe code"
              : "Xem câu chuyện vibe code của landing page"
          }
          aria-expanded={isProofOpen}
          aria-controls="hero-vibe-proof"
          onClick={toggleProof}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 8h11v6.5A4.5 4.5 0 0 1 11.5 19h-2A4.5 4.5 0 0 1 5 14.5V8Z" />
            <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M7 4.5c0 1 1 1.2 1 2.2M11 4.5c0 1 1 1.2 1 2.2" />
          </svg>
        </button>
      </div>
    </section>
  );
}
