import { ClipboardList, MapPin, Network, Server } from "lucide-react";
import styles from "@/components/vps/environments.module.css";
import base from "@/components/platinum-cloud-server/platinum-cloud.module.css";
import local from "./colocation.module.css";

const steps = [
  {
    icon: Server,
    title: "Chuẩn bị thiết bị",
    text: "Gửi số lượng, kích thước rack, công suất và yêu cầu kết nối của máy chủ.",
  },
  {
    icon: MapPin,
    title: "Xác nhận chỗ đặt",
    text: "Thống nhất địa điểm, nguồn điện, kết nối, chi phí và lịch bàn giao.",
  },
  {
    icon: ClipboardList,
    title: "Bàn giao máy chủ",
    text: "Kiểm tra cấu hình, mã linh kiện và lập biên bản bàn giao giữa hai bên.",
  },
  {
    icon: Network,
    title: "Lắp đặt & Kiểm tra",
    text: "Lắp đặt theo phương án, kiểm tra nguồn và mạng, xác nhận quyền truy cập quản trị.",
  },
];

export function ColocationProcess() {
  return (
    <section
      id="quy-trinh"
      className={`${styles.section} ${base.environments}`}
      aria-labelledby="colocation-process-title"
    >
      <div className="container">
        <div className={styles.heading}>
          <span className={styles.eyebrow}>CHUẨN BỊ & BÀN GIAO THIẾT BỊ</span>
          <h2 id="colocation-process-title">
            Đưa máy chủ của bạn vào datacenter
          </h2>
          <p>
            Thống nhất yêu cầu trước khi vận chuyển để thiết bị được bố trí đúng
            không gian, nguồn điện và kết nối.
          </p>
        </div>
        <div className={styles.appGrid}>
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className={`${styles.card} ${styles.app}`}>
              <div className={styles.cardSurface}>
                <span className={local.stepIcon}>
                  <Icon size={36} aria-hidden="true" />
                </span>
                <small>BƯỚC 0{index + 1}</small>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
