// Public company details already displayed in the footer and Contact page.
export const siteIdentity = {
  name: "InterData",
  legalName: "CÔNG TY CỔ PHẦN INTER GROUP",
  origin: "https://interdata.vn",
  taxID: "0316918910",
  logo: "/images/logo.webp",
  logoWidth: 500,
  logoHeight: 174,
  address: {
    streetAddress: "240 Nguyễn Đình Chính, Phường Phú Nhuận",
    addressLocality: "Thành phố Hồ Chí Minh",
    addressCountry: "VN",
  },
} as const;

export const socialProfiles = [
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
] as const;
