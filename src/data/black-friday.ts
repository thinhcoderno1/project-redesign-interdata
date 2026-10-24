import vpsContent from "./vps-content.json";
import { links } from "./content";
import type { FlashSaleSchedule } from "@/lib/flash-sale";
import {
  productSpecs,
  type BillingCycle,
  type VpsProduct,
} from "./vps-pricing";

// Reuse the original Inter Platinum prices already retained in the VPS source.
const originalPrices: Partial<
  Record<string, Partial<Record<BillingCycle, number>>>
> = vpsContent.hotDeals.originalPrices;

export function getBlackFridaySavings(
  product: VpsProduct,
  cycle: BillingCycle,
) {
  const originalPrice =
    originalPrices[product.name.trim().toUpperCase()]?.[cycle];
  const price = product.pricing.VND[cycle];
  const currentPrice = Number(price);
  if (
    product.gid !== 100 ||
    typeof originalPrice !== "number" ||
    !Number.isFinite(originalPrice) ||
    originalPrice <= 0 ||
    typeof price !== "string" ||
    !price.trim() ||
    !Number.isFinite(currentPrice) ||
    currentPrice < 0 ||
    currentPrice >= originalPrice
  )
    return null;

  return {
    originalPrice,
    // Round down so the displayed whole percentage never overstates savings.
    percent: Math.floor(((originalPrice - currentPrice) / originalPrice) * 100),
  };
}

export function getBlackFridayUpgrade(
  product: VpsProduct,
  previous: VpsProduct | undefined,
  cycle: BillingCycle,
) {
  const months = { annually: 12, biennially: 24, triennially: 36 }[
    cycle as "annually" | "biennially" | "triennially"
  ];
  const plan = product.name.trim().match(/^INTER PLATINUM ([123])$/i);
  const previousPlan = previous?.name.trim().match(/^INTER PLATINUM ([123])$/i);
  if (
    !previous ||
    product.gid !== 100 ||
    previous.gid !== 100 ||
    !months ||
    !plan ||
    !previousPlan ||
    Number(plan[1]) !== Number(previousPlan[1]) + 1
  )
    return null;

  const price = product.pricing.VND[cycle];
  const previousPrice = previous.pricing.VND[cycle];
  if (
    typeof price !== "string" ||
    !price.trim() ||
    typeof previousPrice !== "string" ||
    !previousPrice.trim() ||
    !Number.isFinite(Number(price)) ||
    !Number.isFinite(Number(previousPrice)) ||
    Number(previousPrice) < 0 ||
    Number(price) <= Number(previousPrice)
  )
    return null;

  const specs = productSpecs(product, true);
  const previousSpecs = productSpecs(previous, true);
  const definitions = [
    { key: "cpu", pattern: /^(\d+(?:\.\d+)?)\s+vCore$/i, unit: "vCore" },
    { key: "ram", pattern: /^(\d+(?:\.\d+)?)\s+GB RAM$/i, unit: "GB RAM" },
    {
      key: "storage",
      pattern: /^(\d+(?:\.\d+)?)\s+GB SSD NVMe$/i,
      unit: "GB SSD NVMe",
    },
  ] as const;
  const resources = definitions.map(({ key, pattern, unit }) => {
    const read = (lines: string[]) => {
      const matches = lines.flatMap((line) => {
        const match = line.match(pattern);
        return match ? [Number(match[1])] : [];
      });
      return matches.length === 1 ? matches[0] : NaN;
    };
    const current = read(specs);
    const before = read(previousSpecs);
    return { key, unit, value: current - before, current, before };
  });
  if (
    resources.some(
      ({ current, before, value }) =>
        !Number.isFinite(current) ||
        !Number.isFinite(before) ||
        current <= 0 ||
        before <= 0 ||
        value < 0,
    )
  )
    return null;
  const increases = resources.filter(({ value }) => value > 0);
  if (!increases.length) return null;
  const difference = Number(price) - Number(previousPrice);
  return {
    previousPlan: Number(previousPlan[1]),
    months,
    difference,
    // The comparison is a monthly equivalent, never a monthly checkout price.
    // Round up to avoid understating a fractional-dong monthly difference.
    monthlyEquivalent: Math.ceil(difference / months),
    resources: increases,
  };
}

