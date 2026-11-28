import { links } from "./content";
import type { BlackFridayCycle } from "@/lib/black-friday-pricing";
import type { FlashSaleSchedule } from "@/lib/flash-sale";

export const blackFridayPlatinumBestPlans = {
  title: "VPS Platinum Black Friday",
  subtitle: "Hiệu năng mạnh mẽ cho mọi dự án",
  featuredPid: 572,
  featuredLabel: "Bán chạy nhất",
  cpu: "Intel® Platinum Gen 2",
  storage: "SSD NVMe U.2 Gen 4",
  chip: {
    src: "/images/black-friday/intel-xeon-platinum-8000-angled.webp",
    width: 256,
    height: 256,
  },
  cycles: [
    { key: "annually", label: "1 năm", badgeDiscount: 60 },
    { key: "biennially", label: "2 năm", badgeDiscount: 65 },
    { key: "triennially", label: "3 năm", badgeDiscount: 70 },
  ] as const satisfies readonly {
    key: BlackFridayCycle;
    label: string;
    badgeDiscount: number;
  }[],
} as const;

export const blackFridayAmdBestPlans = {
  title: "VPS AMD Black Friday",
  subtitle: "Sức mạnh vượt trội cân mọi tác vụ.",
  featuredPid: 588,
  featuredLabel: "Đăng ký nhiều",
  cpu: "AMD EPYC Gen 2",
  storage: "SSD NVMe U.2 Gen 4",
  chip: {
    src: "/images/vps-amd/epyc-chip.webp",
    width: 1920,
    height: 1491,
  },
} as const;

// Retain renewal copy and the additional offer for a future campaign update.
export const blackFridayRenewal = {
  showDescriptions: false,
  showExtraDiscount: false,
};

// Preview keeps the section visible; Flash Sale releases are timed on the server.
// Set all dates and switch to "scheduled" when the official schedule is ready.
// Scheduled mode shows the section from visibleFrom until endsAt; "hidden" hides it.
export const blackFridayFlashSale: FlashSaleSchedule = {
  // The 15:00 round has ended. Count down to November 27 at 20:00 VN.
  mode: "preview",
  visibleFrom: null,
  startsAt: "2026-11-27T20:00:00+07:00",
  endsAt: null,
};

export const blackFridayFlashSaleUpcomingDates: readonly string[] = [];

export const blackFridayCoupons = [
  {
    service: "VPS",
    offers: [
      { months: 36, discount: 55 },
      { months: 24, discount: 50 },
      { months: 12, discount: 45 },
    ],
    href: links.vps,
  },
  {
    service: "Cloud Server",
    offers: [
      { months: 36, discount: 40 },
      { months: 24, discount: 35 },
      { months: 12, discount: 30 },
    ],
    href: links.cloud,
  },
] as const;

export type BlackFridayCouponGroup = {
  service: (typeof blackFridayCoupons)[number]["service"];
  href: string;
  offers: {
    months: 12 | 24 | 36;
    discount: number;
    code: string;
  }[];
};

export const blackFridayDiscountCouponPlaceholder = "BF26-XXXXX";

export const blackFridayCouponConditions = [
  "Mã ONE TIME: Chỉ áp dụng cho lần thanh toán đầu tiên. Để hưởng ưu đãi dài hạn, Quý Khách nên cân nhắc đăng ký chu kỳ phù hợp.",
  "Mã không áp dụng đồng thời / cộng dồn với các chương trình khuyến mãi khác.",
  "Chương trình không áp dụng cho thanh toán qua tài khoản credit tại InterData.",
] as const;

export const blackFridayCouponCondition =
  "Mã không áp dụng đồng thời hoặc cộng dồn với các chương trình khuyến mãi khác.";

export const blackFridayFlashSaleConditions = [
  "Mã ONE TIME: Chỉ áp dụng cho lần thanh toán đầu tiên. Để hưởng ưu đãi dài hạn, Quý Khách nên cân nhắc đăng ký chu kỳ phù hợp.",
  "Ưu tiên những khách hàng thanh toán nhanh và sớm nhất.",
  "Các hóa đơn không được thanh toán sau 15 phút kể từ khi khởi tạo sẽ bị xóa.",
  "Mã không áp dụng đồng thời / cộng dồn với các chương trình khuyến mãi khác.",
  "Chương trình không áp dụng cho thanh toán qua tài khoản credit tại InterData.",
] as const;

