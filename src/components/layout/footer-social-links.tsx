import Image from "next/image";
import styles from "./footer.module.css";

const socialLinks = [
  {
    name: "Facebook",
    icon: "facebook",
    href: "https://www.facebook.com/interdata.com.vn/",
  },
  { name: "Zalo", icon: "zalo", href: "https://zalo.me/2009180325727970604" },
  { name: "X", icon: "x", href: "https://x.com/Interdatavn" },
  {
    name: "YouTube",
    icon: "youtube",
    href: "https://www.youtube.com/@interdata-vn",
  },
  {
    name: "Threads",
    icon: "threads",
    href: "https://www.threads.com/@interdatavn",
  },
];

export function FooterSocialLinks() {
  return (
    <nav className={styles.socialLinks} aria-label="Kết nối với InterData">
      {socialLinks.map((social) => (
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
