import articleRecords from "./articles.json";

export type Approval = "pending" | "approved";
export const reviewMode = process.env.NEXT_PUBLIC_CONTENT_MODE !== "public";
// Toggle homepage editorial annotations without changing content approval filters.
export const showEditorialNotes = false;
export const links = {
  vps: "https://interdata.vn/thue-vps/",
  cloud: "https://interdata.vn/cloud-server/",
  dedicated: "https://interdata.vn/vietnam-dedicated-server",
  colocation: "https://interdata.vn/vietnam-co-location",
  about: "https://interdata.vn/about-us",
  contact: "https://interdata.vn/contact",
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
    id: "proxmox",
    name: "Triển khai Proxmox",
    icon: "layers",
    description:
      "Tổ chức máy ảo và container trên hạ tầng riêng. Bắt đầu từ số lượng máy ảo, tài nguyên và cách vận hành.",
    tags: "Ảo hóa · Quản trị tập trung",
  },
  {
    id: "kubernetes",
    name: "Triển khai Kubernetes (K8s)",
    icon: "boxes",
    description:
      "Triển khai ứng dụng container theo cụm. Làm rõ kiến trúc, môi trường chạy và trách nhiệm quản trị trước khi chọn.",
    tags: "Container · Điều phối ứng dụng",
  },
  {
    id: "s3",
    name: "Lưu trữ S3 Storage",
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
    company: "Công ty Cổ phần Jobke",
    logo: "/images/testimonials/logo-jobkey.png",
    quote:
      "Đội ngũ hỗ trợ kỹ thuật nhiệt tình và nhanh chóng. Tôi sẽ giới thiệu thêm cho bạn bè và đối tác của mình về dịch vụ của InterData trong thời gian tới.",
    logoWidth: 260,
    logoHeight: 55,
  },
];
export const press = [
  {
    publication: "VnExpress",
    title: "InterData đưa giải pháp Việt ra thị trường quốc tế",
    image: "/images/press-vnexpress.webp",
    href: "https://vnexpress.net/interdata-dua-giai-phap-viet-ra-thi-truong-quoc-te-4539197.html",
  },
  {
    publication: "Thanh Niên",
    title:
      "InterData và VNPT hợp tác chiến lược và khai thác hạ tầng Datacenter",
    image: "/images/press-thanhnien.webp",
    href: "https://thanhnien.vn/interdata-va-vnpt-hop-tac-chien-luoc-va-khai-thac-ha-tang-datacenter-185240701161300605.htm",
  },
  {
    publication: "VTV",
    title:
      "GreenCloud hợp tác cùng InterData triển khai hạ tầng Server tại Việt Nam",
    image: "/images/press-vtv.webp",
    href: "https://vtv.vn/cong-nghe/greencloud-hop-tac-cung-interdata-trien-khai-ha-tang-server-tai-viet-nam-20230411104845847.htm",
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
    name: "Website & Bán hàng",
    icon: "globe",
    title: "Hạ tầng cho website và cửa hàng trực tuyến",
    description:
      "Từ website doanh nghiệp đến cửa hàng có nhiều lượt truy cập, chọn tài nguyên theo nền tảng và mức tải thực tế.",
    recommendations: ["VPS", "Cloud Server"],
    reason:
      "VPS cho môi trường quản trị riêng. Cân nhắc Cloud Server khi cần kế hoạch mở rộng tài nguyên.",
    checks: [
      "Nền tảng website và số website",
      "Lượt truy cập vào giờ cao điểm",
      "Dung lượng dữ liệu và người quản trị",
    ],
    cta: "Xem dịch vụ VPS",
    href: links.vps,
  },
  {
    id: "app",
    name: "Ứng dụng & Self-host",
    icon: "code",
    title: "Một môi trường chủ động cho ứng dụng của bạn",
    description:
      "Chạy API, công cụ nội bộ, n8n hoặc ứng dụng tự quản lý với tài nguyên dành cho cả ứng dụng và cơ sở dữ liệu.",
    recommendations: ["VPS", "Cloud Server"],
    reason:
      "Chọn theo runtime, RAM thực dùng và dữ liệu. Dự trù tài nguyên cho log, backup và môi trường thử nghiệm.",
    checks: [
      "Runtime và số ứng dụng",
      "Database, volume và lịch sao lưu",
      "Mức tải đồng thời dự kiến",
    ],
    cta: "Khám phá Cloud Server",
    href: links.cloud,
  },
  {
    id: "virtual",
    name: "Ảo hóa & container",
    icon: "layers",
    title: "Tổ chức máy ảo và cụm ứng dụng",
    description:
      "Xây dựng môi trường ảo hóa hoặc container theo kiến trúc của hệ thống và năng lực vận hành của đội ngũ.",
    recommendations: ["Thuê Máy Chủ", "Proxmox", "Kubernetes (K8s)"],
    reason:
      "Máy chủ vật lý cho phần cứng riêng; Proxmox cho máy ảo, Kubernetes cho điều phối container. Không phải workload nào cũng cần một cụm.",
    checks: [
      "Số máy ảo hoặc container",
      "Yêu cầu dự phòng và lưu trữ",
      "Đội ngũ chịu trách nhiệm vận hành",
    ],
    cta: "Trao đổi phương án triển khai",
    href: links.contact,
  },
  {
    id: "storage",
    name: "Lưu trữ dữ liệu",
    icon: "harddrive",
    title: "Chọn nơi lưu trữ theo cách dữ liệu được sử dụng",
    description:
      "Tệp ứng dụng, ảnh, dữ liệu dài hạn và bản sao lưu có yêu cầu lưu trữ khác nhau.",
    recommendations: ["S3 Storage", "Chỗ Đặt Máy Chủ"],
    reason:
      "S3 cho dữ liệu dạng đối tượng. Chỗ đặt máy chủ dành cho thiết bị lưu trữ bạn sở hữu. Xác nhận tích hợp, truy cập và chi phí truyền dữ liệu.",
    checks: [
      "Dung lượng hiện tại và mức tăng trưởng",
      "Tần suất đọc / ghi, tải xuống",
      "Thời gian lưu và yêu cầu khôi phục",
    ],
    cta: "Tư vấn phương án lưu trữ",
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
