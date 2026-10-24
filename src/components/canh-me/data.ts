import type { PricingPeriod } from "@/lib/canh-me-pricing";

export type DealProgram = {
  gid: number;
  eyebrow: string;
  title: string;
  description: string;
  note: string;
  iconVariant?: "cloud" | "vps";
  hidden?: boolean;
  pricingPeriod?:
    | "monthly"
    | "quarterly"
    | "semiannually"
    | "annually"
    | "biennially"
    | "triennially";
  pricingPeriods?: PricingPeriod[];
  defaultPricingPeriod?: PricingPeriod;
  showMonthlyEquivalentPrice?: boolean;
  hiddenProductPids?: number[];
  featuredPid?: number;
  featuredIndex?: number;
  gridColumns?: 2 | 3 | 4;
};

export const ORIGINAL_PRICE_BY_PID: Record<
  number,
  Partial<Record<PricingPeriod, string>>
> = {
  517: {
    monthly: "9.343.750 \u0111",
    quarterly: "26.910.000 \u0111",
    semiannually: "51.577.500 \u0111",
    annually: "98.670.000 \u0111",
    biennially: "179.400.000 \u0111",
    triennially: "269.100.000 \u0111",
  },
  518: {
    monthly: "11.437.500 \u0111",
    quarterly: "27.164.063 \u0111",
    semiannually: "32.940.000 \u0111",
    annually: "120.780.000 \u0111",
    biennially: "219.600.000 \u0111",
    triennially: "329.400.000 \u0111",
  },
  519: {
    monthly: "18.375.000 \u0111",
    quarterly: "52.920.000 \u0111",
    semiannually: "101.430.000 \u0111",
    annually: "194.040.000 \u0111",
    biennially: "352.800.000 \u0111",
    triennially: "529.200.000 \u0111",
  },
  520: {
    monthly: "28.471.875 \u0111",
    quarterly: "81.999.000 \u0111",
    semiannually: "157.164.750 \u0111",
    annually: "300.663.000 \u0111",
    biennially: "546.660.000 \u0111",
    triennially: "819.990.000 \u0111",
  },
  521: {
    annually: "3.573.600 \u0111",
    biennially: "6.750.000 \u0111",
    triennially: "9.529.600 \u0111",
  },
  522: {
    annually: "7.516.800 \u0111",
    biennially: "14.198.400 \u0111",
    triennially: "20.044.800 \u0111",
  },
  523: {
    annually: "14.956.800 \u0111",
    biennially: "29.078.400 \u0111",
    triennially: "42.364.800 \u0111",
  },
  512: {
    annually: "2.613.600 \u0111",
    biennially: "4.936.800 \u0111",
    triennially: "6.969.600 \u0111",
  },
  513: {
    annually: "7.516.800 \u0111",
    biennially: "14.198.400 \u0111",
    triennially: "20.044.800 \u0111",
  },
  514: {
    annually: "14.956.800 \u0111",
    biennially: "29.078.400 \u0111",
    triennially: "42.364.800 \u0111",
  },
  515: {
    annually: "28.272.000 \u0111",
    biennially: "55.056.000 \u0111",
    triennially: "80.352.000 \u0111",
  },
  505: {
    annually: "8.401.800 \u0111",
    biennially: "15.919.200 \u0111",
    triennially: "22.552.200 \u0111",
  },
  506: {
    annually: "17.806.800 \u0111",
    biennially: "33.739.200 \u0111",
    triennially: "47.797.200 \u0111",
  },
  507: {
    annually: "45.144.000 \u0111",
    biennially: "85.536.000 \u0111",
    triennially: "121.176.000 \u0111",
  },
  490: {
    quarterly: "726.000 \u0111",
  },
  491: {
    quarterly: "2.088.000 \u0111",
  },
  481: {
    annually: "3.633.600 \u0111",
    biennially: "6.976.800 \u0111",
    triennially: "10.029.600 \u0111",
  },
  482: {
    annually: "8.596.800 \u0111",
    biennially: "16.358.400 \u0111",
    triennially: "23.284.800 \u0111",
  },
  483: {
    annually: "21.792.000 \u0111",
    biennially: "34.416.000 \u0111",
    triennially: "49.392.000 \u0111",
  },
  484: {
    annually: "29.625.600 \u0111",
    biennially: "57.292.800 \u0111",
    triennially: "83.001.600 \u0111",
  },
  529: {
    annually: "3.093.600 \u0111",
    biennially: "5.896.800 \u0111",
    triennially: "8.409.600 \u0111",
  },
  530: {
    annually: "7.908.000 \u0111",
    biennially: "15.144.000 \u0111",
    triennially: "21.708.000 \u0111",
  },
  531: {
    annually: "15.132.000 \u0111",
    biennially: "28.776.000 \u0111",
    triennially: "40.932.000 \u0111",
  },
};

