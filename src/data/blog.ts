export type BlogCategory = {
  id: number;
  slug: string;
  name: string;
  count: number;
  parent: number;
};
export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  image: string | null;
  imageAlt: string;
  publishedAt: string;
  modifiedAt: string;
  author: string;
  authorUrl?: string;
  categories: BlogCategory[];
};
export type BlogListing = {
  posts: BlogPost[];
  total: number;
  pages: number;
  status: "ready" | "unavailable";
};

// Editorial selection in display order; titles and images stay sourced from CMS.
export const popularGuideSlugs = [
  "cach-dang-nhap-vps-tren-may-tinh",
  "cach-dang-nhap-vps-tren-dien-thoai",
  "doi-mat-khau-vps",
  "cai-lai-he-dieu-hanh-cho-vps",
  "nguyen-nhan-va-khac-phuc-vps-full-tai-nguyen",
  "them-file-iso-len-vps",
  "bao-mat-vps-linux",
  "dung-vnc-viewer-de-dieu-khien-vps-windows",
] as const;

export const blogSections = [
  {
    id: "popular",
    title: "Hướng dẫn phổ biến",
    description:
      "Các hướng dẫn thường dùng để đăng nhập, quản trị và bảo mật VPS.",
    label: "HỌC & THỰC HÀNH",
    category: null,
  },
  {
    id: "news",
    title: "Tin tức – Sự kiện",
    description: "Những chuyển động mới từ InterData và thế giới công nghệ.",
    label: "KẾT NỐI & CẬP NHẬT",
    category: "su-kien",
  },
  {
    id: "promotions",
    title: "Tin Khuyến Mãi",
    description:
      "Cập nhật các chương trình ưu đãi và lựa chọn hạ tầng phù hợp.",
    label: "ƯU ĐÃI TỪ INTERDATA",
    category: "khuyen-mai",
  },
  {
    id: "careers",
    title: "Tin tuyển dụng",
    description: "Khám phá cơ hội nghề nghiệp và cùng InterData phát triển.",
    label: "ĐỒNG HÀNH & PHÁT TRIỂN",
    category: "tuyen-dung",
  },
] as const;
