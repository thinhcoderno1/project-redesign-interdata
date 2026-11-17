import type { ReactNode } from "react";
import { BookOpen, Info } from "lucide-react";
import styles from "./tools.module.css";

function UsageGuide({
  id,
  title,
  introduction,
  steps,
  example,
  notes,
}: {
  id: string;
  title: string;
  introduction: string;
  steps: { title: string; content: ReactNode }[];
  example: ReactNode;
  notes: ReactNode;
}) {
  return (
    <section
      id={id}
      className={styles.usageGuide}
      aria-labelledby={`${id}-title`}
      tabIndex={-1}
    >
      <div className={styles.guideHeading}>
        <span className={styles.guideIcon}>
          <BookOpen size={21} aria-hidden="true" />
        </span>
        <div>
          <h3 id={`${id}-title`}>{title}</h3>
          <p>{introduction}</p>
        </div>
      </div>
      <ol className={styles.guideSteps}>
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className={styles.guideStepNumber} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h4>{step.title}</h4>
              <p>{step.content}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className={styles.guideDetails}>
        <div className={styles.guideExample}>{example}</div>
        <aside className={styles.guideNotes}>
          <h4>
            <Info size={17} aria-hidden="true" /> Lưu ý khi sử dụng
          </h4>
          {notes}
        </aside>
      </div>
    </section>
  );
}

export function VpsUsageGuide() {
  return (
    <UsageGuide
      id="vps-guide"
      title="Hướng dẫn sử dụng công cụ tính cấu hình VPS"
      introduction="Ước tính cấu hình ban đầu, kiểm tra giả định và điều chỉnh bằng số liệu thực tế."
      steps={[
        {
          title: "Chọn ứng dụng và tải cao điểm",
          content: (
            <>
              Chọn loại ứng dụng, nhập số người đang hoạt động đồng thời và số
              yêu cầu mỗi người gửi tới VPS trong một phút. Không nhập tổng lượt
              truy cập/ngày vào ô người dùng đồng thời.
            </>
          ),
        },
        {
          title: "Dự trù dữ liệu và tài nguyên",
          content: (
            <>
              Nhập dung lượng dữ liệu hiện tại, mức tăng mỗi tháng, thời gian dự
              trù và phần trăm dự phòng. Bật CSDL chạy cùng VPS nếu bạn muốn
              cộng RAM cho cơ sở dữ liệu.
            </>
          ),
        },
        {
          title: "Đối chiếu giả định và kết quả",
          content: (
            <>
              Mở <strong>Giả định tính toán</strong> để thay thời gian CPU, thời
              gian xử lý, RAM ứng dụng và RAM mỗi yêu cầu bằng số liệu đo. Kết
              quả cập nhật theo đầu vào; công thức bên dưới giải thích từng phần
              tài nguyên.
            </>
          ),
        },
        {
          title: "Lưu kết quả và kiểm thử tải",
          content: (
            <>
              Sao chép hoặc tải bản tóm tắt có cả cấu hình lẫn giả định. Dùng
              cấu hình này làm điểm bắt đầu kiểm thử, theo dõi CPU/RAM và thời
              gian phản hồi, rồi chọn tài nguyên phù hợp với yêu cầu vận hành.
            </>
          ),
        },
      ]}
      example={
        <>
          <h4>Ví dụ với bộ giả định mặc định</h4>
          <p>
            WordPress, 100 người dùng đồng thời, mỗi người gửi 3 yêu cầu/phút
            đến VPS tương đương 5 yêu cầu/giây.
          </p>
          <code className={styles.guideCode}>
            2 vCPU · 4 GB RAM · 60 GB SSD
          </code>
          <p>
            Kết quả trên dùng CPU 120 ms/yêu cầu, xử lý 500 ms, RAM tăng 64
            MB/yêu cầu, RAM nền ứng dụng 0,75 GB, CSDL 1 GB; dữ liệu 20 GB tăng
            2 GB/tháng trong 6 tháng và dự phòng 30%. Đây là ví dụ tính theo mô
            hình, không phải số đo hiệu năng WordPress.
          </p>
        </>
      }
      notes={
        <ul>
          <li>
            Thay đổi loại ứng dụng sẽ nạp lại các giả định mẫu; thông tin về
            người dùng, dung lượng và dự phòng vẫn được giữ.
          </li>
          <li>
            Tài nguyên thực tế phụ thuộc cache, mã nguồn, truy vấn, worker và
            phần cứng. CPU 70%, RAM hệ điều hành 0,75 GB và ổ hệ điều hành 12 GB
            là giả định riêng của công cụ.
          </li>
          <li>
            Chưa tính bản sao lưu cục bộ, băng thông, IOPS, GPU, tác vụ nền nặng
            hoặc hệ thống nhiều máy chủ. Nếu nhu cầu lớn, cần đánh giá kiến trúc
            cùng đội ngũ kỹ thuật.
          </li>
        </ul>
      }
    />
  );
}

