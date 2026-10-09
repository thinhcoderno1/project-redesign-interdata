"use client";
import { useRef, useState } from "react";
import { needs, links } from "@/data/content";
import { Icon } from "./icon";
export function Consultation() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const need = needs[active];
  const secondaryHref =
    "secondaryHref" in need ? need.secondaryHref : links.contact;
  const secondaryCta =
    "secondaryCta" in need ? need.secondaryCta : "Trao đổi với InterData";
  return (
    <section id="nhu-cau" className="consultation section">
      <div className="container">
        <span className="eyebrow">BẠN CẦN HẠ TẦNG CHO VIỆC GÌ?</span>
        <div className="section-heading">
          <h2>Chọn hạ tầng theo nhu cầu triển khai</h2>
          <p>
            Chọn nhu cầu gần nhất để xem gợi ý VPS, Cloud Server, máy chủ và
            giải pháp triển khai phù hợp. Cấu hình cụ thể sẽ được trao đổi theo
            hệ thống của bạn.
          </p>
        </div>
        <div className="consultation-layout">
          <div
            role="tablist"
            aria-label="Nhu cầu hạ tầng"
            aria-orientation="vertical"
            className="need-tabs"
          >
            {needs.map((n, i) => (
              <button
                key={n.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`tab-${n.id}`}
                aria-controls="need-panel"
                aria-selected={active === i}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  let next = i;
                  if (e.key === "ArrowDown" || e.key === "ArrowRight")
                    next = (i + 1) % needs.length;
                  else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
                    next = (i + needs.length - 1) % needs.length;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = needs.length - 1;
                  else return;
                  e.preventDefault();
                  setActive(next);
                  tabs.current[next]?.focus();
                }}
              >
                <Icon name={n.icon} />
                <span>{n.name}</span>
                <Icon name="arrow" />
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id="need-panel"
            aria-labelledby={`tab-${need.id}`}
            tabIndex={0}
            className="need-panel"
          >
            <span className="panel-label">GỢI Ý CHO NHU CẦU CỦA BẠN</span>
            <h3>{need.title}</h3>
            <p>{need.description}</p>
            <div className="recommendations">
              {need.recommendations.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
            <p>{need.reason}</p>
            <div className="prepare">
              <strong>Nên chuẩn bị trước khi tư vấn</strong>
              <ul>
                {need.checks.map((c) => (
                  <li key={c}>
                    <Icon name="check" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel-actions">
              <a href={need.href} className="button primary">
                {need.cta}
                <Icon name="arrow" />
              </a>
              {need.href !== links.contact && (
                <a className="text-link" href={secondaryHref}>
                  {secondaryCta} <Icon name="external" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