export const GID_ORDER = [100, 87, 97, 95, 93, 89, 96, 92] as const;

export type Testimonial = {
  name: string;
  role: string;
  initials: string;
  quote: string;
};

export type PressItem = {
  tag: string;
  title: string;
  desc: string;
};

export type PressArticle = {
  href: string;
  thumb: string;
  partnerLogo: string;
  title: string;
};

export type CustomerTestimonial = {
  name: string;
  company: string;
  logo: string;
  content: string;
};

export const deals: DealProgram[] = [
  {
    gid: 93,
    hidden: true,
    pricingPeriods: ["annually", "biennially", "triennially"],
    featuredIndex: 1,
    eyebrow: "CLOUD-DAY BY INTERDATA 2026",
    title: "AMD EPYC HIỆU NĂNG CAO - TIẾT KIỆM ĐẾN 81%",
    description:
      "Sở hữu ngay hạ tầng AMD EPYC hiệu năng cao, tiết kiệm đến 81% chi phí. Đăng ký từ 2 năm trở lên được tặng 1 năm sử dụng và 500GB S3 Storage. Trang bị SSD NVMe U.2 Gen4 tốc độ cao, phù hợp cho website traffic lớn, ứng dụng doanh nghiệp và hệ thống cần tài nguyên ổn định.",
    note: "Có thể kết thúc sớm hơn dự kiến, do số lượng ưu đãi có hạn",
    iconVariant: "cloud",
  },
  // {
  //   gid: 91,
  //   pricingPeriod: 'monthly',
  //   featuredIndex: 1,
  //   gridColumns: 3,
  //   eyebrow: 'INTER DEDI POWER SERIES 2026',
  //   title: 'DEDICATED SERVER CẤU HÌNH CAO – TẶNG SERVER KHI ĐĂNG KÝ 3 NĂM',
  //   description:
  //     'Tối ưu hiệu năng với Dedicated Server cấu hình cao, băng thông lớn, Anti DDoS và hạ tầng Datacenter đạt chuẩn. Toàn bộ tài nguyên dành riêng cho doanh nghiệp của bạn.',
  //   note: 'Chương trình có thể kết thúc sớm do số lượng ưu đãi có hạn.',
  //   iconVariant: 'cloud',
  // },
  {
    gid: 96,
    pricingPeriod: "monthly",
    pricingPeriods: [
      "monthly",
      "quarterly",
      "semiannually",
      "annually",
      "biennially",
      "triennially",
    ],
    defaultPricingPeriod: "biennially",
    showMonthlyEquivalentPrice: true,
    hiddenProductPids: [518],
    featuredPid: 519,
    gridColumns: 3,
    eyebrow: "INTER DEDI POWER SERIES 2026",
    title: "DEDICATED SERVER CẤU HÌNH CAO – TẶNG SERVER KHI ĐĂNG KÝ 3 NĂM",
    description:
      "Tối ưu hiệu năng với Dedicated Server cấu hình cao, băng thông lớn, Anti DDoS và hạ tầng Datacenter đạt chuẩn. Toàn bộ tài nguyên dành riêng cho doanh nghiệp của bạn.",
    note: "Chương trình có thể kết thúc sớm do số lượng ưu đãi có hạn.",
    iconVariant: "cloud",
  },
  {
    gid: 92,
    hidden: true,
    featuredIndex: 3,
    eyebrow: "InterData Day - VPS AMD hiệu năng cao",
    title: "Hạ tầng mạnh mẽ - vận hành tự tin",
    description:
      "Tăng tốc website, app và hệ thống trực tuyến với giải pháp VPS AMD dùng CPU AMD 7H12 mạnh mẽ, SSD NVMe U.2 siêu tốc độ, cùng dung lượng băng thông không giới hạn. Cấu hình đa dạng từ cơ bản đến doanh nghiệp với mức chi phí tối ưu, phù hợp cho nhu cầu vận hành liên tục, xử lý đa tác vụ và mở rộng tài nguyên linh hoạt khi cần.",
    note: "Ưu đãi áp dụng từ 25/05 đến 31/05/2026. Sau thời gian này, giá sẽ được điều chỉnh tăng 20%.",
    iconVariant: "vps",
  },
  {
    gid: 95,
    hidden: true,
    pricingPeriods: ["annually", "biennially", "triennially"],
    featuredIndex: 1,
    eyebrow: "BD CLOUD PERFORMANCE 2026",
    title: " CLOUD SERVER HIỆU NĂNG CAO - TIẾT KIỆM ĐẾN 80%",
    description:
      "Nâng tầm hạ tầng doanh nghiệp với Cloud Server thế hệ mới - tiết kiệm lên đến 80% chi phí và bảo đảm an toàn dữ liệu tuyệt đối trên hệ thống CEPH Storage cao cấp.",
    note: "Có thể kết thúc sớm hơn dự kiến, do số lượng ưu đãi có hạn",
    iconVariant: "cloud",
  },
  {
    gid: 89,
    pricingPeriod: "quarterly",
    pricingPeriods: ["quarterly"],
    eyebrow: "VPS/Cloud Server - Best Value Plans",
    title: "Hiệu năng vượt trội - tiết kiệm đến 60%",
    description:
      "Giải pháp VPS / Cloud Server cân bằng giữa hiệu năng và chi phí, phù hợp cho doanh nghiệp và cá nhân triển khai hệ thống linh hoạt. Dễ dàng vận hành các ứng dụng như Docker, n8n, OpenClaw, SQL, PHP hay .NET. Hạ tầng ổn định, tốc độ cao, hỗ trợ 24/7 giúp yên tâm mở rộng dự án và tối ưu hiệu suất lâu dài.",
    note: "Chương trình có thể kết thúc sớm, do số lượng ưu đãi có hạn.",
    iconVariant: "cloud",
  },
  {
    gid: 100,
    hidden: false,
    pricingPeriods: ["annually", "biennially", "triennially"],
    featuredPid: 530,
    gridColumns: 3,
    eyebrow: "INTER PLATINUM SERIES 2026",
    title: "VPS PLATINUM HIỆU SUẤT CAO - SIÊU TIẾT KIỆM",
    description:
      "Bứt phá hiệu suất với INTER PLATINUM SERIES 2026 với nền tảng hạ tầng CPU Intel Platinum, SSD NVMe U.2 tốc độ cao và đường truyền 300 Mbps. Cấu hình mạnh, tài nguyên lớn, băng thông không giới hạn, giữ nguyên giá khi gia hạn, đáp ứng hiệu năng từ website, ứng dụng đến các hệ thống doanh nghiệp.",
    note: "Chương trình có thể kết thúc sớm, do số lượng ưu đãi có hạn.",
    iconVariant: "vps",
  },
  {
    gid: 87,
    pricingPeriods: ["annually", "biennially", "triennially"],
    featuredIndex: 1,
    eyebrow: "VPS Hiệu Năng Cao Cho Developer & Business",
    title: "Hiệu năng vượt trội - tối ưu chi phí",
    description:
      "Các gói VPS Premium chạy trên CPU Intel Xeon Scalable mạnh mẽ ổn định, SSD NVMe U.2 tốc độ cao, IPv4 riêng, băng thông không giới hạn và full root access. Hỗ trợ Linux & Windows, tự động khởi tạo ngay sau khi thanh toán, phù hợp cho developer, startup và doanh nghiệp cần triển khai web server, phần mềm doanh nghiệp hoặc tools tùy chỉnh.",
    note: "Chương trình có thể kết thúc sớm, do số lượng ưu đãi có hạn.",
    iconVariant: "vps",
  },
  {
    gid: 97,
    hidden: true,
    pricingPeriods: ["annually", "biennially", "triennially"],
    featuredIndex: 1,
    eyebrow: "BEST PLAN - REAL CLOUD 2026",
    title: "CLOUD SERVER HIỆU NĂNG CAO - TIẾT KIỆM ĐẾN 81%",
    description:
      "Tăng cường hiệu suất website, ứng dụng và hệ thống với Cloud Server hiệu năng cao, lưu trữ NVMe U.2 cùng đường truyền ổn định 300–400 Mbps. An toàn dữ liệu nhờ cơ chế lưu trữ phân tán, HA sẵn sàng cao giúp uptime 99.99%. Gia hạn không tăng giá — tối ưu chi phí, an tâm vận hành dài hạn.",
    note: "Chương trình có thể kết thúc sớm, do số lượng ưu đãi có hạn.",
    iconVariant: "cloud",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Anh Minh",
    role: "Developer",
    initials: "AM",
    quote:
      "Chuyển hệ thống lên VPS InterData giúp team triển khai app nhanh hơn, máy local nhẹ hơn rõ rệt.",
  },
  {
    name: "Chị Hương",
    role: "Chủ shop online",
    initials: "CH",
    quote: "Website ổn định mùa cao điểm, hỗ trợ kỹ thuật phản hồi rất nhanh.",
  },
  {
    name: "Anh Nam",
    role: "Agency",
    initials: "AN",
    quote:
      "Cloud Server chạy mượt, dễ mở rộng khi cần thêm tài nguyên cho dự án.",
  },
  {
    name: "Team Startup X",
    role: "Startup",
    initials: "SX",
    quote:
      "Chi phí tối ưu nhưng vẫn có hiệu năng đủ mạnh để vận hành dịch vụ hàng ngày.",
  },
  {
    name: "Chị Lan",
    role: "Marketing Lead",
    initials: "CL",
    quote:
      "Landing page tải nhanh hơn hẳn sau khi chuyển sang hạ tầng của InterData.",
  },
  {
    name: "Anh Quang",
    role: "Sysadmin",
    initials: "AQ",
    quote:
      "Toàn quyền quản trị, snapshot và backup tiện lợi, đội kỹ thuật hỗ trợ 24/7 rất ổn.",
  },
];