export function CronUsageGuide() {
  return (
    <UsageGuide
      id="cron-guide"
      title="Hướng dẫn sử dụng Cron Job Generator"
      introduction="Từ chọn thời gian đến thêm lịch chạy tự động trên máy chủ Linux."
      steps={[
        {
          title: "Chọn lịch chạy",
          content: (
            <>
              Chọn lịch mẫu như <strong>Mỗi 5 phút</strong>,{" "}
              <strong>Mỗi ngày</strong> hoặc chỉnh từng trường. Bạn cũng có thể
              nhập trực tiếp biểu thức theo thứ tự: phút, giờ, ngày trong tháng,
              tháng, ngày trong tuần.
            </>
          ),
        },
        {
          title: "Nhập lệnh cần thực thi",
          content: (
            <>
              Điền đường dẫn đầy đủ đến chương trình và tệp cần chạy vào{" "}
              <strong>Lệnh cần chạy</strong>. Nếu chỉ cần biểu thức để dùng
              trong hệ thống khác, bạn có thể để trống trường này. Chưa biết
              viết lệnh? Mở <strong>thư viện lệnh mẫu phổ biến</strong>, xem
              hướng dẫn và chọn <strong>Dùng lệnh này</strong>, rồi sửa đường
              dẫn cho phù hợp.
            </>
          ),
        },
        {
          title: "Đối chiếu các lần chạy",
          content: (
            <>
              Xem <strong>5 lần chạy tiếp theo</strong>, chọn Việt Nam (UTC+7)
              hoặc UTC để kiểm tra thời điểm dự kiến. Sửa các trường được báo
              lỗi trước khi sao chép kết quả.
            </>
          ),
        },
        {
          title: "Lưu vào crontab",
          content: (
            <>
              Nhấn <strong>Sao chép</strong> hoặc <strong>Tải xuống</strong>.
              Trên máy chủ, mở <code>crontab -e</code> bằng tài khoản sẽ chạy
              tác vụ, thêm dòng đầy đủ có cả lịch và lệnh, rồi lưu. Dùng{" "}
              <code>crontab -l</code> để kiểm tra lịch đã lưu.
            </>
          ),
        },
      ]}
      example={
        <>
          <h4>Ví dụ: chạy script mỗi ngày lúc 02:30</h4>
          <p>
            Nhập phút <code>30</code>, giờ <code>2</code>, ba trường còn lại là{" "}
            <code>*</code>. Thêm lệnh chạy script để nhận dòng sau:
          </p>
          <code className={styles.guideCode}>
            30 2 * * * /usr/bin/php /var/www/html/cron.php
          </code>
          <p>
            Thay đường dẫn bằng chương trình và script thực tế trên máy chủ của
            bạn. 02:30 được tính theo múi giờ máy chủ.
          </p>
        </>
      }
      notes={
        <ul>
          <li>
            Múi giờ xem trước không thay đổi múi giờ máy chủ. Kiểm tra lệnh chạy
            thủ công và quyền của tài khoản trước khi đặt lịch.
          </li>
          <li>
            Công cụ dùng cron Linux 5 trường với giá trị số; không có trường
            giây. Chủ nhật là <code>0</code> hoặc <code>7</code>.
          </li>
          <li>
            Trong lệnh cron, viết <code>{"\\%"}</code> thay cho <code>%</code>,
            ví dụ <code>{"date +\\%F"}</code>. Tệp tải xuống cần được bạn thêm
            vào crontab; công cụ không tự cài lịch.
          </li>
        </ul>
      }
    />
  );
}

