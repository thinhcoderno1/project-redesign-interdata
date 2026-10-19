import SourceImage from "./source-image";
import { ezyIntegrations, ezyModules, ezyPillars } from "./data";
import { withAssetPrefix } from "./assets";

const icons = {
  website: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
    </>
  ),
  cms: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" />
      <path d="M14 3v6h6" />
      <path d="M8 13h8M8 17h5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  cart: (
    <>
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h3l2.4 12.1a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.3L21 7H6.2" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  api: (
    <>
      <path d="m9 7-5 5 5 5" />
      <path d="m15 7 5 5-5 5" />
    </>
  ),
  plugin: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </>
  ),
  ai: (
    <>
      <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9 12 3.5Z" />
      <path d="M18.8 3v3M20.3 4.5h-3" />
    </>
  ),
  flow: (
    <>
      <circle cx="5.5" cy="6" r="2.5" />
      <circle cx="18.5" cy="18" r="2.5" />
      <path d="M5.5 8.5v6a3 3 0 0 0 3 3h7.5" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0V8Z" />
      <path d="M12 17v4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
};

const activities = [
  ["Đọc yêu cầu", "done"],
  ["Tạo cấu trúc dữ liệu", "done"],
  ["Kết nối API", "done"],
  ["Dựng giao diện", "active"],
  ["Sẵn sàng triển khai", "waiting"],
];

export default function EzyPlatformSection() {
  return (
    <section id="ezyplatform" className="section section-dark ezy-section">
      <div className="ezy-grid-bg" aria-hidden="true" />
      <div className="container ezy-container">
        <div className="ezy-head">
          <span className="eyebrow ezy-brand">
            <i /> EzyPlatform
          </span>
          <h2 className="section-title">
            Một workspace. <span>Mọi công cụ AI cần</span> để biến ý tưởng thành
            sản phẩm.
          </h2>
          <p className="lead ezy-lead">
            Website, dữ liệu, bán hàng, email và API đã làm việc cùng nhau trong
            một nền tảng. AI có thể bắt tay vào xây dựng ngay, bạn không phải tự
            ghép hàng chục công cụ rời rạc.
          </p>
        </div>

        <div className="ezy-workspace">
          <div className="ezy-windowbar">
            <div className="ezy-window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="ezy-window-title">
              <SourceImage
                src={withAssetPrefix("/images/ezyplatform-logo.png")}
                alt="EzyPlatform"
              />
              <span>EzyPlatform</span>
            </div>
            <div className="ezy-system-state">
              <i /> System ready
            </div>
          </div>

          <div className="ezy-workspace-body">
            <aside className="ezy-sidebar">
              <div className="ezy-sidebar-label">Modules</div>
              <ul className="ezy-modules">
                {ezyModules.map((module, index) => (
                  <li
                    className={`ezy-module${index === 0 ? " is-active" : ""}`}
                    key={module.label}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {icons[module.icon]}
                    </svg>
                    <span>{module.label}</span>
                    <i />
                  </li>
                ))}
              </ul>
              <div className="ezy-sidebar-status">
                <i /> 7 modules connected
              </div>
            </aside>

            <div className="ezy-preview">
              <div className="ezy-preview-top">
                <div>
                  <span>Live workspace</span>
                  <h3>Store Dashboard</h3>
                </div>
                <div className="ezy-preview-tools">
                  <span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {icons.search}
                    </svg>
                  </span>
                  <span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {icons.bell}
                    </svg>
                  </span>
                  <b>AD</b>
                </div>
              </div>

              <div className="ezy-kpis">
                <article>
                  <span>Đơn hàng</span>
                  <strong>1,284</strong>
                  <small>+12.5%</small>
                </article>
                <article>
                  <span>Doanh thu</span>
                  <strong>86.4M</strong>
                  <small>+8.2%</small>
                </article>
                <article>
                  <span>Khách hàng</span>
                  <strong>3,092</strong>
                  <small>+18.9%</small>
                </article>
              </div>

              <div className="ezy-dashboard-grid">
                <article className="ezy-chart">
                  <div className="ezy-widget-head">
                    <b>Hiệu suất bán hàng</b>
                    <span>7 ngày</span>
                  </div>
                  <div className="ezy-chart-visual" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <svg viewBox="0 0 300 90" preserveAspectRatio="none">
                      <path d="M0 72 C28 62 42 70 66 51 S108 61 134 37 S175 52 199 29 S241 39 300 8" />
                    </svg>
                  </div>
                </article>
                <article className="ezy-orders">
                  <div className="ezy-widget-head">
                    <b>Đơn gần đây</b>
                    <span>Live</span>
                  </div>
                  <ul>
                    <li>
                      <i className="purple" />
                      <span>#EZ-2841</span>
                      <b>Đã thanh toán</b>
                    </li>
                    <li>
                      <i className="blue" />
                      <span>#EZ-2840</span>
                      <b>Đang giao</b>
                    </li>
                    <li>
                      <i className="green" />
                      <span>#EZ-2839</span>
                      <b>Hoàn tất</b>
                    </li>
                  </ul>
                </article>
              </div>
              <div className="ezy-ai-cursor">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {icons.ai}
                </svg>
                <span>AI đang dựng giao diện</span>
              </div>
            </div>

            <aside className="ezy-activity">
              <div className="ezy-activity-head">
                <div>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {icons.ai}
                  </svg>
                </div>
                <span>
                  <b>AI Activity</b>
                  <small>Đang thực thi yêu cầu</small>
                </span>
              </div>
              <ol className="ezy-activity-list">
                {activities.map(([label, state], index) => (
                  <li className={`is-${state}`} key={label}>
                    <span>{state === "done" ? "✓" : index + 1}</span>
                    <div>
                      <b>{label}</b>
                      <small>
                        {state === "done"
                          ? "Hoàn tất"
                          : state === "active"
                            ? "Đang xử lý..."
                            : "Chờ xử lý"}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="ezy-mcp">
                <span>
                  <i /> MCP connected
                </span>
                <code>api.ezyplatform.com</code>
              </div>
            </aside>
          </div>
        </div>

        <div className="ezy-capabilities">
          {ezyPillars.map((pillar, index) => (
            <article className="ezy-pillar" key={pillar.title}>
              <div className="ezy-pillar-top">
                <span className="ezy-pillar-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {icons[pillar.icon]}
                  </svg>
                </span>
                <b>0{index + 1}</b>
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
              <div className="ezy-pillar-signal">
                <i />
                <i />
                <i />
                <span>
                  {index === 0
                    ? "MCP connected"
                    : index === 1
                      ? "Workflow running"
                      : "Services ready"}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="ezy-integrations-wrap">
          <div className="ezy-integrations-head">
            <span>Integration pipeline</span>
            <b>
              <i /> All services operational
            </b>
          </div>
          <ul className="ezy-integrations">
            {ezyIntegrations.map((integration, index) => (
              <li className="ezy-integration" key={integration.name}>
                <span className="ezy-integration-num">0{index + 1}</span>
                <div>
                  <b>{integration.name}</b>
                  <span>{integration.services}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <a className="text-link ezy-link" href="#lamduoc">
          Xem sản phẩm bạn có thể tự dựng <span>↓</span>
        </a>
      </div>
    </section>
  );
}