export const TESTIMONIALS: CustomerTestimonial[] = [
  {
    name: "Lê Minh Hưng",
    company: "SEO Việt",
    logo: "/logo-seoviet.png",
    content: `Sau 1 thời gian trải nghiệm và đã sử dụng dịch vụ của InterData thì Hưng đánh giá chất lượng dịch vụ khá là tốt. Hưng cũng dùng dịch vụ rất nhiều bên ở Việt Nam rồi thì thấy dịch vụ không thua kém bất kể bên nào, nhiều khi còn nhỉnh hơn các bên. Hệ thống ổn định, đặc biệt giá thành tốt hơn so với các bên trên thị trường. Mong muốn của Hưng cũng như tất cả khách hàng là InterData sẽ duy trì sự ổn định bền vững ở hiện tại và tương lai.`,
  },
  {
    name: "Vĩnh Minh Đạo",
    company: "RealDev",
    logo: "/logo-realdev.png",
    content: `Với tư cách là đơn vị sử dụng trực tiếp và cung cấp dịch vụ website đến khách hàng toàn quốc, mình đã sử dụng dịch vụ của các đơn vị cung cấp VPS, Hosting, Dedicate từ trong nước đến nước ngoài. Sau khi sử dụng dịch vụ VPS tại InterData, mình rất ấn tượng với cấu hình chuẩn chỉnh và giá trị thực tế của dịch vụ. Mình đánh giá rất cao thái độ cầu thị của toàn thể công ty InterData và chất lượng sản phẩm dịch vụ.`,
  },
  {
    name: "Trịnh Bảo",
    company: "BALICO",
    logo: "/balico.png",
    content: `Mình thấy khá hài lòng với dịch vụ Cloud AMD của InterData. Website chạy ổn định, hiệu suất và các tính năng đều đáp ứng tốt nhu cầu của mình. Có lúc cũng gặp vài trục trặc nhỏ, nhưng đội ngũ kỹ thuật xử lý rất nhanh và nhiệt tình. Nhìn chung, dùng dịch vụ của InterData mình cảm thấy rất yên tâm.`,
  },
  {
    name: "Trường Phong",
    company: "Công ty TNHH Giải pháp Công nghệ Trường Phong",
    logo: "/logo-themewpgiare-truongphong.png",
    content: `Từ lúc chuyển qua dùng VPS của InterData, mình thấy website chạy mượt hơn hẳn, hiếm khi gặp lỗi. Đội ngũ hỗ trợ cũng rất chuyên nghiệp, lúc nào cần là phản hồi liền. Hiện tại thì mình hoàn toàn hài lòng với dịch vụ này.`,
  },
  {
    name: "Thắng Nguyễn",
    company: "UMIX Việt Nam",
    logo: "/logo-umix-vietnam.png",
    content: `Tôi đã chuyển website Umix sang chạy ở InterData, điều tôi hài lòng nhất chính là sự nhiệt tình của các nhân viên, hỗ trợ mọi vấn đề một cách nhanh chóng ngay cả lúc nửa đêm.`,
  },
  {
    name: "Trần Mạnh Hùng",
    company: "Digizone Việt Nam",
    logo: "/logo-digizone-vietnam.png",
    content: `Bên mình là Agency về thiết kế web và Ads nên rất chú trọng về tính ổn định, bảo mật của VPS, Hosting để đảm bảo chất lượng dịch vụ với khách hàng. Từ khi dùng dịch vụ của InterData thì mình thấy hạ tầng mạnh, cập nhật các dòng cấu hình server mới, tốc độ kết nối nhanh và đội ngũ hỗ trợ nhiệt tình. Mình tin tưởng vào chất lượng dịch vụ của InterData sẽ luôn đảm bảo ổn định và bảo mật cao.`,
  },
  {
    name: "Đặng Hải Triều",
    company: "Đồng Hồ Hải Triều",
    logo: "/logo-donghohaitrieu.png",
    content: `Chất lượng dịch vụ rất tốt! Đội ngũ hỗ trợ mau chóng, phối hợp nhịp nhàng để hỗ trợ mấy ca khó. Linh hoạt xử lý mấy tình huống ngoài phạm vi trách nhiệm luôn. Rất tuyệt vời.`,
  },
  {
    name: "Tạ Quốc Khánh",
    company: "Công ty Cổ phần Jobke",
    logo: "/logo-jobkey.png",
    content: `Đội ngũ hỗ trợ kỹ thuật nhiệt tình và nhanh chóng. Tôi sẽ giới thiệu thêm cho bạn bè và đối tác của mình về dịch vụ của InterData trong thời gian tới.`,
  },
];

