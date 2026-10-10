import articleRecords from "./articles.json";

export type Approval = "pending" | "approved";
export const reviewMode = process.env.NEXT_PUBLIC_CONTENT_MODE !== "public";
// Toggle homepage editorial annotations without changing content approval filters.
export const showEditorialNotes = false;
export const links = {
  vps: "https://interdata.vn/thue-vps/",
  // Matches the trial CTA in the source project's components/header/menu.js.
  trial: "https://interdata.vn/thue-vps/#pricing",
  cloud: "https://interdata.vn/cloud-server/",
  dedicated: "https://interdata.vn/vietnam-dedicated-server",
  colocation: "https://interdata.vn/vietnam-co-location",
  about: "/gioi-thieu/",
  contact: "/lien-he/",
  careers: "https://interdata.vn/blog/tuyen-dung/",
  blog: "https://interdata.vn/blog/",
  promotion: "https://interdata.vn/canhme/",
  ticket: "https://support.interdata.vn/submitticket.php",
  register: "https://support.interdata.vn/register.php",
  login: "https://support.interdata.vn/index.php?rp=/login",
  privacy: "https://interdata.vn/privacy-policy",
  terms: "https://interdata.vn/terms-and-condition",
  sla: "https://interdata.vn/service-level-agreement",
};
export const claims: {
  id: string;
  text: string;
  status: Approval;
  source: string;
  note: string;
}[] = [
  {
    id: "uptime",
    text: "Uptime 99.9% SLA",
    status: "pending",
    source: "Design brief",
    note: "Xác nhận phạm vi dịch vụ và điều kiện SLA.",
  },
  {
    id: "support",
    text: "Support 24/7",
    status: "pending",
    source: "Design brief",
    note: "Xác nhận kênh và phạm vi hỗ trợ.",
  },
  {
    id: "bandwidth",
    text: "80Gbp băng thông",
    status: "pending",
    source: "Design brief",
    note: "80Gbp là đơn vị mơ hồ. Cần xác nhận trước khi đổi sang 80 Gbps; xác nhận tổng mạng hay mỗi máy chủ.",
  },
  {
    id: "business",
    text: "30.000+ Doanh Nghiệp Tin Tưởng InterData",
    status: "pending",
    source: "Design brief",
    note: "Xác nhận số doanh nghiệp và thời điểm thống kê; khác tập khách hàng.",
  },
  {
    id: "years",
    text: "12+ Năm Kinh Nghiệm",
    status: "pending",
    source: "Design brief",
    note: "Xác nhận mốc bắt đầu và phạm vi kinh nghiệm.",
  },
  {
    id: "customers",
    text: "100.000+ Khách Hàng",
    status: "pending",
    source: "Design brief",
    note: "Xác nhận định nghĩa khách hàng, tập dữ liệu và thời điểm.",
  },
  {
    id: "servers",
    text: "1000+ Máy Chủ",
    status: "pending",
    source: "Design brief",
    note: "Xác nhận máy chủ vật lý/ảo và thời điểm thống kê.",
  },
];
export const services = [
  {
    id: "vps",
    name: "VPS",
    type: "Máy chủ ảo",
    icon: "server",
    description:
      "Một môi trường riêng để vận hành website, ứng dụng và công cụ của bạn.",
    features: [
      "Chủ động cài đặt phần mềm",
      "Chọn CPU, RAM theo mức tải",
      "Phù hợp website & self-host",
    ],
    href: links.vps,
    cta: "Tìm hiểu dịch vụ VPS",
  },
  {
    id: "cloud",
    name: "Cloud Server",
    type: "Hạ tầng đám mây",
    icon: "cloud",
    description:
      "Lựa chọn tài nguyên cho ứng dụng cần phát triển và mở rộng theo từng giai đoạn.",
    features: [
      "Lựa chọn cấu hình AMD / Intel",
      "Website, API & hệ thống nội bộ",
      "Trao đổi phương án mở rộng",
    ],
    href: links.cloud,
    cta: "Khám phá Cloud Server",
  },
  {
    id: "dedicated",
    name: "Thuê Máy Chủ",
    type: "Máy chủ vật lý riêng",
    icon: "database",
    description:
      "Phần cứng dành riêng cho workload cần tài nguyên lớn và quyền kiểm soát hệ thống.",
    features: [
      "Tài nguyên phần cứng riêng",
      "Ứng dụng & cơ sở dữ liệu lớn",
      "Chọn cấu hình theo yêu cầu",
    ],
    href: links.dedicated,
    cta: "Xem dịch vụ máy chủ",
  },
  {
    id: "colocation",
    name: "Chỗ Đặt Máy Chủ",
    type: "Không gian datacenter",
    icon: "network",
    description:
      "Bạn sở hữu thiết bị. InterData cung cấp môi trường datacenter để đặt máy chủ.",
    features: [
      "Dùng phần cứng bạn đang có",
      "Không gian, điện & kết nối",
      "Thống nhất phạm vi vận hành",
    ],
    href: links.colocation,
    cta: "Tìm hiểu chỗ đặt máy chủ",
  },
] as const;
export const solutions = [
  {
    id: "private-network",
    name: "Triển khai Private Network",
    shortName: "Private Network",
    icon: "network",
    description:
      "Kết nối các máy chủ qua mạng riêng để tổ chức giao tiếp nội bộ. Trao đổi sơ đồ kết nối, phân vùng mạng và nhu cầu truy cập của hệ thống.",
    tags: "Mạng riêng · Kết nối nội bộ",
  },
  {
    id: "proxmox",
    name: "Triển Khai Ảo Hóa Proxmox / CEPH",
    shortName: "Proxmox / CEPH",
    icon: "layers",
    description:
      "Triển khai môi trường ảo hóa Proxmox kết hợp lưu trữ phân tán CEPH. Lựa chọn tài nguyên, kiến trúc cụm và phương án vận hành theo nhu cầu.",
    tags: "Ảo hóa · Lưu trữ phân tán",
  },
  {
    id: "kubernetes",
    name: "Triển khai Kubernetes (K8s)",
    shortName: "Kubernetes",
    icon: "boxes",
    description:
      "Triển khai ứng dụng container theo cụm. Làm rõ kiến trúc, môi trường chạy và trách nhiệm quản trị trước khi chọn.",
    tags: "Container · Điều phối ứng dụng",
  },
  {
    id: "vmware",
    name: "Triển khai VMWare",
    shortName: "VMware",
    icon: "database",
    description:
      "Triển khai môi trường máy ảo trên nền tảng VMware. Trao đổi tài nguyên, yêu cầu bản quyền và cách quản trị theo hệ thống bạn đang vận hành.",
    tags: "Máy ảo · Quản trị hạ tầng",
  },
  {
    id: "s3",
    name: "Triển khai lưu trữ S3 Storage",
    shortName: "S3 Storage",
    icon: "harddrive",
    description:
      "Lưu trữ đối tượng cho tệp, hình ảnh và bản sao lưu. Đánh giá dung lượng, truy cập và yêu cầu tích hợp của ứng dụng.",
    tags: "Object storage · Dữ liệu",
  },
] as const;
export const testimonials = [
  {
    name: "Lê Minh Hưng",
    company: "SEO Việt",
    logo: "/images/testimonials/logo-seoviet.png",
    quote:
      "Sau 1 thời gian trải nghiệm và đã sử dụng dịch vụ của InterData thì Hưng đánh giá chất lượng dịch vụ khá là tốt. Hưng cũng dùng dịch vụ rất nhiều bên ở Việt Nam rồi thì thấy dịch vụ không thua kém bất kể bên nào, nhiều khi còn nhỉnh hơn các bên. Hệ thống ổn định, đặc biệt giá thành tốt hơn so với các bên trên thị trường. Mong muốn của Hưng cũng như tất cả khách hàng là InterData sẽ duy trì sự ổn định bền vững ở hiện tại và tương lai.",
    logoWidth: 609,
    logoHeight: 236,
  },
  {
    name: "Vĩnh Minh Đạo",
    company: "RealDev",
    logo: "/images/testimonials/logo-realdev.png",
    quote:
      "Với tư cách là đơn vị sử dụng trực tiếp và cung cấp dịch vụ website đến khách hàng toàn quốc, mình đã sử dụng dịch vụ của các đơn vị cung cấp VPS, Hosting, Dedicate từ trong nước đến nước ngoài. Sau khi sử dụng dịch vụ VPS tại InterData, mình rất ấn tượng với cấu hình chuẩn chỉnh và giá trị thực tế của dịch vụ. Mình đánh giá rất cao thái độ cầu thị của toàn thể công ty InterData và chất lượng sản phẩm dịch vụ.",
    logoWidth: 500,
    logoHeight: 277,
  },
  {
    name: "Trịnh Bảo",
    company: "BALICO",
    logo: "/images/testimonials/balico.png",
    quote:
      "Mình thấy khá hài lòng với dịch vụ Cloud AMD của InterData. Website chạy ổn định, hiệu suất và các tính năng đều đáp ứng tốt nhu cầu của mình. Có lúc cũng gặp vài trục trặc nhỏ, nhưng đội ngũ kỹ thuật xử lý rất nhanh và nhiệt tình. Nhìn chung, dùng dịch vụ của InterData mình cảm thấy rất yên tâm.",
    logoWidth: 400,
    logoHeight: 111,
  },
  {
    name: "Trường Phong",
    company: "Công ty TNHH Giải pháp Công nghệ Trường Phong",
    logo: "/images/testimonials/logo-themewpgiare-truongphong.png",
    quote:
      "Từ lúc chuyển qua dùng VPS của InterData, mình thấy website chạy mượt hơn hẳn, hiếm khi gặp lỗi. Đội ngũ hỗ trợ cũng rất chuyên nghiệp, lúc nào cần là phản hồi liền. Hiện tại thì mình hoàn toàn hài lòng với dịch vụ này.",
    logoWidth: 1024,
    logoHeight: 269,
  },
  {
    name: "Thắng Nguyễn",
    company: "UMIX Việt Nam",
    logo: "/images/testimonials/logo-umix-vietnam.png",
    quote:
      "Tôi đã chuyển website Umix sang chạy ở InterData, điều tôi hài lòng nhất chính là sự nhiệt tình của các nhân viên, hỗ trợ mọi vấn đề một cách nhanh chóng ngay cả lúc nửa đêm.",
    logoWidth: 148,
    logoHeight: 53,
  },
  {
    name: "Trần Mạnh Hùng",
    company: "Digizone Việt Nam",
    logo: "/images/testimonials/logo-digizone-vietnam.png",
    quote:
      "Bên mình là Agency về thiết kế web và Ads nên rất chú trọng về tính ổn định, bảo mật của VPS, Hosting để đảm bảo chất lượng dịch vụ với khách hàng. Từ khi dùng dịch vụ của InterData thì mình thấy hạ tầng mạnh, cập nhật các dòng cấu hình server mới, tốc độ kết nối nhanh và đội ngũ hỗ trợ nhiệt tình. Mình tin tưởng vào chất lượng dịch vụ của InterData sẽ luôn đảm bảo ổn định và bảo mật cao.",
    logoWidth: 1024,
    logoHeight: 384,
  },
  {
    name: "Đặng Hải Triều",
    company: "Đồng Hồ Hải Triều",
    logo: "/images/testimonials/logo-donghohaitrieu.png",
    quote:
      "Chất lượng dịch vụ rất tốt! Đội ngũ hỗ trợ mau chóng, phối hợp nhịp nhàng để hỗ trợ mấy ca khó. Linh hoạt xử lý mấy tình huống ngoài phạm vi trách nhiệm luôn. Rất tuyệt vời.",
    logoWidth: 900,
    logoHeight: 190,
  },
  {
    name: "Tạ Quốc Khánh",
    company: "Công ty Cổ phần Jobkey",
    logo: "/images/testimonials/logo-jobkey.png",
    quote:
      "Đội ngũ hỗ trợ kỹ thuật nhiệt tình và nhanh chóng. Tôi sẽ giới thiệu thêm cho bạn bè và đối tác của mình về dịch vụ của InterData trong thời gian tới.",
    logoWidth: 260,
    logoHeight: 55,
  },
];
// Titles, links, photos and logos sourced from D:/InterData/thue-vps/components/partners.js.
export const press = [
  {
    publication: "VnExpress",
    title: "InterData đưa giải pháp Việt ra thị trường quốc tế",
    image: "/images/press/news.png",
    logo: "/images/press/logo-news-1.png",
    logoWidth: 149,
    logoHeight: 28,
    href: "https://vnexpress.net/interdata-dua-giai-phap-viet-ra-thi-truong-quoc-te-4539197.html",
  },
  {
    publication: "VTV",
    title:
      "GreenCloud hợp tác cùng InterData triển khai hạ tầng Server tại Việt Nam",
    image: "/images/press/vtv.png",
    logo: "/images/press/vtv.jpg",
    logoWidth: 122,
    logoHeight: 50,
    href: "https://vtv.vn/cong-nghe/greencloud-hop-tac-cung-interdata-trien-khai-ha-tang-server-tai-viet-nam-20230411104845847.htm",
  },
  {
    publication: "Thanh Niên",
    title:
      "InterData và VNPT hợp tác chiến lược và khai thác hạ tầng Datacenter",
    image: "/images/press/news-1.png",
    logo: "/images/press/logo-news.png",
    logoWidth: 133,
    logoHeight: 32,
    href: "https://thanhnien.vn/interdata-va-vnpt-hop-tac-chien-luoc-va-khai-thac-ha-tang-datacenter-185240701161300605.htm",
  },
  {
    publication: "Dân trí",
    title: "InterData ra mắt gói Cloud Server Network Port 10Gbps tại Việt Nam",
    image: "/images/press/nhansu.webp",
    logo: "/images/press/bao-dien-tu-dan-tri.png",
    logoWidth: 396,
    logoHeight: 117,
    href: "https://dantri.com.vn/suc-manh-so/interdata-ra-mat-goi-cloud-server-network-port-10gbps-tai-viet-nam-20221123162831826.htm",
  },
  {
    publication: "VietNamNet",
    title:
      "InterData hợp tác VNPT khai thác hạ tầng Datacenter và các dịch vụ thế mạnh",
    image: "/images/press/vnpt.jpg",
    logo: "/images/press/bao-vietnamnet.png",
    logoWidth: 338,
    logoHeight: 141,
    href: "https://vietnamnet.vn/interdata-hop-tac-vnpt-khai-thac-ha-tang-datacenter-va-cac-dich-vu-the-manh-2301215.html",
  },
  {
    publication: "VTC News",
    title: "InterData hợp tác cùng EZTech phát triển hạ tầng server cloud GPU",
    image: "/images/press/24h.jpg",
    logo: "/images/press/LOGO-vtc.png",
    logoWidth: 600,
    logoHeight: 264,
    href: "https://vtcnews.vn/interdata-hop-tac-cung-eztech-phat-trien-ha-tang-server-cloud-gpu-ar872150.html",
  },
  {
    publication: "24h",
    title:
      "InterData và EZTech ký kết thỏa thuận hợp tác chiến lược cung cấp giải pháp hạ tầng Datacenter",
    image: "/images/press/24h.jpg",
    logo: "/images/press/24hh.png",
    logoWidth: 3840,
    logoHeight: 2160,
    href: "https://www.24h.com.vn/doanh-nghiep/interdata-va-eztech-ky-ket-thoa-thuan-hop-tac-chien-luoc-cung-cap-giai-phap-ha-tang-datacenter-c849a1569291.html",
  },
  {
    publication: "CafeF",
    title:
      "InterData tặng miễn phí lưu trữ web NVMe dung lượng 6GB, tốc độ mạng 1Gbps",
    image: "/images/press/news-2.png",
    logo: "/images/press/logo-news-2.png",
    logoWidth: 142,
    logoHeight: 30,
    href: "https://cafef.vn/interdata-tang-mien-phi-luu-tru-web-nvme-dung-luong-6gb-toc-do-mang-1gbps-20230223134836995.chn",
  },
  {
    publication: "Tổ Quốc",
    title:
      "InterData tặng miễn phí lưu trữ web NVMe dung lượng 6GB, tốc độ mạng 1Gbps",
    image: "/images/press/aChau.png",
    logo: "/images/press/Toquoc.jpg",
    logoWidth: 474,
    logoHeight: 196,
    href: "https://ttvn.toquoc.vn/interdata-tang-mien-phi-luu-tru-web-nvme-dung-luong-6gb-toc-do-mang-1gbps-2023022311353656.htm",
  },
  {
    publication: "Vietnam.vn",
    title:
      "InterData hợp tác VNPT khai thác hạ tầng Datacenter và các dịch vụ thế mạnh",
    image: "/images/press/vnpt.jpg",
    logo: "/images/press/logo-bao-vietnam.png",
    logoWidth: 300,
    logoHeight: 121,
    href: "https://www.vietnam.vn/interdata-hop-tac-vnpt-khai-thac-ha-tang-datacenter-va-cac-dich-vu-the-manh/",
  },
  {
    publication: "Thế Giới Kinh Doanh",
    title:
      "InterData tặng miễn phí lưu trữ web NVMe dung lượng 6GB, tốc độ mạng 1Gbps",
    image: "/images/press/aChau.png",
    logo: "/images/press/THE_GIOI_KINH_DOANH_cbc2b.png",
    logoWidth: 583,
    logoHeight: 135,
    href: "https://thegioikinhdoanh.vn/hi-tech/interdata-tang-mien-phi-luu-tru-web-nvme-dung-luong-6gb-toc-do-mang-1gbps.html",
  },
  {
    publication: "Báo An Giang",
    title: "VPS InterData: Giải pháp máy chủ ảo tối ưu hiệu suất và chi phí",
    image: "/images/press/baoangiang.png",
    logo: "/images/press/logobag.png",
    logoWidth: 300,
    logoHeight: 106,
    href: "https://baoangiang.com.vn/vps-interdata-giai-phap-may-chu-ao-toi-uu-hieu-suat-va-chi-phi-a475417.html",
  },
  {
    publication: "Báo Hà Tĩnh",
    title:
      "Thuê VPS tại InterData: Giải pháp tối ưu hạ tầng online cho doanh nghiệp",
    image: "/images/press/nhansu.webp",
    logo: "/images/press/bao-ha-tinh.png",
    logoWidth: 960,
    logoHeight: 538,
    href: "https://baohatinh.vn/thue-vps-tai-interdata-giai-phap-toi-uu-ha-tang-online-cho-doanh-nghiep-post304939.html",
  },
  {
    publication: "Báo Lâm Đồng",
    title: "Lễ ký kết MOU giữa InterData và Trường Đại học Yersin Đà Lạt",
    image: "/images/press/lamdong1.jpg",
    logo: "/images/press/lamdong.png",
    logoWidth: 598,
    logoHeight: 138,
    href: "https://baolamdong.vn/thong-tin-can-biet/202405/le-ky-ket-mou-giua-interdata-va-truong-dai-hoc-yersin-da-lat-b180e1a/",
  },
];
export const partners = [
  { name: "Đại học Bách Khoa Hà Nội", asset: "dai-hoc-bach-khoa" },
  { name: "Trường Cao đẳng FPT Polytechnic", asset: "FPT_Polytechnic" },
  { name: "Đại học Công Thương", asset: "dai-hoc-cong-thuong" },
  { name: "Trường Đại học Yersin Đà Lạt", asset: "dai-hoc-yersin" },
  {
    name: "Trường Cao đẳng Kinh tế Đối ngoại",
    asset: "cao-dang-kinh-te-doi-ngoai",
  },
  { name: "Trường Đại học Gia Định", asset: "dai-hoc-gia-dinh" },
  { name: "Melbourne Polytechnic Việt Nam", asset: "Melbourne-Polytechnic" },
];
export const campaigns: {
  title: string;
  image: string;
  href: string;
  status: Approval;
}[] = [
  {
    title: "Inter Platinum Series 2026",
    image: "/images/promo-platinum.webp",
    href: links.promotion,
    status: "pending",
  },
  {
    title: "Real Cloud 2026",
    image: "/images/promo-cloud.webp",
    href: links.promotion,
    status: "pending",
  },
];
export const needs = [
  {
    id: "website",
    name: "Website & ứng dụng",
    icon: "globe",
    title: "Chọn VPS hoặc Cloud Server cho website và ứng dụng",
    description:
      "Vận hành website doanh nghiệp, cửa hàng trực tuyến, API hoặc hệ thống nội bộ. Chọn môi trường máy chủ theo phần mềm, hệ điều hành và mức tải dự kiến.",
    recommendations: [
      "VPS AMD",
      "VPS Platinum",
      "VPS Linux",
      "VPS Gold",
      "AMD Cloud Gen 3",
      "Intel Platinum Cloud Gen 2",
    ],
    reason:
      "Đối chiếu các dòng VPS và Cloud Server theo CPU, RAM, dung lượng lưu trữ và yêu cầu vận hành. Lựa chọn cấu hình dựa trên ứng dụng thực tế và kế hoạch tăng trưởng.",
    checks: [
      "Mã nguồn, hệ điều hành và số website / ứng dụng",
      "Lượt truy cập hoặc số người dùng vào giờ cao điểm",
      "CPU, RAM, dung lượng và lịch sao lưu dự kiến",
    ],
    cta: "Xem các dòng VPS",
    href: links.vps,
    secondaryCta: "Xem Cloud Server",
    secondaryHref: links.cloud,
  },
  {
    id: "app",
    name: "Tự động hóa & AI",
    icon: "code",
    title: "Chạy workflow n8n và ứng dụng EzyPlatform",
    description:
      "Self-host n8n để kết nối ứng dụng và tự động hóa tác vụ; hoặc triển khai ứng dụng xây dựng cùng AI trên nền tảng EzyPlatform.",
    recommendations: ["VPS n8n", "VPS Vibe Coding"],
    reason:
      "VPS n8n dành cho các workflow tự động hóa. VPS Vibe Coding chỉ hỗ trợ mã nguồn EzyPlatform; cần xác định đúng nền tảng ứng dụng trước khi chọn dịch vụ.",
    checks: [
      "Nền tảng sử dụng: n8n hay mã nguồn EzyPlatform",
      "Số workflow, lịch chạy và ứng dụng cần kết nối",
      "Tài nguyên, dữ liệu cần lưu và người quản trị",
    ],
    cta: "Xem VPS n8n",
    href: "https://interdata.vn/vps-n8n/",
    secondaryCta: "Xem VPS Vibe Coding",
    secondaryHref: "https://interdata.vn/vps-vibe-coding/",
  },
  {
    id: "virtual",
    name: "Ảo hóa & mạng riêng",
    icon: "layers",
    title: "Triển khai máy ảo, container và kết nối nội bộ",
    description:
      "Tổ chức môi trường nhiều máy ảo, triển khai cụm ứng dụng container hoặc kết nối các máy chủ qua mạng riêng. Phương án cần phù hợp với kiến trúc và đội ngũ vận hành.",
    recommendations: [
      "Proxmox / CEPH",
      "VMware",
      "Kubernetes (K8s)",
      "Private Network",
    ],
    reason:
      "Proxmox / CEPH và VMware phục vụ môi trường máy ảo; Kubernetes điều phối ứng dụng container; Private Network tổ chức kết nối nội bộ. Làm rõ nhu cầu lưu trữ, bản quyền và quản trị trước khi triển khai.",
    checks: [
      "Số máy ảo / container và sơ đồ kết nối",
      "Tài nguyên, lưu trữ và yêu cầu dự phòng",
      "Bản quyền phần mềm và đội ngũ quản trị",
    ],
    cta: "Tư vấn ảo hóa & mạng riêng",
    href: links.contact,
  },
  {
    id: "storage",
    name: "Máy chủ & lưu trữ",
    icon: "harddrive",
    title: "Thuê phần cứng, đặt thiết bị hoặc lưu trữ tệp",
    description:
      "Thuê máy chủ vật lý riêng, đặt thiết bị bạn sở hữu tại datacenter hoặc lưu trữ tệp và bản sao lưu. Chọn dịch vụ theo tài sản sẵn có và cách dữ liệu được sử dụng.",
    recommendations: ["Thuê Máy Chủ", "Chỗ Đặt Máy Chủ", "S3 Storage"],
    reason:
      "Thuê Máy Chủ khi cần phần cứng riêng; Chỗ Đặt Máy Chủ khi đã có thiết bị. S3 Storage lưu dữ liệu dạng đối tượng cho ứng dụng, hình ảnh và bản sao lưu. Mỗi lựa chọn có yêu cầu vận hành và truy cập khác nhau.",
    checks: [
      "Thiết bị sẵn có hoặc cấu hình máy chủ cần thuê",
      "Kết nối mạng; dung lượng và tần suất truy cập tệp",
      "Phạm vi quản trị, sao lưu và yêu cầu khôi phục",
    ],
    cta: "Tư vấn máy chủ & lưu trữ",
    href: links.contact,
  },
] as const;
export const infrastructure: {
  name: string;
  detail: string;
  icon: string;
  status: Approval;
  source: string;
}[] = [
  {
    name: "Datacenter Việt Nam",
    detail: "Viettel IDC & FPT",
    icon: "building",
    status: "pending",
    source: "Design brief",
  },
  {
    name: "Phần cứng thế hệ mới",
    detail: "AMD EPYC & Intel Xeon thế hệ mới, SSD NVMe U.2 Gen4.",
    icon: "cpu",
    status: "pending",
    source: "Design brief",
  },
  {
    name: "Hạ tầng mạng tốc độ cao",
    detail: "Trao đổi yêu cầu kết nối trong nước và quốc tế theo từng dịch vụ.",
    icon: "network",
    status: "pending",
    source: "Design brief",
  },
  {
    name: "Bảo vệ & Giám sát",
    detail:
      "Làm rõ phạm vi bảo vệ, giám sát và phối hợp xử lý sự cố khi tư vấn.",
    icon: "shield",
    status: "pending",
    source: "Design brief",
  },
];
export const articles = articleRecords.map((article, i) => ({
  ...article,
  category:
    i === 3
      ? "Tin InterData"
      : i === 0
        ? "Kiến thức VPS"
        : i === 1
          ? "Hướng dẫn"
          : "Thực hành",
}));
