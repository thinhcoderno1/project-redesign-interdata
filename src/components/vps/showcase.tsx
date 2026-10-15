import Image from "next/image";
import { testimonials } from "@/data/content";
import styles from "./vps.module.css";

export function CustomerLogos() {
  return (
    <section className={styles.trustStrip} aria-label="Khách hàng InterData">
      <div className="container">
        <p>ĐỒNG HÀNH CÙNG KHÁCH HÀNG INTERDATA</p>
        <ul className={styles.customerLogos}>
          {testimonials.map((item) => (
            <li key={item.company}>
              <Image
                src={item.logo}
                alt={item.company}
                width={item.logoWidth}
                height={item.logoHeight}
                sizes="(min-width: 768px) 130px, 100px"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { ServiceRange } from "./service-range";

export { UseCases } from "./use-cases";

export { Infrastructure } from "./infrastructure";