export const press: PressItem[] = [
  {
    tag: "TECHMAG",
    title: "InterData và bài toán tối ưu chi phí hạ tầng cho doanh nghiệp trẻ",
    desc: "InterData giúp doanh nghiệp trẻ tối ưu chi phí với hạ tầng mạnh mẽ, linh hoạt và ổn định.",
  },
  {
    tag: "VIETDIGITAL",
    title: "Giải pháp VPS, Cloud Server linh hoạt cho thời đại số",
    desc: "Các giải pháp VPS và Cloud Server của InterData đáp ứng nhu cầu triển khai nhanh và mở rộng dễ dàng.",
  },
  {
    tag: "DEVCOMMUNITY",
    title:
      "InterData được nhiều developer lựa chọn nhờ hiệu năng và hỗ trợ tốt",
    desc: "Hiệu năng ổn định, hạ tầng tại Việt Nam và hỗ trợ 24/7 là điểm cộng lớn của InterData.",
  },
  {
    tag: "BUSINESS INSIGHT",
    title: "Xu hướng chuyển dịch lên hạ tầng cloud tại Việt Nam",
    desc: "Nhiều doanh nghiệp Việt đang chuyển dịch lên cloud để tăng hiệu quả vận hành và tiết kiệm chi phí.",
  },
  {
    tag: "STARTUP NEWS",
    title: "Hạ tầng giá tốt giúp startup tăng tốc sản phẩm",
    desc: "Chi phí hợp lý và khả năng mở rộng linh hoạt giúp các startup rút ngắn thời gian ra mắt sản phẩm.",
  },
  {
    tag: "CLOUD TODAY",
    title: "Anti-DDoS và uptime 99.99% - tiêu chuẩn mới cho VPS Việt",
    desc: "InterData đầu tư mạnh vào bảo mật và độ ổn định, đáp ứng yêu cầu khắt khe của khách hàng.",
  },
];

