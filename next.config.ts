import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  trailingSlash: true,
  redirects() {
    return [
      { source: "/platinum/", destination: "/vps-platinum/", permanent: true },
      {
        source: "/vps-gold-nvme-u2/",
        destination: "/vps-gold/",
        permanent: true,
      },
      {
        source: "/vps-gold-enterprise-1gbps/",
        destination: "/vps-gold/",
        permanent: true,
      },
      { source: "/about-us/", destination: "/gioi-thieu/", permanent: true },
      { source: "/contact/", destination: "/lien-he/", permanent: true },
      {
        source: "/privacy-policy/",
        destination: "/chinh-sach-bao-mat/",
        permanent: true,
      },
      {
        source: "/terms-and-condition/",
        destination: "/dieu-khoan-su-dung-dich-vu/",
        permanent: true,
      },
      {
        source: "/service-level-agreement/",
        destination: "/cam-ket-chat-luong-dich-vu/",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "interdata.vn",
        pathname: "/blog/wp-content/uploads/**",
      },
    ],
  },
};
export default config;
