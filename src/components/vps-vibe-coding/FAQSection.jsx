import { faqs } from "./data";
export default function FAQSection() {
  const columns = [faqs.slice(0, 8), faqs.slice(8, 16)];
  return (
    <section id="faq" className="section faq-section">
      <div className="container">
        <header className="faq-heading center">
          <span className="eyebrow on-light">FAQ</span>
          <h2 className="section-title">
            Câu hỏi thường gặp trước khi thuê VPS
          </h2>
          <p>
            Trả lời ngắn gọn các câu hỏi được tìm kiếm nhiều và những điểm cần
            xác nhận trước khi chọn gói.
          </p>
        </header>
        <div className="faq-columns">
          {columns.map((column, i) => (
            <div className="faq-list" key={i}>
              {column.map((item) => (
                <details
                  className="faq-item"
                  name="vibe-faq"
                  key={item.question}
                >
                  <summary>
                    <span>{item.question}</span>
                    <b aria-hidden="true" />
                  </summary>
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                    {item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.linkLabel}
                        <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>
        <div className="center">
          <a
            className="btn primary"
            href="https://www.facebook.com/interdata.com.vn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vẫn còn thắc mắc? Nhận tư vấn miễn phí
          </a>
        </div>
      </div>
    </section>
  );
}
