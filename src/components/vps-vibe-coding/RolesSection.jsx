import { roleLayers } from "./data";

const icons = {
  you: (
    <>
      <circle cx="10" cy="8" r="3.6" />
      <path d="M3.6 20.5a6.6 6.6 0 0 1 11.3-4.4" />
      <path d="m18.4 13.2.95 2.25 2.25.95-2.25.95-.95 2.25-.95-2.25-2.25-.95 2.25-.95.95-2.25Z" />
    </>
  ),
  platform: (
    <>
      <path d="m12 2.8 8.7 4.6-8.7 4.6-8.7-4.6 8.7-4.6Z" />
      <path d="m3.3 12 8.7 4.6 8.7-4.6" />
      <path d="m3.3 16.6 8.7 4.6 8.7-4.6" />
    </>
  ),
  infra: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="1.6" />
      <rect x="3" y="14" width="18" height="6" rx="1.6" />
      <path d="M6.8 7h.02M6.8 17h.02" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="5.8" rx="7.4" ry="2.9" />
      <path d="M4.6 5.8v12.4c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V5.8" />
      <path d="M4.6 12c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9" />
    </>
  ),
};

const layerMeta = [
  { number: "01", status: "Creative control" },
  { number: "02", status: "Platform ready" },
  { number: "03", status: "Online 24/7" },
];

export default function RolesSection() {
  return (
    <section className="section roles-section" id="how-it-works">
      <div className="roles-ambient" aria-hidden="true" />
      <div className="container roles-shell">
        <div className="roles-copy">
          <span className="eyebrow">Hệ thống vận hành</span>
          <h2 className="section-title">
            Bạn tạo ý tưởng.
            <br /> <span>Hệ thống lo phần còn lại.</span>
          </h2>
          <p className="lead">
            Ba lớp phối hợp thành một quy trình xuyên suốt: AI giúp bạn tạo sản
            phẩm, EzyPlatform vận hành công cụ và InterData giữ mọi thứ luôn sẵn
            sàng.
          </p>

          <div
            className="roles-console"
            aria-label="Luồng vận hành của VPS Vibe Coding"
          >
            <div className="roles-console-bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <b>vibe-workflow</b>
            </div>
            <div className="roles-console-body">
              <p>
                <span>01</span>
                <code>prompt</code>
                <b>Mô tả ý tưởng bằng tiếng Việt</b>
              </p>
              <p>
                <span>02</span>
                <code>build</code>
                <b>AI tạo và EzyPlatform triển khai</b>
              </p>
              <p>
                <span>03</span>
                <code>run</code>
                <b>InterData vận hành ổn định 24/7</b>
              </p>
              <div className="roles-console-result">
                <i /> SYSTEM READY
              </div>
            </div>
          </div>
        </div>

        <div className="roles-architecture">
          <div className="roles-stack-label">
            <span>Technology control stack</span>
            <b>03 layers connected</b>
          </div>
          <div className="roles-stack">
            <div className="roles-energy-line" aria-hidden="true">
              <i />
            </div>
            {roleLayers.map((layer, i) => (
              <article
                className={`role-layer role-layer-${layer.tone}`}
                key={layer.id}
              >
                <div className="role-layer-topline">
                  <span className="role-layer-number">
                    {layerMeta[i].number}
                  </span>
                  <span className="role-layer-status">
                    <i />
                    {layerMeta[i].status}
                  </span>
                </div>
                <div className="role-layer-head">
                  <div className="role-layer-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {icons[layer.icon]}
                    </svg>
                  </div>
                  <div>
                    <span className="role-layer-tag">{layer.tag}</span>
                    <h3>{layer.title}</h3>
                  </div>
                </div>
                <ul className="role-layer-list">
                  {layer.items.map((item) => (
                    <li key={item}>
                      <svg
                        className="role-check"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="m5 12.6 4.4 4.4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}

            <aside className="roles-data">
              <div className="roles-data-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {icons.data}
                </svg>
              </div>
              <div>
                <span>Data ownership</span>
                <h3>Dữ liệu luôn thuộc quyền kiểm soát của bạn</h3>
                <p>
                  Mã nguồn, nội dung và dữ liệu kinh doanh được lưu trên hạ tầng
                  InterData, sao lưu định kỳ và không bị khóa trong nền tảng.
                </p>
              </div>
              <b className="roles-data-badge">
                <i /> Protected
              </b>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
