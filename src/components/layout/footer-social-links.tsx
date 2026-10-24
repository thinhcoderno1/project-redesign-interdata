import { socialProfiles } from "@/data/site-identity";
import Image from "next/image";
import styles from "./footer.module.css";

export function FooterSocialLinks() {
  return (
    <nav className={styles.socialLinks} aria-label="Kết nối với InterData">
      {socialProfiles.map((social) => (
        <a
          key={social.icon}
          href={social.href}
          className={styles.socialLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`InterData trên ${social.name}`}
          title={social.name}
        >
          <Image
            src={`/images/footer/${social.icon}.svg`}
            alt=""
            width={24}
            height={24}
          />
        </a>
      ))}
    </nav>
  );
}
