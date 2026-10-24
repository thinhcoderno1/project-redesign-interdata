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
export const blogSections = [
  {
    id: "popular",
    title: "Hướng dẫn phổ biến",
    description: "Bắt đầu từ những hướng dẫn được nhiều người quan tâm.",
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
