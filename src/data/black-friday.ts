import vpsContent from "./vps-content.json";
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

// Presentation values supplied in the approved reference. Campaign codes and
// dates must come from Sales before enabling redemption or a live countdown.
export const blackFridaySlots = [
  { start: "10:00", end: "12:00" },
  { start: "14:00", end: "16:00" },
  { start: "20:00", end: "22:00" },
] as const;

export const blackFridayCoupons = [
  { service: "VPS", discounts: [71, 61, 51], href: "/vps-platinum/" },
  {
    service: "Cloud Server",
    discounts: [61, 51, 41],
    href: "/platinum-cloud-server/",
  },
] as const;

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
      "Chu kỳ 1 năm phù hợp khi nhu cầu còn có thể thay đổi hoặc bạn muốn phân bổ ngân sách theo năm. Cân nhắc 2–3 năm khi đã xác định nhu cầu sử dụng dài hạn. Hãy đổi tab để so sánh tổng tiền, mức giảm và quyền lợi của từng chu kỳ; lựa chọn nên dựa trên cả ngân sách thanh toán ban đầu lẫn thời gian dự kiến sử dụng.",
  },
  {
    question: "Tôi nhận và sử dụng mã ưu đãi như thế nào?",
    answer:
      "Ở Flash Sale, chọn khung giờ và dịch vụ rồi nhấn “Xem ưu đãi”. Ở Mã giảm giá, chọn thẻ VPS hoặc Cloud Server theo chu kỳ rồi nhấn “Nhận ưu đãi”. Gửi tên gói, chu kỳ và ưu đãi muốn áp dụng để InterData xác nhận mã cùng điều kiện sử dụng. Đối chiếu mức giảm và tổng tiền trên đơn hàng trước khi thanh toán.",
    action: { label: "Nhận tư vấn mã ưu đãi", href: "/lien-he/" },
  },
  {
    question:
      "Flash Sale có cộng dồn với mã giảm giá hoặc ưu đãi gia hạn không?",
    answer:
      "Điều kiện cộng dồn cần được xác nhận cho từng mã và dịch vụ. Hãy gửi mã ưu đãi, tên gói, chu kỳ và mã dịch vụ nếu có để InterData đối chiếu mức ưu đãi cuối cùng. Không cộng các tỷ lệ giảm trên trang với nhau để tự tính giá; kiểm tra số tiền của đơn hàng đã được xác nhận trước khi thanh toán.",
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
      "Best Plans hiển thị quyền lợi “Tặng thêm 1 năm” khi chọn chu kỳ 3 năm; chu kỳ 1 năm và 2 năm không hiển thị quyền lợi này. Trước khi đăng ký, hãy xác nhận gói đủ điều kiện, cách ghi nhận thời gian tặng và ngày hết hạn dịch vụ. Tổng tiền hiển thị vẫn là số tiền của chu kỳ 3 năm đang chọn.",
  },
  {
    question: "Cần chuẩn bị gì khi muốn chuyển dữ liệu hoặc nâng cấp gói?",
    answer:
      "Chuẩn bị thông tin hệ điều hành, ứng dụng hoặc cơ sở dữ liệu, dung lượng dữ liệu, tài nguyên hiện tại và thời điểm muốn chuyển. Nếu đã dùng dịch vụ, gửi kèm mã dịch vụ. Thống nhất phạm vi hỗ trợ, chi phí và thời gian gián đoạn dự kiến trước khi thực hiện; đồng thời giữ một bản sao lưu riêng để có phương án khôi phục.",
    action: { label: "Trao đổi nhu cầu với InterData", href: "/lien-he/" },
  },
];
