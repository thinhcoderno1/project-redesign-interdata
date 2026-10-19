import { whyInterData } from "./data";

const icons = {
  support: (
    <>
      <path d="M4.5 13a7.5 7.5 0 0 1 15 0" />
      <rect x="2.5" y="12.8" width="4" height="6.4" rx="1.6" />
      <rect x="17.5" y="12.8" width="4" height="6.4" rx="1.6" />
      <path d="M19.5 19.2v.6a2.4 2.4 0 0 1-2.4 2.4H15" />
    </>
  ),
  backup: (
    <>
      <path d="M3.5 12a8.5 8.5 0 0 1 14.4-6.1L20.5 8" />
      <path d="M20.5 3.5V8H16" />
      <path d="M20.5 12a8.5 8.5 0 0 1-14.4 6.1L3.5 16" />
      <path d="M3.5 20.5V16H8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.3 3 8.3 7 9.5 4-1.2 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9.2 12.2 2 2 3.6-3.9" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="3.6" />
      <path d="M10.6 12.4 19 4" />
      <path d="m16.2 6.8 2.2 2.2" />
      <path d="m14.4 8.6 2.2 2.2" />
    </>
  ),
  bolt: <path d="M13 2 4.5 13.5h6L11 22l8.5-11.5h-6L13 2Z" />,
  tag: (
    <>
      <path d="M20.6 13.4 13.4 20.6a1.7 1.7 0 0 1-2.4 0l-7.5-7.5V3.5h9.6l7.5 7.5a1.7 1.7 0 0 1 0 2.4Z" />
      <circle cx="7.9" cy="7.9" r="1.3" />
    </>
  ),
};

function WhyArt() {
  return (
    <svg className="why-art" viewBox="0 0 380 300" aria-hidden="true">
      <defs>
        <linearGradient id="whyAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--brand-primary)" />
          <stop offset="1" stopColor="var(--brand-primary)" />
        </linearGradient>
        <linearGradient id="whyRack" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f8f9fc" />
        </linearGradient>
        <radialGradient id="whyGlow">
          <stop offset="0" stopColor="var(--brand-primary)" stopOpacity=".16" />
          <stop offset="1" stopColor="var(--brand-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="196" cy="152" rx="162" ry="132" fill="url(#whyGlow)" />
      <ellipse
        cx="190"
        cy="268"
        rx="88"
        ry="8"
        fill="var(--text-primary)"
        opacity=".05"
      />

      {/* Rack may chu */}
      <rect
        x="104"
        y="84"
        width="172"
        height="176"
        rx="16"
        fill="url(#whyRack)"
        stroke="#e2e5ee"
        strokeWidth="1.5"
      />
      {[100, 152, 204].map((y, i) => (
        <g key={y}>
          <rect
            x="120"
            y={y}
            width="140"
            height="44"
            rx="9"
            fill="var(--surface-subtle)"
            stroke="var(--border-default)"
            strokeWidth="1"
          />
          <circle cx="137" cy={y + 22} r="4.5" fill="url(#whyAccent)" />
          <rect
            x="153"
            y={y + 19}
            width={[78, 60, 70][i]}
            height="6"
            rx="3"
            fill="#e0e3f3"
          />
        </g>
      ))}

      {/* Bang giam sat */}
      <rect
        x="34"
        y="44"
        width="156"
        height="80"
        rx="13"
        fill="#fff"
        stroke="#e2e5ee"
        strokeWidth="1.5"
      />
      <circle cx="48" cy="58" r="2.8" fill="#dcdfea" />
      <circle cx="58" cy="58" r="2.8" fill="#dcdfea" />
      <circle cx="68" cy="58" r="2.8" fill="#dcdfea" />
      <path d="M34 71h156" stroke="var(--border-default)" strokeWidth="1" />
      <path
        d="M46 100h18l8-19 12 34 8-23h20l5 8h60"
        fill="none"
        stroke="url(#whyAccent)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Khien bao ve */}
      <g transform="translate(258 166) scale(2.3)">
        <path
          d="M12 3 5 6v5.5c0 4.3 3 8.3 7 9.5 4-1.2 7-5.2 7-9.5V6l-7-3Z"
          fill="url(#whyAccent)"
          stroke="#fff"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path
          d="m9.2 12.2 2 2 3.6-3.9"
          fill="none"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function WhyInterDataSection() {
  return (
    <section id="interdata" className="section section-soft why-section">
      <div className="container">
        <div className="why-grid">
          <div className="why-intro">
            <span className="eyebrow on-light">Lợi ích</span>
            <h2 className="section-title left">
              Vì sao nên thuê VPS Vibe Coding Tại InterData?
            </h2>
            {/* <p className="lead why-lead">Hạ tầng mạnh mới là một nửa. Nửa còn lại là người vận hành nó cho bạn, mỗi ngày, kể cả lúc bạn đang ngủ.</p> */}
            <WhyArt />
          </div>
          <ul className="why-list">
            {whyInterData.map((reason) => (
              <li className="why-item" key={reason.title}>
                <div className="why-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {icons[reason.icon]}
                  </svg>
                </div>
                <div>
                  <h3>{reason.title}</h3>
                  <p>{reason.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