export const blackFridayFaqs: {
  question: string;
  answer: string;
  action?: { label: string; href: string };
}[] = [
  {
    question: "Nên chọn gói VPS Black Friday nào?",
    answer:
      "Hãy đối chiếu mức dùng CPU, RAM và dung lượng lưu trữ thực tế, đồng thời chừa tài nguyên cho tăng trưởng. So sánh cấu hình của các gói đang mở bán để chọn theo nhu cầu sử dụng.",
    action: { label: "So sánh các Best Plans", href: "#best-plans" },
  },
  {
    question:
      "Giá trong Best Plans là giá mỗi tháng hay tổng tiền theo chu kỳ?",
    answer:
      "Số tiền chính trên mỗi gói là tổng tiền cho chu kỳ 1, 2 hoặc 3 năm đang chọn.",
  },
  {
    question: "Nên đăng ký 1, 2 hay 3 năm để tối ưu chi phí?",
    answer:
      "Chu kỳ 1 năm giúp bạn linh hoạt ngân sách khi nhu cầu còn thay đổi. Chọn từng chu kỳ để so sánh tổng tiền và quyền lợi trước khi đăng ký.",
  },
  {
    question: "Tôi nhận và sử dụng mã ưu đãi như thế nào?",
    answer:
      "Mã ưu đãi được hiển thị trực tiếp trong các khung mã tại Flash Sale và Mã giảm giá. Chọn đúng dịch vụ, thời gian mở bán và chu kỳ áp dụng, nhấn “Nhận ưu đãi” để xem các gói dịch vụ, sau đó nhập mã ở bước thanh toán. Đối chiếu mức giảm và tổng tiền trên đơn hàng trước khi thanh toán.",
    action: { label: "Xem mã ưu đãi", href: "#ma-giam-gia" },
  },
  {
    question:
      "Flash Sale có cộng dồn với mã giảm giá hoặc ưu đãi gia hạn không?",
    answer: `Không. ${blackFridayCouponCondition} Vui lòng chọn một chương trình phù hợp và kiểm tra tổng tiền trên đơn hàng trước khi thanh toán.`,
  },
  {
    question: "Khách hàng đang sử dụng dịch vụ được hưởng ưu đãi nào?",
    answer:
      "Mục Ưu đãi gia hạn dành cho khách hàng hiện tại có các nhóm điều kiện riêng, liên quan đến ngày đăng ký, lịch sử khuyến mãi và gói mua qua Canh Me. Gửi mã dịch vụ để InterData đối chiếu nhóm phù hợp, giá gia hạn và quyền lợi áp dụng. Giá của gói đăng ký trong Best Plans không thay thế báo giá gia hạn cho dịch vụ đang dùng.",
    action: { label: "Xem ưu đãi gia hạn", href: "#gia-han" },
  },
  {
    question: "Xem ưu đãi khi đăng ký 3 năm ở đâu?",
    answer:
      "Chọn tab 3 năm tại Best Plans để xem quyền lợi áp dụng cho từng gói.",
  },
  {
    question: "Cần chuẩn bị gì khi muốn chuyển dữ liệu hoặc nâng cấp gói?",
    answer:
      "Chuẩn bị thông tin hệ điều hành, ứng dụng hoặc cơ sở dữ liệu, dung lượng dữ liệu, tài nguyên hiện tại và thời điểm muốn chuyển. Nếu đã dùng dịch vụ, gửi kèm mã dịch vụ. Thống nhất phạm vi hỗ trợ, chi phí và thời gian gián đoạn dự kiến trước khi thực hiện; đồng thời giữ một bản sao lưu riêng để có phương án khôi phục.",
    action: { label: "Trao đổi nhu cầu với InterData", href: "/lien-he/" },
  },
];
