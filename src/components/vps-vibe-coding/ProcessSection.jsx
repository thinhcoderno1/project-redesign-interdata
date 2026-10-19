import { steps } from "./data";

function OsPicker({ template }) {
  return (
    <div className="ps-picker" aria-hidden="true">
      <div className="ps-picker-head">
        <span className="ps-picker-label">OS Template</span>
        <b>Required</b>
      </div>
      <div className="ps-picker-field">
        <span>{template}</span>
        <svg viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
    </div>
  );
}

function ProcessArt() {
  return (
    <svg className="ps-art" viewBox="0 0 380 330" aria-hidden="true">
      <defs>
        <linearGradient id="psAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--brand-primary)" />
          <stop offset="1" stopColor="var(--brand-primary)" />
        </linearGradient>
        <radialGradient id="psGlow">
          <stop offset="0" stopColor="var(--brand-primary)" stopOpacity=".15" />
          <stop offset="1" stopColor="var(--brand-primary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="190" cy="158" rx="168" ry="142" fill="url(#psGlow)" />
      <ellipse
        cx="196"
        cy="316"
        rx="92"
        ry="8"
        fill="var(--text-primary)"
        opacity=".05"
      />

      {/* Bang dieu khien dang dung may */}
      <rect
        x="34"
        y="26"
        width="290"
        height="210"
        rx="16"
        fill="#fff"
        stroke="#e2e5ee"
        strokeWidth="1.5"
      />
      <circle cx="52" cy="44" r="3.4" fill="#dcdfea" />
      <circle cx="64" cy="44" r="3.4" fill="#dcdfea" />
      <circle cx="76" cy="44" r="3.4" fill="#dcdfea" />
      <path d="M34 58h290" stroke="var(--border-default)" strokeWidth="1" />

      <rect
        x="54"
        y="76"
        width="56"
        height="56"
        rx="13"
        fill="url(#psAccent)"
      />
      <rect
        x="65"
        y="90"
        width="34"
        height="5"
        rx="2.5"
        fill="#fff"
        opacity=".85"
      />
      <rect
        x="65"
        y="103"
        width="22"
        height="5"
        rx="2.5"
        fill="#fff"
        opacity=".5"
      />
      <circle cx="95" cy="118" r="3" fill="#fff" opacity=".8" />

      <rect
        x="126"
        y="88"
        width="176"
        height="10"
        rx="5"
        fill="var(--border-default)"
      />
      <rect
        x="126"
        y="88"
        width="128"
        height="10"
        rx="5"
        fill="url(#psAccent)"
      />
      <rect x="126" y="110" width="104" height="7" rx="3.5" fill="#e6e9f4" />
      <rect x="126" y="124" width="70" height="7" rx="3.5" fill="#eef0f6" />

      {[158, 186, 214].map((y, i) => (
        <g key={y}>
          <circle cx="68" cy={y} r="9" fill="url(#psAccent)" />
          <path
            d={`m64 ${y} 2.8 2.8 5.2-5.6`}
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="86"
            y={y - 4}
            width={[170, 138, 152][i]}
            height="8"
            rx="4"
            fill="#e6e9f4"
          />
        </g>
      ))}

      {/* Email ban giao */}
      <rect
        x="196"
        y="226"
        width="126"
        height="80"
        rx="12"
        fill="#fff"
        stroke="#e2e5ee"
        strokeWidth="1.5"
      />
      <path
        d="M198 234 259 274 320 234"
        fill="none"
        stroke="#cfd3ea"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="322"
        cy="226"
        r="15"
        fill="url(#psAccent)"
        stroke="#fff"
        strokeWidth="2"
      />
      <path
        d="m316.5 226 3.6 3.6 6.4-7"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProcessSection() {
  return (
    <section className="section section-soft ps-section">
      <div className="ps-pattern" aria-hidden="true" />
      <div className="container ps-container">
        <div className="ps-head">
          <span className="eyebrow on-light">Cách thiết lập</span>
          <h2 className="section-title">
            Chỉ vài bước từ đăng ký đến bắt đầu <span>Vibe Code</span>
          </h2>
        </div>

        <div className="ps-layout">
          <ol className="ps-timeline">
            {steps.map((step, index) => (
              <li
                className={`ps-step ${step.template ? "is-key-step" : ""} ${index === steps.length - 1 ? "is-final" : ""}`}
                key={step.title}
              >
                <div className="ps-marker">
                  <span>{index + 1}</span>
                </div>
                <details className="ps-body">
                  <summary className="ps-step-summary">
                    <span>
                      <span className="ps-step-code">Step 0{index + 1}</span>
                      <h3>{step.title}</h3>
                    </span>
                    <span className="ps-step-chevron" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m7 10 5 5 5-5" />
                      </svg>
                    </span>
                  </summary>
                  <div className="ps-step-detail">
                    <p>{step.desc}</p>
                    {step.template && <OsPicker template={step.template} />}
                    {step.note && <p className="ps-note">{step.note}</p>}
                  </div>
                </details>
              </li>
            ))}
          </ol>
          <div className="ps-visual">
            <span
              className="ps-visual-layer ps-visual-layer-one"
              aria-hidden="true"
            />
            <span
              className="ps-visual-layer ps-visual-layer-two"
              aria-hidden="true"
            />
            <div className="ps-visual-bar">
              <span>
                <i />
                <i />
                <i />
              </span>
              <b>VPS Setup Progress</b>
              <em>
                <i /> Provisioning complete
              </em>
            </div>
            <div className="ps-visual-body">
              <ProcessArt />
            </div>
            <div className="ps-visual-foot">
              <span>
                <i /> OS installed
              </span>
              <span>
                <i /> EzyPlatform ready
              </span>
              <span>
                <i /> Access delivered
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