// Preview keeps the section visible and the clock at 00:00:00:00.
// Set all dates and switch to "scheduled" when the official schedule is ready.
// Scheduled mode shows the section from visibleFrom until endsAt; "hidden" hides it.
export const blackFridayFlashSale: FlashSaleSchedule = {
  mode: "preview",
  visibleFrom: null,
  startsAt: null,
  endsAt: null,
};

export const blackFridayCoupons = [
  { service: "VPS", discounts: [71, 61, 51], href: links.vps },
  {
    service: "Cloud Server",
    discounts: [61, 51, 41],
    href: links.cloud,
  },
] as const;

export const blackFridayCouponPlaceholder = "BF-XXXX";

export const blackFridayCouponCondition =
  "Mã không áp dụng đồng thời hoặc cộng dồn với các chương trình khuyến mãi khác.";

export const blackFridayFaqs: {
  question: string;
  answer: string;
  action?: { label: string; href: string };
}[] = [
  {
    question: "Nên chọn Plan 1, Plan 2 hay Plan 3?",
    answer:
      "Hãy đối chiếu mức dùng CPU, RAM và dung lượng lưu trữ thực tế, đồng thời chừa tài nguyên cho tăng trưởng. Plan 1 phù hợp với website hoặc ứng dụng nhỏ; cân nhắc Plan 2 hoặc Plan 3 khi chạy thêm dịch vụ, cần nhiều RAM hoặc xử lý đồng thời nhiều tác vụ. Khối nâng cấp ở Best Plans cho biết tài nguyên tăng thêm và khoản chênh lệch giữa hai gói liền nhau.",
    action: { label: "So sánh các Best Plans", href: "#best-plans" },
  },
  {
    question:
      "Giá trong Best Plans là giá mỗi tháng hay tổng tiền theo chu kỳ?",
    answer:
      "Số tiền chính trên mỗi gói là tổng tiền cho chu kỳ 12, 24 hoặc 36 tháng đang chọn. Dòng “+…đ/tháng” trong khối nâng cấp là khoản chênh lệch giữa hai gói quy đổi theo tháng, không phải số tiền thanh toán hằng tháng hay báo giá nâng cấp một dịch vụ đang dùng. Kiểm tra tổng tiền và chu kỳ trên trang đăng ký trước khi thanh toán.",
  },
  {
    question: "Nên đăng ký 1, 2 hay 3 năm để tối ưu chi phí?",
    answer:
      "Chu kỳ 1 năm phù hợp khi bạn muốn linh hoạt ngân sách hoặc nhu cầu sử dụng còn có thể thay đổi. Chu kỳ 2 năm là lựa chọn cân bằng nếu bạn đã có kế hoạch sử dụng lâu hơn nhưng chưa muốn thanh toán cho 3 năm. Nếu nhu cầu đã ổn định và ngân sách cho phép, InterData khuyên bạn chọn chu kỳ 3 năm để được tặng thêm 1 năm sử dụng. Bạn có tổng cộng 4 năm sử dụng với chi phí của chu kỳ 3 năm, giúp giảm chi phí bình quân theo thời gian và lùi thời điểm cần gia hạn. Đây là lựa chọn đáng ưu tiên cho website, ứng dụng hoặc hệ thống cần vận hành lâu dài.",
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
    question: "Ưu đãi “Tặng thêm 1 năm” được áp dụng như thế nào?",
    answer:
      "Ưu đãi “Tặng thêm 1 năm” chỉ áp dụng cho các gói đăng ký chu kỳ 3 năm.",
  },
  {
    question: "Cần chuẩn bị gì khi muốn chuyển dữ liệu hoặc nâng cấp gói?",
    answer:
      "Chuẩn bị thông tin hệ điều hành, ứng dụng hoặc cơ sở dữ liệu, dung lượng dữ liệu, tài nguyên hiện tại và thời điểm muốn chuyển. Nếu đã dùng dịch vụ, gửi kèm mã dịch vụ. Thống nhất phạm vi hỗ trợ, chi phí và thời gian gián đoạn dự kiến trước khi thực hiện; đồng thời giữ một bản sao lưu riêng để có phương án khôi phục.",
    action: { label: "Trao đổi nhu cầu với InterData", href: "/lien-he/" },
  },
];