export function NginxUsageGuide() {
  return (
    <UsageGuide
      id="nginx-guide"
      title="Hướng dẫn sử dụng Nginx Config Generator"
      introduction="Chọn mẫu phù hợp, điền thông tin ứng dụng và kiểm tra cấu hình trước khi áp dụng."
      steps={[
        {
          title: "Chọn kiểu cấu hình",
          content: (
            <>
              <strong>Reverse Proxy</strong> chuyển yêu cầu đến ứng dụng đang
              chạy, phù hợp Node.js, Next.js hoặc API.{" "}
              <strong>Website tĩnh</strong> phục vụ các tệp HTML, CSS,
              JavaScript từ một thư mục.
            </>
          ),
        },
        {
          title: "Điền thông tin website",
          content: (
            <>
              Nhập tên miền như <code>example.com</code>, không kèm giao thức
              hay đường dẫn. Với proxy, nhập địa chỉ ứng dụng và cổng. Với
              website tĩnh, nhập thư mục chứa <code>index.html</code>; bật{" "}
              <strong>Ứng dụng SPA</strong> nếu cần chuyển route về tệp này.
            </>
          ),
        },
        {
          title: "Thiết lập các tùy chọn",
          content: (
            <>
              Bật <strong>www</strong> nếu phục vụ cả hai tên miền,{" "}
              <strong>Gzip</strong> để nén tài nguyên văn bản hoặc{" "}
              <strong>WebSocket</strong> cho ứng dụng realtime. Chỉ bật{" "}
              <strong>HTTPS</strong> khi đã có chứng chỉ và nhập đúng đường dẫn
              chứng chỉ cùng khóa riêng trên máy chủ.
            </>
          ),
        },
        {
          title: "Xuất và kiểm tra cấu hình",
          content: (
            <>
              Nhấn <strong>Sao chép</strong> hoặc <strong>Tải xuống</strong>,
              rồi lưu nội dung vào tệp cấu hình được include trong khối{" "}
              <code>http</code> của Nginx. Chạy <code>sudo nginx -t</code>; chỉ
              tải lại dịch vụ khi kiểm tra thành công.
            </>
          ),
        },
      ]}
      example={
        <>
          <h4>Ví dụ: proxy đến ứng dụng ở cổng 3000</h4>
          <dl className={styles.guideValues}>
            <div>
              <dt>Kiểu cấu hình</dt>
              <dd>Reverse Proxy</dd>
            </div>
            <div>
              <dt>Tên miền</dt>
              <dd>
                <code>example.com</code>
              </dd>
            </div>
            <div>
              <dt>Địa chỉ ứng dụng</dt>
              <dd>
                <code>127.0.0.1</code>
              </dd>
            </div>
            <div>
              <dt>Cổng ứng dụng</dt>
              <dd>
                <code>3000</code>
              </dd>
            </div>
          </dl>
          <p>
            Giữ HTTPS tắt nếu chưa có chứng chỉ. Lưu tệp, ví dụ{" "}
            <code>/etc/nginx/conf.d/interdata-site.conf</code>, nếu thư mục này
            đã được include trong <code>http</code>. Trên máy chủ Linux dùng
            systemd, kiểm tra rồi tải lại bằng:
          </p>
          <code className={styles.guideCode}>
            sudo nginx -t &amp;&amp; sudo systemctl reload nginx
          </code>
        </>
      }
      notes={
        <ul>
          <li>
            Nginx cần được cài sẵn; tên miền phải trỏ về máy chủ và cổng 80/443
            tương ứng phải được mở. Với proxy, ứng dụng cần chạy tại đúng địa
            chỉ và cổng đã nhập.
          </li>
          <li>
            Chứng chỉ phải có sẵn và bao phủ cả tên miền gốc lẫn www nếu bật tùy
            chọn này. Công cụ không cấp hoặc gia hạn chứng chỉ.
          </li>
          <li>
            Đường dẫn và cách nạp tệp có thể khác theo hệ điều hành. Sao lưu tệp
            hiện có trước khi thay thế; nếu kiểm tra báo lỗi, sửa lỗi trước khi
            reload. Mẫu là cấu hình cho một website, không thay thế toàn bộ{" "}
            <code>nginx.conf</code>.
          </li>
        </ul>
      }
    />
  );
}
