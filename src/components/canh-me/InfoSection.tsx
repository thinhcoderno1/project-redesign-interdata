"use client";

import { useState } from "react";

export default function InfoSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="cm-section cm-info-section">
      <div className="cm-info-card">
        <div className="cm-pill">Thông tin ưu đãi</div>
        <h2>
          Canh Me - chuyên trang cập nhật khuyến mãi VPS và Cloud Server từ
          InterData
        </h2>
        <p className="cm-info-sapo">
          Canh Me là nơi tổng hợp các chương trình khuyến mãi VPS, khuyến mãi
          Cloud Server, ưu đãi VPS và ưu đãi Cloud Server mới nhất của
          InterData. Trang được xây dựng để người dùng dễ theo dõi hot deals, mã
          giảm giá, thời gian áp dụng và điều kiện đăng ký trước khi chọn dịch
          vụ phù hợp.
        </p>

        {isOpen ? (
          <div className="cm-info-body">
            <h3>Canh Me giúp người dùng theo dõi ưu đãi VPS rõ ràng hơn</h3>
            <p>
              Khi tìm kiếm ưu đãi VPS, người dùng thường cần biết nhanh gói nào
              đang giảm giá, cấu hình gồm những gì, chu kỳ thanh toán áp dụng ra
              sao và chương trình còn hiệu lực hay không. Canh Me gom các thông
              tin này vào một trang duy nhất để việc so sánh VPS giá tốt, VPS
              hiệu năng cao, VPS AMD hoặc VPS dùng cho website trở nên dễ đọc
              hơn.
            </p>

            <h3>
              Khuyến mãi Cloud Server cần được xem cùng cấu hình và điều kiện áp
              dụng
            </h3>
            <p>
              Với Cloud Server, mức giảm giá chỉ là một phần của quyết định.
              Người dùng nên xem thêm CPU, RAM, dung lượng SSD/NVMe, Network
              Port, băng thông, khả năng mở rộng và chính sách hỗ trợ kỹ thuật.
              Vì vậy, các chương trình khuyến mãi Cloud Server trên Canh Me được
              đặt trong ngữ cảnh cấu hình để người dùng hiểu giá trị thật của
              từng ưu đãi.
            </p>

            <h3>Ưu đãi VPS và ưu đãi Cloud Server phù hợp với nhu cầu nào?</h3>
            <p>
              Ưu đãi VPS thường phù hợp với website cá nhân, website doanh
              nghiệp, landing page, WordPress, WooCommerce hoặc ứng dụng có nhu
              cầu tài nguyên ổn định. Ưu đãi Cloud Server phù hợp hơn với hệ
              thống cần mở rộng linh hoạt, website có traffic biến động, ứng
              dụng nội bộ, môi trường staging/production hoặc dịch vụ cần khả
              năng vận hành ổn định hơn.
            </p>

            <h3>Lưu ý khi chọn khuyến mãi VPS hoặc Cloud Server</h3>
            <p>
              Trước khi đăng ký, nên kiểm tra thời gian diễn ra chương trình,
              chu kỳ thanh toán tối thiểu, giới hạn số lượng ưu đãi, khả năng
              gia hạn giá, chính sách nâng cấp và các điều kiện không áp dụng
              chung với khuyến mãi khác. Cách tiếp cận này giúp tránh chọn gói
              chỉ vì giá thấp nhưng chưa phù hợp với nhu cầu vận hành thực tế.
            </p>
          </div>
        ) : null}

        <button
          className="cm-info-toggle"
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? "Thu gọn nội dung" : "Xem chi tiết"}
        </button>
      </div>
    </section>
  );
}
