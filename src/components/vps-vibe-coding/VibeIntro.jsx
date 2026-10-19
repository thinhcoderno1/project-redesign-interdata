const steps = [
  {
    title: "Bạn mô tả",
    desc: "Gõ tiếng Việt như nhắn tin.",
    visual: (
      <div className="vibe-visual vibe-visual-chat">
        <p className="vibe-bubble ai">Bạn muốn dựng gì?</p>
        <p className="vibe-bubble user">
          Làm web bán giày cho tôi
          <i />
        </p>
      </div>
    ),
  },
  {
    title: "AI viết code",
    desc: "Phần kỹ thuật máy lo.",
    visual: (
      <div className="vibe-visual vibe-visual-code" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    ),
  },
  {
    title: "Bạn kiểm tra & tinh chỉnh",
    desc: 'Bảo "đổi màu nút", "thêm mục sản phẩm", vài lượt là xong.',
    visual: (
      <div className="vibe-visual vibe-visual-preview" aria-hidden="true">
        <div className="vibe-preview-bar">
          <i />
          <i />
          <i />
        </div>
        <div className="vibe-preview-body">
          <span />
          <span />
          <span className="vibe-preview-cta" />
        </div>
      </div>
    ),
  },
];

const thenPoints = [
  "Học lập trình hàng tháng trời",
  "Thuê dev tốn kém",
  "Sửa gì cũng phải nhờ người khác",
];
const nowPoints = [
  "Tự mô tả bằng tiếng Việt",
  "Thấy kết quả ngay lập tức",
  "Tùy chỉnh bất cứ lúc nào",
];

export default function VibeIntro() {
  return (
    <section id="vibe" className="section vibe-section">
      <div className="container center narrowish">
        <span className="eyebrow on-light">Vibe Coding là gì?</span>
        <h2 className="section-title">
          &quot;Vibe Coding&quot; nghĩa là<br></br>{" "}
          <span className="vibe-grad">bạn ra lệnh, máy làm việc.</span>
        </h2>
        <p className="lead">
          Thay vì gõ từng dòng lệnh khó hiểu, bạn mô tả điều mình muốn bằng ngôn
          ngữ đời thường. AI viết code, bạn xem kết quả, chỉnh lại cho vừa ý.
        </p>

        <ol className="vibe-flow">
          {steps.map((step, index) => (
            <li className="vibe-step" key={step.title}>
              <div className="vibe-step-num">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {step.visual}
            </li>
          ))}
        </ol>

        <div className="vibe-compare">
          <article className="vibe-panel vibe-then">
            <span className="vibe-panel-tag">Trước đây</span>
            <ul>
              {thenPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
          <article className="vibe-panel vibe-now">
            <span className="vibe-panel-tag">Bây giờ</span>
            <ul>
              {nowPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        </div>

        <a className="text-link" href="#lamduoc">
          Xem những gì bạn có thể tự dựng ↓
        </a>
      </div>
    </section>
  );
}
