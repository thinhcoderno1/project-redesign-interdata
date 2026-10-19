import { Layers, MailCheck, Rocket, Server, Workflow } from "lucide-react";
import environmentStyles from "@/components/vps/environments.module.css";
import styles from "./n8n.module.css";

const steps = [
  {
    icon: Server,
    title: "Chọn dịch vụ VPS",
    text: "Chọn dòng VPS, cấu hình và chu kỳ phù hợp với nhu cầu chạy workflow của bạn.",
  },
  {
    icon: Layers,
    title: "Chọn template n8n",
    text: "Tại bước cấu hình đơn hàng, chọn template hệ điều hành cài sẵn n8n.",
  },
  {
    icon: MailCheck,
    title: "Hoàn tất đăng ký",
    text: "Kiểm tra đơn hàng, hoàn tất thanh toán và nhận thông tin bàn giao VPS.",
  },
  {
    icon: Workflow,
    title: "Bắt đầu với n8n",
    text: "Truy cập n8n theo thông tin bàn giao, hoàn tất thiết lập và thử workflow đầu tiên.",
  },
];

export function N8nDeploymentProcess() {
  return (
    <section
      id="quy-trinh"
      className={`${environmentStyles.section} ${styles.environments}`}
      aria-labelledby="n8n-process-title"
    >
      <div className="container">
        <div className={environmentStyles.heading}>
          <span
            className={`${environmentStyles.eyebrow} ${styles.processEyebrow}`}
          >
            <Rocket size={16} aria-hidden="true" />
            TỪ CHỌN VPS ĐẾN WORKFLOW ĐẦU TIÊN
          </span>
          <h2 id="n8n-process-title">
            Quy Trình Triển Khai{" "}
            <span className={styles.processBrand}>n8n</span> Trên VPS
          </h2>
          <p>
            Chọn VPS phù hợp, sử dụng template n8n có sẵn và hoàn tất thiết lập
            để bắt đầu xây dựng workflow của bạn.
          </p>
        </div>
        <ol
          className={styles.processGrid}
          role="list"
          aria-label="4 bước triển khai n8n trên VPS"
        >
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className={environmentStyles.card}>
              <div
                className={`${environmentStyles.cardSurface} ${styles.processSurface}`}
              >
                <span className={styles.processNumber}>Bước 0{index + 1}</span>
                <span className={styles.processIcon}>
                  <Icon size={32} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
