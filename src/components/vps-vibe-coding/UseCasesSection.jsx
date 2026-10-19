"use client";

import SourceImage from "./source-image";
import { useRef, useState } from "react";
import { noCodeUseCases, techUseCases } from "./data";
import { withAssetPrefix } from "./assets";

const tabs = [
  { id: "nocode", label: "Nếu bạn low-code", items: noCodeUseCases },
  { id: "tech", label: "Nếu bạn là dân kỹ thuật", items: techUseCases },
];

const icons = {
  store: (
    <>
      <path d="M4 9.5V20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5" />
      <path d="M2.5 9.5 4.6 4h14.8l2.1 5.5a3.2 3.2 0 0 1-6.4 0 3.2 3.2 0 0 1-6.4 0 3.2 3.2 0 0 1-6.2 0Z" />
      <path d="M9.7 21v-6h4.6v6" />
    </>
  ),
  magnet: (
    <>
      <path d="M6 3H3v8a9 9 0 0 0 18 0V3h-3v8a6 6 0 0 1-12 0V3Z" />
      <path d="M3 8.2h3M18 8.2h3" />
    </>
  ),
  news: (
    <>
      <path d="M4 5h12a1 1 0 0 1 1 1v13H5.5A1.5 1.5 0 0 1 4 17.5V5Z" />
      <path d="M17 9.5h2a1 1 0 0 1 1 1v7a1.5 1.5 0 0 1-3 1.5" />
      <path d="M7 9h6M7 12.5h6M7 16h3.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3.2 20a5.8 5.8 0 0 1 11.6 0" />
      <path d="M16 5.3a3.4 3.4 0 0 1 0 5.4" />
      <path d="M17.6 14.4A5.8 5.8 0 0 1 20.8 20" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2.5c3.2 2.6 5 6.4 5 10.5l-2.5 2.5h-5L7 13c0-4.1 1.8-7.9 5-10.5Z" />
      <circle cx="12" cy="10" r="1.9" />
      <path d="M9.5 15.6 7 17.2l1 3.4 2.4-1.6M14.5 15.6 17 17.2l-1 3.4-2.4-1.6" />
    </>
  ),
  screens: (
    <>
      <rect x="2.5" y="4.5" width="12.5" height="9" rx="1.8" />
      <rect x="9" y="11" width="12.5" height="9" rx="1.8" />
      <path d="M19 2.4l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4a1 1 0 0 0 1 1h2.6L14 19V5L7.6 9H5a1 1 0 0 0-1 1Z" />
      <path d="M17.6 8.6a4.8 4.8 0 0 1 0 6.8" />
      <path d="M7.6 15v4.4" />
    </>
  ),
};

function Placeholder({ title }) {
  return (
    <div className="uc-placeholder">
      <svg viewBox="0 0 320 240" aria-hidden="true">
        <rect x="14" y="14" width="74" height="212" rx="8" />
        <rect x="100" y="14" width="206" height="62" rx="8" />
        <rect x="100" y="88" width="97" height="60" rx="8" />
        <rect x="209" y="88" width="97" height="60" rx="8" />
        <rect x="100" y="160" width="206" height="66" rx="8" />
      </svg>
      <small>[placeholder: ảnh minh họa &quot;{title}&quot;]</small>
    </div>
  );
}

// Tu lui ve placeholder neu file anh chua co, tranh hien anh vo
function Mockup({ src, alt, title }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <Placeholder title={title} />;
  return (
    <SourceImage
      src={withAssetPrefix(src)}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

export default function UseCasesSection() {
  const [tabId, setTabId] = useState("nocode");
  const [index, setIndex] = useState(0);
  const buttons = useRef([]);
  function keyboard(event, current) {
    let next = current;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft")
      next = 1 - current;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 1;
    else return;
    event.preventDefault();
    setTabId(tabs[next].id);
    setIndex(0);
    buttons.current[next]?.focus();
  }

  const tab = tabs.find((item) => item.id === tabId);
  const active = tab.items[index];

  return (
    <section id="lamduoc" className="section uc-section">
      <div className="uc-pattern" aria-hidden="true" />
      <div className="container center uc-container">
        <span className="eyebrow on-light uc-production-badge">Production</span>
        <h2 className="section-title">Chúng ta có thể Vibe Code gì?</h2>
        <div className="tabs" role="tablist" aria-label="Nhóm người dùng">
          {tabs.map((item, tabIndex) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`vibe-usecase-${item.id}`}
              aria-controls="vibe-usecase-panel"
              tabIndex={tabId === item.id ? 0 : -1}
              ref={(element) => {
                buttons.current[tabIndex] = element;
              }}
              onKeyDown={(event) => keyboard(event, tabIndex)}
              aria-selected={tabId === item.id}
              className={tabId === item.id ? "active" : ""}
              onClick={() => {
                setTabId(item.id);
                setIndex(0);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          id="vibe-usecase-panel"
          role="tabpanel"
          aria-labelledby={`vibe-usecase-${tabId}`}
          tabIndex={0}
          className="uc-showcase"
          style={{ "--active-tint": active.tint }}
        >
          <ul className="uc-list">
            {tab.items.map((useCase, i) => (
              <li key={useCase.title}>
                <button
                  className={`uc-option ${i === index ? "is-active" : ""}`}
                  style={{ "--tint": useCase.tint }}
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                >
                  <span className="uc-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {icons[useCase.icon]}
                    </svg>
                  </span>
                  <span className="uc-text">
                    <b>{useCase.title}</b>
                    <span>{useCase.desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <figure className="uc-stage">
            <span
              className="uc-stage-layer uc-stage-layer-one"
              aria-hidden="true"
            />
            <span
              className="uc-stage-layer uc-stage-layer-two"
              aria-hidden="true"
            />
            <div className="window-bar">
              <i />
              <i />
              <i />
              <span>{active.title}</span>
              <b className="uc-live">
                <i /> Live preview
              </b>
            </div>
            <div className="uc-page" key={`${tabId}-${active.title}`}>
              <Mockup
                src={active.image}
                alt={active.alt}
                title={active.title}
              />
            </div>
          </figure>
        </div>

        <a className="btn primary uc-cta" href="#gia">
          Dùng thử 7 ngày và tự tay dựng thử
        </a>
      </div>
    </section>
  );
}
