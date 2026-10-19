"use client";

import { useState } from "react";

export default function InfoSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="thong-tin-vps-vibe-coding" className="section info-section">
      <div className="container info-container">
        <header className="info-heading">
          <span className="eyebrow on-light">KIẾN THỨC NỀN TẢNG</span>
          <h2 className="section-title">
            Hiểu đúng về VPS Vibe Coding trước khi triển khai dự án
          </h2>
          <p>
            VPS Vibe Coding kết hợp tài nguyên máy chủ ảo với môi trường
            EzyPlatform để bạn có thể đưa website, ứng dụng và API do AI hỗ trợ
            xây dựng lên một hệ thống hoạt động liên tục. Phần dưới đây giải
            thích cách mô hình này vận hành, cách chọn cấu hình và những việc
            cần kiểm tra trước khi đưa dự án vào sử dụng thực tế.
          </p>
        </header>

        <div
          id="info-section-content"
          className={`info-content ${isExpanded ? "is-expanded" : "is-collapsed"}`}
        >
          <article className="info-article">
            <h3>VPS Vibe Coding là gì?</h3>
            <p>
              <strong>VPS Vibe Coding</strong> là máy chủ ảo được định hướng cho
              quy trình tạo sản phẩm số bằng AI: mô tả yêu cầu, sinh hoặc chỉnh
              sửa mã nguồn, kết nối dữ liệu, kiểm tra rồi triển khai để người
              dùng truy cập qua Internet. Khác với một công cụ AI chỉ tạo bản
              xem trước, VPS cung cấp hệ điều hành, CPU, RAM, ổ lưu trữ, địa chỉ
              IPv4 và môi trường vận hành cho dự án sau khi hoàn thiện.
            </p>
            <p>
              Tại InterData, người dùng chọn template{" "}
              <strong>Ubuntu-22.04-EzyPlatform</strong> khi khởi tạo VPS. Hệ
              thống cài EzyPlatform và cấp subdomain theo luồng của sản phẩm,
              giúp giảm các bước thiết lập ban đầu. Quyền quản trị máy chủ vẫn
              cho phép người có kinh nghiệm cài thêm runtime, database, Docker
              hoặc dịch vụ phù hợp với ứng dụng.
            </p>
          </article>

          <article className="info-article">
            <h3>
              Vibe Coding, EzyPlatform và VPS phối hợp với nhau như thế nào?
            </h3>
            <div
              className="info-flow"
              aria-label="Quy trình từ ý tưởng đến ứng dụng hoạt động trên VPS"
            >
              <div>
                <b>1. Mô tả</b>
                <span>
                  Chuyển ý tưởng và quy trình nghiệp vụ thành yêu cầu rõ ràng
                  cho AI.
                </span>
              </div>
              <div>
                <b>2. Tạo &amp; chỉnh</b>
                <span>
                  AI hỗ trợ xây giao diện, logic, API và kết nối dữ liệu.
                </span>
              </div>
              <div>
                <b>3. Kiểm tra</b>
                <span>
                  Rà soát chức năng, phân quyền, dữ liệu và trải nghiệm trên
                  thiết bị thật.
                </span>
              </div>
              <div>
                <b>4. Vận hành</b>
                <span>
                  1 click deploy và vận hành trên VPS để website hoặc ứng dụng
                  hoạt động liên tục.
                </span>
              </div>
            </div>
            <p>
              Trong mô hình này, AI hỗ trợ quá trình tạo và sửa sản phẩm;
              EzyPlatform cung cấp không gian làm việc cùng các module như CMS,
              cơ sở dữ liệu, email, API và MCP Server; còn VPS chịu trách nhiệm
              về tài nguyên tính toán, lưu trữ và kết nối mạng. Ba lớp có vai
              trò khác nhau nên một prompt tốt không thể thay thế việc kiểm thử,
              còn cấu hình VPS mạnh cũng không tự sửa được mã nguồn hoặc truy
              vấn chưa tối ưu.
            </p>
          </article>

          <article className="info-article">
            <h3>
              VPS Vibe Coding khác VPS thông thường và Shared Hosting ra sao?
            </h3>
            <div
              className="info-table-wrap"
              tabIndex={0}
              role="region"
              aria-label="So sánh VPS Vibe Coding, VPS thông thường và Shared Hosting"
            >
              <table className="info-table">
                <thead>
                  <tr>
                    <th>Tiêu chí</th>
                    <th>VPS Vibe Coding</th>
                    <th>VPS thông thường</th>
                    <th>Shared Hosting</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Môi trường ban đầu</th>
                    <td>Template Ubuntu có luồng cài EzyPlatform</td>
                    <td>Thường bắt đầu từ hệ điều hành hoặc image đã chọn</td>
                    <td>Môi trường do nhà cung cấp cấu hình sẵn</td>
                  </tr>
                  <tr>
                    <th>Quyền tùy chỉnh</th>
                    <td>Quyền quản trị và có thể cài thêm dịch vụ</td>
                    <td>Quyền quản trị, tự xây dựng môi trường</td>
                    <td>Giới hạn theo control panel và gói hosting</td>
                  </tr>
                  <tr>
                    <th>Trường hợp phù hợp</th>
                    <td>
                      Dự án AI-assisted cần dựng, thử và vận hành cùng một luồng
                    </td>
                    <td>Đội kỹ thuật muốn tự cấu hình toàn bộ hệ thống</td>
                    <td>Website phổ thông không cần quyền quản trị máy chủ</td>
                  </tr>
                  <tr>
                    <th>Trách nhiệm vận hành</th>
                    <td>
                      Vẫn cần kiểm tra ứng dụng, dữ liệu và cấu hình tự thay đổi
                    </td>
                    <td>Người dùng tự quản lý phần mềm bên trong VPS</td>
                    <td>Nhà cung cấp quản lý phần lớn lớp máy chủ</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Nếu chỉ cần một website giới thiệu đơn giản và không cài dịch vụ
              riêng, Shared Hosting có thể dễ quản lý hơn. Nếu cần chạy Node.js,
              Python, Docker, API, database riêng hoặc nhiều tiến trình nền,{" "}
              <a href="https://interdata.vn/thue-vps/">VPS</a> đem lại không
              gian tùy chỉnh phù hợp hơn. VPS Vibe Coding phù hợp khi bạn muốn
              giữ quyền kiểm soát đó nhưng có thêm EzyPlatform để rút ngắn phần
              chuẩn bị môi trường.
            </p>
          </article>

          <article className="info-article">
            <h3>Cách chọn CPU, RAM và dung lượng cho dự án AI-assisted</h3>
            <p>
              Không nên chọn gói chỉ theo số trang hoặc số website. Tài nguyên
              thực tế phụ thuộc runtime, database, số tiến trình chạy đồng thời,
              lượng truy cập và cả tác vụ build. Một landing page tĩnh thường
              dùng ít tài nguyên hơn ứng dụng có đăng nhập, dashboard, tác vụ
              nền và cơ sở dữ liệu. WordPress nhiều plugin cũng có hành vi tải
              khác một API nhỏ viết bằng Node.js.
            </p>
            <ul className="info-checklist">
              <li>
                <strong>CPU:</strong> lưu ý khi dự án thường xuyên build source,
                xử lý dữ liệu hoặc chạy nhiều service.
              </li>
              <li>
                <strong>RAM:</strong> cộng nhu cầu của hệ điều hành, ứng dụng,
                database, cache và container; tránh để máy dùng swap liên tục.
              </li>
              <li>
                <strong>NVMe:</strong> ảnh hưởng đến cài package, truy vấn
                database, giải nén, build và sao lưu dữ liệu.
              </li>
              <li>
                <strong>Network:</strong> tốc độ thực tế còn phụ thuộc network
                port, tuyến mạng, vị trí người dùng và tải tại thời điểm truy
                cập.
              </li>
              <li>
                <strong>Khả năng mở rộng:</strong> theo dõi CPU, RAM, dung lượng
                và thời gian phản hồi để nâng cấp dựa trên số liệu thay vì phỏng
                đoán.
              </li>
            </ul>
            <p>
              Với dự án nhỏ, có thể bắt đầu ở cấu hình vừa đủ rồi đo mức sử dụng
              trong giai đoạn thử nghiệm. Khi RAM thường xuyên vượt khoảng 80%,
              swap tăng liên tục, CPU duy trì ở mức cao hoặc phản hồi chậm vào
              giờ cao điểm, hãy tìm nguyên nhân trong ứng dụng trước khi quyết
              định nâng gói.
            </p>
          </article>

          <article className="info-article">
            <h3>
              Checklist trước khi đưa website hoặc ứng dụng lên môi trường thật
            </h3>
            <div className="info-check-grid">
              <div>
                <b>Ứng dụng &amp; dữ liệu</b>
                <ul>
                  <li>
                    Kiểm tra luồng đăng nhập, phân quyền và các biểu mẫu quan
                    trọng.
                  </li>
                  <li>
                    Tách biến môi trường và khóa API khỏi mã nguồn công khai.
                  </li>
                  <li>
                    Sao lưu database và file quan trọng sang vị trí độc lập.
                  </li>
                </ul>
              </div>
              <div>
                <b>Máy chủ &amp; truy cập</b>
                <ul>
                  <li>
                    Dùng mật khẩu mạnh hoặc SSH key và hạn chế thao tác trực
                    tiếp bằng root.
                  </li>
                  <li>
                    Chỉ mở các port cần thiết; cập nhật hệ điều hành và package
                    định kỳ.
                  </li>
                  <li>
                    Trỏ domain, kiểm tra DNS và cấu hình HTTPS trước khi công
                    bố.
                  </li>
                </ul>
              </div>
              <div>
                <b>Vận hành &amp; giám sát</b>
                <ul>
                  <li>Kiểm tra log ứng dụng, dung lượng ổ đĩa, CPU và RAM.</li>
                  <li>
                    Thử quy trình khôi phục thay vì chỉ xác nhận rằng có file
                    backup.
                  </li>
                  <li>
                    Ghi lại thay đổi cấu hình để dễ truy vết khi xảy ra lỗi.
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article className="info-article">
            <h3>Khi nào VPS Vibe Coding là lựa chọn phù hợp?</h3>
            <p>
              Mô hình này phù hợp với cá nhân, developer, startup hoặc đội ngũ
              doanh nghiệp muốn biến ý tưởng thành MVP, website bán hàng,
              landing page, blog, CRM mini, công cụ nội bộ hoặc API mà vẫn kiểm
              soát môi trường triển khai. Nó đặc biệt hữu ích khi dự án cần hoạt
              động 24/7, dùng database riêng, kết nối webhook hoặc tích hợp dịch
              vụ ngoài.
            </p>
            <p>
              Đây không phải lựa chọn “không cần kỹ thuật” trong mọi tình huống.
              Người mới có thể đi theo luồng EzyPlatform đã chuẩn bị, nhưng thay
              đổi firewall, container, dịch vụ hệ thống hoặc mã nguồn tùy chỉnh
              vẫn cần hiểu tác động và có phương án quay lại. Với hệ thống quan
              trọng, nên kiểm thử trên môi trường riêng trước khi cập nhật
              production và xác định rõ phần nào do đội ứng dụng, nền tảng hoặc
              nhà cung cấp hạ tầng phụ trách.
            </p>
          </article>

          <aside className="info-note">
            <strong>Bước tiếp theo:</strong>
            <span>
              Xác định runtime, database, lượng truy cập dự kiến và các tiến
              trình cần chạy, sau đó{" "}
              <a href="#gia">đối chiếu cấu hình và chu kỳ thanh toán</a> trong
              bảng giá. Nếu chưa chắc, hãy trao đổi nhu cầu thực tế với đội ngũ
              tư vấn trước khi đăng ký.
            </span>
          </aside>
        </div>

        {!isExpanded && <div className="info-fade" aria-hidden="true" />}

        <div className="info-toggle-wrap">
          <button
            className="info-toggle"
            type="button"
            aria-expanded={isExpanded}
            aria-controls="info-section-content"
            onClick={() => setIsExpanded((current) => !current)}
          >
            <span>
              {isExpanded ? "Thu gọn nội dung" : "Xem nội dung chi tiết"}
            </span>
            <svg
              className={isExpanded ? "is-up" : ""}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
