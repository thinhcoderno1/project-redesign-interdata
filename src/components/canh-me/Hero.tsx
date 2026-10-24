import { CheckIcon, ServerArt } from "./Icons";

export default function Hero() {
  return (
    <section className="cm-hero">
      <div className="cm-hero-pattern" />
      <div className="cm-hero-inner">
        <div className="cm-hero-copy">
          <div className="cm-hero-badge">
            <span />
            Tiết kiệm đến 81%
          </div>
          <h1>
            Canh Me - Khuyến Mãi
            <br />
            VPS & Cloud Server
          </h1>
          <p>
            Đừng bỏ lỡ cơ hội săn ưu đãi hấp dẫn cho VPS và Cloud Server tại
            InterData. Chúng tôi liên tục cập nhật các gói cấu hình tối ưu, mã
            giảm giá và flash sale giới hạn thời gian.
          </p>
          <div className="cm-hero-actions">
            <a href="#hotdeals">HOT DEALS</a>
            <a
              href="https://www.facebook.com/interdata.com.vn"
              className="is-secondary"
            >
              LIÊN HỆ TƯ VẤN
            </a>
          </div>
          <div className="cm-hero-features">
            {[
              "CPU AMD/Intel thế hệ mới",
              "SSD NVMe U.2 Gen 4",
              "Uptime 99.9%",
              "Support 24/7",
            ].map((item) => (
              <div key={item}>
                <CheckIcon />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cm-hero-visual">
          <ServerArt />
        </div>
      </div>
    </section>
  );
}
