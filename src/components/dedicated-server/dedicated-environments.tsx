import Image from "next/image";
import base from "@/components/platinum-cloud-server/platinum-cloud.module.css";
import styles from "@/components/vps/environments.module.css";

const systems = [
  { name: "Ubuntu", image: "ubuntu-icon.webp" },
  { name: "Debian", image: "debian.svg" },
  { name: "AlmaLinux", image: "almalinux.svg" },
  { name: "Rocky Linux", image: "rocky-linux.svg" },
  { name: "CentOS", image: "centos.svg" },
];

export function DedicatedEnvironments() {
  return (
    <section
      className={`${styles.section} ${base.environments}`}
      aria-labelledby="dedicated-os-title"
    >
      <div className="container">
        <div className={styles.heading}>
          <span className={styles.eyebrow}>MÔI TRƯỜNG TRIỂN KHAI</span>
          <h2 id="dedicated-os-title">Hệ điều hành cho máy chủ của bạn</h2>
          <p>
            Hỗ trợ cài đặt hệ điều hành ban đầu. Trao đổi phiên bản, khả năng
            tương thích phần cứng và vòng đời hỗ trợ trước khi triển khai; ưu
            tiên phiên bản còn nhận bản vá bảo mật.
          </p>
        </div>
        <div className={styles.osGrid}>
          {systems.map(({ name, image }) => (
            <article key={name} className={styles.card}>
              <div className={styles.cardSurface}>
                <Image
                  src={`/images/cloud-server/operating-systems/${image}`}
                  alt=""
                  className={name === "Ubuntu" ? styles.ubuntuLogo : undefined}
                  width={160}
                  height={80}
                  unoptimized
                />
                <h3>{name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
