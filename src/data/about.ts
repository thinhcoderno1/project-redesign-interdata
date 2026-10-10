// Editorial copy and photo captions are backed by the official pages listed here.
// Dates below describe the events, not the publication dates of their articles.
export const aboutSources = {
  company: "https://interdata.vn/about-us",
  workshop:
    "https://interdata.vn/blog/interdata-chao-don-sinh-vien-truong-cao-dang-fpt-polytechnic-ho-chi-minh/",
  career:
    "https://interdata.vn/blog/fit-career-day-2026-ket-noi-nhan-tai-kien-tao-tuong-lai/",
  vnpt: "https://interdata.vn/blog/interdata-hop-tac-chien-luoc-cung-vnpt/",
  yersin:
    "https://interdata.vn/blog/le-ky-ket-mou-interdata-va-dai-hoc-yersin/",
} as const;

export const aboutPhotos = {
  welcome: {
    src: "/images/about/workshop-group.webp",
    width: 1600,
    height: 1200,
    alt: "InterData đón sinh viên FPT Polytechnic Hồ Chí Minh tham quan doanh nghiệp ngày 21/02/2025",
  },
  booth: {
    src: "/images/about/fit-booth.webp",
    width: 1024,
    height: 683,
    alt: "Nhân sự InterData trao đổi với ứng viên tại FIT Career Day 2026",
  },
  workshop: {
    src: "/images/about/workshop-speaker.webp",
    width: 1600,
    height: 902,
    alt: "Buổi chia sẻ về nghề lập trình tại văn phòng InterData với sinh viên FPT Polytechnic",
  },
  server: {
    src: "/images/about/server-tour.webp",
    width: 1600,
    height: 902,
    alt: "Đại diện kỹ thuật InterData giới thiệu cấu trúc máy chủ cho sinh viên FPT Polytechnic",
  },
  team: {
    src: "/images/about/fit-team.webp",
    width: 1024,
    height: 768,
    alt: "Nhân sự InterData tại FIT Career Day của UEF ngày 16/03/2026",
  },
  datacenter: {
    src: "/images/about/vnpt-datacenter.webp",
    width: 1024,
    height: 768,
    alt: "Đại diện InterData và VNPT chụp ảnh tại IDC Điện Biên Phủ trong chương trình hợp tác năm 2024",
  },
} as const;

export const aboutValues = [
  {
    icon: "headphones",
    title: "Bắt đầu từ khách hàng",
    description:
      "Lợi ích và trải nghiệm của khách hàng là cơ sở để InterData lựa chọn cách làm và phát triển dịch vụ.",
  },
  {
    icon: "code",
    title: "Tìm cách làm tốt hơn",
    description:
      "Khuyến khích sáng tạo, học hỏi và cải tiến để công nghệ giải quyết những nhu cầu cụ thể.",
  },
  {
    icon: "shield",
    title: "Minh bạch trong hợp tác",
    description:
      "Giữ sự trung thực với khách hàng, đối tác và trách nhiệm với những điều đã cam kết.",
  },
];

export const aboutMilestones = [
  {
    date: "26/04/2024",
    isoDate: "2024-04-26",
    category: "KẾT NỐI GIÁO DỤC",
    title: "Hợp tác cùng Đại học Yersin Đà Lạt",
    description:
      "Ký kết MOU, kết nối hoạt động đào tạo với kinh nghiệm triển khai và mở ra cơ hội học hỏi, thực hành cho sinh viên công nghệ thông tin.",
    image: "/images/about/yersin-signing.webp",
    width: 1600,
    height: 1066,
    alt: "Đại diện Inter Group và Đại học Yersin Đà Lạt ký kết MOU ngày 26/04/2024",
    href: aboutSources.yersin,
  },
  {
    date: "27/05/2024",
    isoDate: "2024-05-27",
    category: "HỢP TÁC HẠ TẦNG",
    title: "Hợp tác chiến lược với VNPT",
    description:
      "InterData và VNPT VinaPhone TP.HCM ký kết hợp tác để cùng khai thác thế mạnh về hạ tầng datacenter và các dịch vụ công nghệ.",
    image: "/images/about/vnpt-signing.webp",
    width: 1280,
    height: 1012,
    alt: "Đại diện InterData và VNPT VinaPhone TP.HCM tại lễ ký kết hợp tác ngày 27/05/2024",
    href: aboutSources.vnpt,
  },
  {
    date: "16/03/2026",
    isoDate: "2026-03-16",
    category: "PHÁT TRIỂN NHÂN LỰC",
    title: "Đồng hành cùng UEF tại FIT Career Day",
    description:
      "Tham gia ngày hội việc làm và ký kết MOU với UEF, kết nối doanh nghiệp với sinh viên và những cơ hội nghề nghiệp trong ngành công nghệ.",
    image: "/images/about/uef-signing.webp",
    width: 1024,
    height: 683,
    alt: "Đại diện InterData và UEF tại lễ ký kết MOU trong FIT Career Day 2026",
    href: aboutSources.career,
  },
];
