import { links } from "@/data/content";
import { InfoDisclosure } from "./info-disclosure";
import styles from "./info-section.module.css";

export function InfoSection() {
  return (
    <section
      id="black-friday-info"
      className={styles.section}
      aria-labelledby="black-friday-info-title"
    >
      <div className={`container ${styles.panel}`}>
        <div className={styles.content}>
          <h2 id="black-friday-info-title">
            Cách chọn VPS và Cloud Server dịp Black Friday 2026 tại InterData
          </h2>
          <p className={styles.intro}>
            Black Friday 2026 tại InterData có ưu đãi VPS Platinum, mã giảm
            giá VPS và Cloud Server, Flash Sale và ưu đãi gia hạn. Hãy chọn cấu
            hình theo tải thực tế, so sánh tổng tiền theo chu kỳ rồi kiểm tra
            điều kiện trước khi thanh toán.
          </p>
          <p className={styles.preview}>
            Một website WordPress và một cửa hàng WooCommerce có thể dùng cùng
            dung lượng ổ đĩa nhưng cần mức CPU và RAM khác nhau. Tải vào giờ cao
            điểm, chi phí gia hạn và khả năng phục hồi dữ liệu đều đáng cân
            nhắc khi so sánh các gói.
          </p>
          <InfoDisclosure>
            <div className={styles.body}>
              <div>
                <h3 tabIndex={-1}>Nên chọn VPS Platinum hay Cloud Server?</h3>
                <p>
                  VPS Platinum là lựa chọn đáng cân nhắc khi bạn chạy website,
                  API hoặc ứng dụng nội bộ trên một máy chủ và đã ước lượng được
                  tải. Với hệ thống dự kiến tăng trưởng hoặc có nhiều thành
                  phần cần triển khai riêng, hãy xem các gói Cloud Server và hỏi
                  trước về cách nâng tài nguyên, thời gian gián đoạn và cách
                  tính phí khi nâng cấp.
                </p>
                <p>
                  Ví dụ, một website giới thiệu có bộ nhớ đệm thường phục vụ
                  được nhiều lượt xem mà ít truy vấn cơ sở dữ liệu. Cửa hàng
                  WooCommerce cần xử lý giỏ hàng, thanh toán và tồn kho nên có
                  thể cần thêm tài nguyên ngay cả khi lượng truy cập tương
                  đương. Hãy so sánh phương án triển khai ở trang{" "}
                  <a href={links.vps}>thuê VPS</a> và{" "}
                  <a href={links.cloud}>Cloud Server</a>.
                </p>
              </div>

              <div>
                <h3>Đọc cấu hình VPS Black Friday như thế nào?</h3>
                <p>
                  Với các gói VPS Platinum dùng Intel Xeon Platinum Gen 2 và
                  SSD NVMe U.2, hãy đối chiếu từng thông số với dữ liệu của máy
                  chủ đang chạy. Nếu có biểu đồ giám sát, xem cả một tuần điển
                  hình và ngày có chiến dịch, nhất là những lúc nhiều tác vụ
                  chạy cùng nhau.
                </p>
                <ul>
                  <li>
                    <strong>CPU và RAM.</strong> Xem mức dùng khi có nhiều yêu
                    cầu đồng thời hoặc khi tác vụ nền chạy. Tính RAM cho cả
                    hệ điều hành, ứng dụng và cơ sở dữ liệu.
                  </li>
                  <li>
                    <strong>SSD NVMe.</strong> Cộng dung lượng dữ liệu, nhật
                    ký, tệp tải lên và phần trống cần cho cập nhật. Dự trù mức
                    tăng theo tháng nếu ứng dụng lưu nhiều tệp.
                  </li>
                  <li>
                    <strong>Kết nối và bảo vệ.</strong> Kiểm tra số IPv4 Public,
                    tốc độ cổng mạng, điều kiện băng thông và thông số Anti
                    DDoS của gói bạn định mua.
                  </li>
                </ul>
              </div>

              <div>
                <h3>So sánh chu kỳ 1 năm, 2 năm và 3 năm ra sao?</h3>
                <p>
                  Số tiền chính trên thẻ gói là tổng tiền của chu kỳ đang chọn.
                  Để so sánh cùng đơn vị, hãy chia tổng tiền cho 12, 24 hoặc 36
                  tháng. Ví dụ, tổng tiền 2.400.000 đồng cho 24 tháng tương
                  đương 100.000 đồng mỗi tháng. Khi lập ngân sách, bạn vẫn cần
                  dự trù khoản thanh toán theo chu kỳ.
                </p>
                <p>
                  Chu kỳ 1 năm phù hợp khi bạn muốn đánh giá lại cấu hình sau
                  năm đầu. Nếu tải và ngân sách đã ổn định, hãy so sánh chu kỳ
                  2 và 3 năm, hỏi giá gia hạn và xem chi phí nâng cấu hình nếu
                  cần thêm tài nguyên giữa kỳ. Mục “Quà Tặng Chu Kỳ 3 Năm” cho
                  biết quà của từng gói khi đăng ký 3 năm, kể cả khi bạn đang
                  xem giá 1 hoặc 2 năm. Có thể đối chiếu ngay tại{" "}
                  <a href="#best-plans">Best Plans</a>.
                </p>
              </div>

              <div>
                <h3>Mã giảm giá Black Friday và Flash Sale dùng khi nào?</h3>
                <p>
                  Hãy chọn mã giảm giá đúng loại dịch vụ và chu kỳ thanh toán.
                  Mã ONE TIME áp dụng cho lần thanh toán đầu tiên. Chương trình
                  áp dụng một ưu đãi mỗi đơn và loại trừ thanh toán bằng số dư
                  credit InterData. Sau khi nhập mã, hãy đối chiếu mức giảm và
                  tổng tiền trên hóa đơn. Các mã theo chu kỳ nằm ở mục{" "}
                  <a href="#ma-giam-gia">Mã giảm giá</a>.
                </p>
                <p>
                  Flash Sale mở theo đợt với mã và số lượng công bố tại thời
                  điểm mở bán. Vé tên miền .COM, vé VPS và vé Cloud Server có
                  điều kiện riêng. Kiểm tra cấu hình, chu kỳ trên vé đã chọn và
                  chuẩn bị phương thức thanh toán trước. Với Flash Sale, hóa
                  đơn chưa thanh toán sẽ bị xóa sau 15 phút kể từ khi khởi tạo.
                </p>
              </div>

              <div>
                <h3>Đang dùng dịch vụ InterData thì nên kiểm tra gì?</h3>
                <p>
                  Nếu máy chủ đang đáp ứng tốt tải hiện tại, hãy kiểm tra giá
                  gia hạn trước khi mua gói mới. Chuẩn bị mã dịch vụ, ngày hết
                  hạn và thông tin khuyến mãi từng sử dụng, kể cả gói đăng ký
                  qua Canh Me. InterData có thể dùng các thông tin này để đối
                  chiếu điều kiện áp dụng cho dịch vụ của bạn. Xem các quyền lợi
                  đang công bố tại mục <a href="#gia-han">Ưu đãi gia hạn</a>.
                </p>
                <p>
                  Nếu đang cân nhắc đổi gói, hãy tính cả thời gian chuyển dữ
                  liệu, chi phí vận hành hai máy chủ song song và ảnh hưởng khi
                  tạm dừng ứng dụng. Với cửa hàng có đơn hàng mỗi ngày, hãy
                  chốt thời điểm ngừng ghi dữ liệu trên máy cũ và kiểm tra đơn
                  hàng mới đã được chuyển đầy đủ trước khi mở lại.
                </p>
              </div>

              <div>
                <h3>Cần chuẩn bị gì trước khi chuyển sang máy chủ mới?</h3>
                <p>
                  Lập danh sách ứng dụng, phiên bản hệ điều hành và cơ sở dữ
                  liệu, tên miền, dung lượng đang dùng và các tác vụ chạy theo
                  lịch. Tạo một bản sao lưu ở nơi độc lập rồi thử phục hồi vào
                  môi trường kiểm thử. Việc này giúp phát hiện tệp cấu hình,
                  quyền truy cập hoặc dữ liệu còn thiếu trước khi đổi DNS.
                </p>
                <p>
                  Nếu gói 3 năm bạn chọn có quà S3 Storage, hãy kiểm tra dung
                  lượng, thời hạn sử dụng và phần mềm sao lưu có hỗ trợ giao
                  thức tương thích S3 hay không. Có thể dùng bucket riêng để
                  lưu bản sao lưu và giới hạn quyền truy cập của tài khoản ứng
                  dụng. Tham khảo cách tổ chức dữ liệu ở trang{" "}
                  <a href="/s3-object-storage/">S3 Object Storage</a>.
                </p>
                <p>
                  Trước khi chuyển hẳn lưu lượng, hãy thử những thao tác khách
                  hàng dùng hằng ngày như đăng nhập, thanh toán và nhận email.
                  Giữ máy cũ trong thời gian theo dõi đã thống nhất để có thể
                  quay lại nếu phát sinh lỗi. Nếu cần chốt lịch chuyển hoặc
                  phạm vi hỗ trợ, hãy <a href={links.contact}>liên hệ InterData</a>.
                </p>
              </div>
            </div>
          </InfoDisclosure>
        </div>
      </div>
    </section>
  );
}