export const PRESS: PressArticle[] = [
  {
    href: "https://baoangiang.com.vn/vps-interdata-giai-phap-may-chu-ao-toi-uu-hieu-suat-va-chi-phi-a475417.html",
    thumb: "/press/thumb-angiang.png",
    partnerLogo: "/press/baoangiang.png",
    title: "VPS InterData: Giải pháp máy chủ ảo tối ưu hiệu suất và chi phí",
  },
  {
    href: "https://baohatinh.vn/thue-vps-tai-interdata-giai-phap-toi-uu-ha-tang-online-cho-doanh-nghiep-post304939.html",
    thumb: "/press/Thumb-baohatinh.jpg",
    partnerLogo: "/press/baohatinh.png",
    title:
      "Thuê VPS tại InterData: Giải pháp tối ưu hạ tầng online cho doanh nghiệp",
  },
  {
    href: "https://vnexpress.net/interdata-dua-giai-phap-viet-ra-thi-truong-quoc-te-4539197.html",
    thumb: "/press/thumb-vnexpress.webp",
    partnerLogo: "/press/vnexpress.png",
    title: "InterData đưa giải pháp Việt ra thị trường quốc tế",
  },
  {
    href: "https://thanhnien.vn/interdata-va-vnpt-hop-tac-chien-luoc-va-khai-thac-ha-tang-datacenter-185240701161300605.htm",
    thumb: "/press/thumb-baothanhnien.webp",
    partnerLogo: "/press/baothanhnien.webp",
    title:
      "InterData và VNPT hợp tác chiến lược và khai thác hạ tầng Datacenter",
  },
  {
    href: "https://cafef.vn/interdata-tang-mien-phi-luu-tru-web-nvme-dung-luong-6gb-toc-do-mang-1gbps-20230223134836995.chn",
    thumb: "/press/thumb-cafef.png",
    partnerLogo: "/press/cafef.png",
    title:
      "InterData tặng miễn phí lưu trữ web NVMe dung lượng 6GB, tốc độ mạng 1Gbps",
  },
  {
    href: "https://vtv.vn/cong-nghe/greencloud-hop-tac-cung-interdata-trien-khai-ha-tang-server-tai-viet-nam-20230411104845847.htm",
    thumb: "/press/thumb-vtv.png",
    partnerLogo: "/press/vtv.webp",
    title:
      "GreenCloud hợp tác cùng InterData triển khai hạ tầng Server tại Việt Nam",
  },
  {
    href: "https://dantri.com.vn/suc-manh-so/interdata-ra-mat-goi-cloud-server-network-port-10gbps-tai-viet-nam-20221123162831826.htm",
    thumb: "/press/thumb-dantri.webp",
    partnerLogo: "/press/dantri.webp",
    title: "InterData ra mắt gói Cloud Server Network Port 10Gbps tại Việt Nam",
  },
  {
    href: "https://www.24h.com.vn/doanh-nghiep/interdata-va-eztech-ky-ket-thoa-thuan-hop-tac-chien-luoc-cung-cap-giai-phap-ha-tang-datacenter-c849a1569291.html",
    thumb: "/press/thumb-24h.jpg",
    partnerLogo: "/press/24h.png",
    title:
      "InterData và EZTech ký kết thỏa thuận hợp tác chiến lược cung cấp giải pháp hạ tầng Datacenter",
  },
  {
    href: "https://vietnamnet.vn/interdata-hop-tac-vnpt-khai-thac-ha-tang-datacenter-va-cac-dich-vu-the-manh-2301215.html",
    thumb: "/press/thumb-vietnamnet.jpg",
    partnerLogo: "/press/Logo_Vietnamnet.png",
    title:
      "InterData hợp tác VNPT khai thác hạ tầng Datacenter và các dịch vụ thế mạnh",
  },
  {
    href: "https://baolamdong.vn/thong-tin-can-biet/202405/le-ky-ket-mou-giua-interdata-va-truong-dai-hoc-yersin-da-lat-b180e1a/",
    thumb: "/press/thumb-lamdong.jpg",
    partnerLogo: "/press/lamdong.png",
    title: "Lễ ký kết MOU giữa InterData và Trường Đại học Yersin Đà Lạt",
  },
  {
    href: "https://vtcnews.vn/interdata-hop-tac-cung-eztech-phat-trien-ha-tang-server-cloud-gpu-ar872150.html",
    thumb: "/press/thumb-vtc.webp",
    partnerLogo: "/press/vtcnews.webp",
    title: "InterData hợp tác cùng EZTech phát triển hạ tầng server cloud GPU",
  },
];

