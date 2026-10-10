import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  devIndicators: false,
  trailingSlash: true,
  redirects() {
    return [
      { source: "/about-us/", destination: "/gioi-thieu/", permanent: true },
      { source: "/contact/", destination: "/lien-he/", permanent: true },
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
