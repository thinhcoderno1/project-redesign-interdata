export const resourceTopics = [
  {
    id: "news",
    label: "Tin Tức - Sự Kiện",
    slug: "su-kien",
    href: "https://interdata.vn/blog/su-kien/",
    linkLabel: "Xem tất cả tin tức",
  },
  {
    id: "blog",
    label: "Blog",
    slug: null,
    href: "https://interdata.vn/blog/",
    linkLabel: "Khám phá blog",
  },
  {
    id: "promotion",
    label: "Khuyến Mãi",
    slug: "khuyen-mai",
    href: "https://interdata.vn/blog/khuyen-mai/",
    linkLabel: "Xem tất cả khuyến mãi",
  },
  {
    id: "careers",
    label: "Tuyển Dụng",
    slug: "tuyen-dung",
    href: "https://interdata.vn/blog/tuyen-dung/",
    linkLabel: "Xem tất cả tin tuyển dụng",
  },
] as const;

export type ResourceTopic = (typeof resourceTopics)[number];

export type ResourceArticle = {
  id: number;
  title: string;
  excerpt: string;
  href: string;
  image: string | null;
  category: string;
  publishedAt: string;
  dateLabel: string;
};

export type ResourceFeed = {
  topic: ResourceTopic;
  articles: ResourceArticle[];
  status: "ready" | "unavailable";
};
