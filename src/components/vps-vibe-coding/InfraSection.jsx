import { infraSpecs } from "./data";

const icons = {
  cpu: (
    <>
      <rect x="7.5" y="7.5" width="9" height="9" rx="1.4" />
      <rect x="4" y="4" width="16" height="16" rx="2.4" />
      <path d="M9 1.8v2.2M15 1.8v2.2M9 20v2.2M15 20v2.2M1.8 9H4M1.8 15H4M20 9h2.2M20 15h2.2" />
    </>
  ),
  disk: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.2" />
      <circle cx="7" cy="12" r="1.3" />
      <path d="M11 12h7" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 18.5a8.5 8.5 0 1 1 16 0" />
      <path d="m12 14.5 4.2-4.2" />
      <circle cx="12" cy="18.5" r="1.3" />
    </>
  ),
  infinity: (
    <path d="M7 9a3 3 0 1 0 0 6c2.2 0 3.6-2 5-3s2.8-3 5-3a3 3 0 1 1 0 6c-2.2 0-3.6-2-5-3S9.2 9 7 9Z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.4 9.5h17.2M3.4 14.5h17.2" />
      <path d="M12 3c2.6 3 3.9 5.9 3.9 9s-1.3 6-3.9 9c-2.6-3-3.9-5.9-3.9-9S9.4 6 12 3Z" />
    </>
  ),
  rack: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="1.6" />
      <rect x="3" y="14" width="18" height="6" rx="1.6" />
      <path d="M6.8 7h.02M6.8 17h.02" />
    </>
  ),
};

export default function InfraSection() {
  return (
    <section id="hatang" className="section infra-section">
      <div className="container">
        <div className="infra-head">
          <span className="eyebrow on-light">Công nghệ</span>
          <h2 className="section-title">
            Nền tảng hạ tầng cho dịch vụ <br></br>
            <span>VPS Vibe Coding</span>
          </h2>
        </div>
        <div className="infra-grid">
          {infraSpecs.map((spec) => (
            <article className="infra-card" key={spec.value}>
              <div className="infra-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {icons[spec.icon]}
                </svg>
              </div>
              <span className="infra-label">{spec.label}</span>
              <b className="infra-value">{spec.value}</b>
              <p className="infra-desc">{spec.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