export const faqs = [
  [
    "VPS là gì?",
    "VPS là máy chủ ảo được chia tài nguyên riêng từ một máy chủ vật lý. Người dùng có CPU, RAM, ổ cứng và hệ điều hành riêng, có thể cài đặt website, ứng dụng, database hoặc phần mềm theo nhu cầu.",
  ],
  [
    "Cloud Server là gì?",
    "Cloud Server là máy chủ ảo chạy trên nền tảng điện toán đám mây. Dịch vụ này phù hợp khi bạn cần hạ tầng ổn định, dễ mở rộng tài nguyên và hạn chế rủi ro phụ thuộc vào một máy chủ đơn lẻ.",
  ],
  [
    "VPS và Cloud Server khác nhau như thế nào?",
    "VPS thường phù hợp với nhu cầu cố định và chi phí tối ưu. Cloud Server phù hợp hơn khi hệ thống cần mở rộng linh hoạt, vận hành ổn định hơn và có yêu cầu cao về khả năng sẵn sàng.",
  ],
  [
    "Nên thuê VPS hay Cloud Server cho website doanh nghiệp?",
    "Nếu website có lưu lượng vừa phải, cấu hình ổn định và cần tiết kiệm chi phí, VPS là lựa chọn hợp lý. Nếu website bán hàng, hệ thống nội bộ hoặc ứng dụng có lượng truy cập biến động, Cloud Server sẽ phù hợp hơn.",
  ],
  [
    "Thuê VPS cần quan tâm thông số nào nhất?",
    "Nên xem trước CPU, RAM, dung lượng SSD/NVMe, băng thông, Network Port, vị trí máy chủ, hệ điều hành hỗ trợ và chính sách backup. Với website nhiều truy cập, RAM, tốc độ ổ cứng và Network Port là các yếu tố rất quan trọng.",
  ],
  [
    "Bao nhiêu RAM là đủ để chạy website WordPress?",
    "Website WordPress cơ bản có thể bắt đầu từ 2GB RAM. Website có WooCommerce, nhiều plugin hoặc lượng truy cập cao nên dùng từ 4GB RAM trở lên để giảm lỗi quá tải và cải thiện tốc độ phản hồi.",
  ],
  [
    "Network Port ảnh hưởng gì đến tốc độ VPS?",
    "Network Port là giới hạn tốc độ kết nối mạng của máy chủ. Port cao giúp truyền dữ liệu tốt hơn khi website có nhiều người truy cập, tải file lớn hoặc chạy ứng dụng cần băng thông ổn định.",
  ],
  [
    "Ổ cứng NVMe khác gì SSD thông thường?",
    "NVMe có tốc độ đọc ghi và độ trễ tốt hơn SSD SATA thông thường. Với website, database hoặc ứng dụng cần xử lý nhiều truy vấn, NVMe giúp giảm thời gian tải và cải thiện hiệu năng tổng thể.",
  ],
  [
    "VPS có dùng được cho website nhiều traffic không?",
    "Có, nhưng cần chọn đúng cấu hình. Website nhiều traffic nên ưu tiên CPU mạnh, RAM đủ lớn, ổ NVMe, Network Port cao và có cấu hình cache phù hợp để tránh nghẽn tài nguyên vào giờ cao điểm.",
  ],
  [
    "Có được toàn quyền quản trị VPS hoặc Cloud Server không?",
    "Có. Khách hàng thường được cấp quyền root với Linux hoặc Administrator với Windows để chủ động cài đặt phần mềm, cấu hình bảo mật, quản lý dữ liệu và triển khai ứng dụng.",
  ],
  [
    "InterData hỗ trợ những hệ điều hành nào?",
    "InterData hỗ trợ các hệ điều hành phổ biến như Ubuntu, Debian, AlmaLinux, CentOS/Rocky Linux tùy thời điểm, cùng Windows Server cho những nhu cầu cần môi trường Windows.",
  ],
  [
    "Sau khi thanh toán bao lâu thì dịch vụ được kích hoạt?",
    "Thông thường dịch vụ được kích hoạt sau khi hệ thống ghi nhận thanh toán thành công. Một số cấu hình đặc biệt hoặc chương trình ưu đãi có thể cần thêm thời gian kiểm tra trước khi bàn giao.",
  ],
  [
    "Có thể nâng cấp CPU, RAM hoặc dung lượng sau này không?",
    "Có. Khi nhu cầu tăng, khách hàng có thể nâng cấp tài nguyên theo chính sách của từng dòng dịch vụ. Nên trao đổi trước với kỹ thuật nếu hệ thống đang chạy production để hạn chế gián đoạn.",
  ],
  [
    "Dữ liệu trên VPS có được sao lưu tự động không?",
    "Backup phụ thuộc vào gói dịch vụ và cấu hình khách hàng chọn. Với dữ liệu quan trọng, nên chủ động thiết lập backup định kỳ, lưu bản sao ngoài máy chủ chính và kiểm tra khả năng khôi phục.",
  ],
  [
    "InterData có hỗ trợ kỹ thuật 24/7 không?",
    "Có. InterData hỗ trợ kỹ thuật 24/7 qua các kênh chăm sóc khách hàng chính thức. Đội kỹ thuật có thể hỗ trợ các vấn đề liên quan đến hạ tầng, kết nối, vận hành và xử lý sự cố dịch vụ.",
  ],
  [
    "Làm sao chọn được gói VPS hoặc Cloud Server phù hợp?",
    "Hãy bắt đầu từ nhu cầu thực tế: loại website hoặc ứng dụng, lượng truy cập, dung lượng dữ liệu, phần mềm cần chạy, ngân sách và mức độ quan trọng của uptime. Nếu chưa chắc cấu hình, nên chọn gói vừa đủ và giữ khả năng nâng cấp.",
  ],
] as const;
