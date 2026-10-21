import type { BillingCycle, VpsProduct } from "./vps-pricing";

export type DedicatedProduct = VpsProduct & {
  available: boolean;
  setupFees: Partial<Record<BillingCycle, string>>;
};
export const dedicatedPricingGid = 96;
// Original cycle totals from D:/InterData/canhme/app/components/data.ts,
// INTER DEDI POWER SERIES 2026 (gid 96). Selling prices still come from the API.
export const dedicatedOriginalPrices: Record<
  number,
  Partial<Record<BillingCycle, number>>
> = {
  517: {
    monthly: 9343750,
    quarterly: 26910000,
    semiannually: 51577500,
    annually: 98670000,
    biennially: 179400000,
    triennially: 269100000,
  },
  518: {
    monthly: 11437500,
    quarterly: 27164063,
    semiannually: 32940000,
    annually: 120780000,
    biennially: 219600000,
    triennially: 329400000,
  },
  519: {
    monthly: 18375000,
    quarterly: 52920000,
    semiannually: 101430000,
    annually: 194040000,
    biennially: 352800000,
    triennially: 529200000,
  },
  520: {
    monthly: 28471875,
    quarterly: 81999000,
    semiannually: 157164750,
    annually: 300663000,
    biennially: 546660000,
    triennially: 819990000,
  },
};
export const dedicatedBillingCycles: {
  key: BillingCycle;
  label: string;
  months: number;
  setupKey: string;
}[] = [
  { key: "monthly", label: "1 tháng", months: 1, setupKey: "msetupfee" },
  { key: "quarterly", label: "3 tháng", months: 3, setupKey: "qsetupfee" },
  { key: "semiannually", label: "6 tháng", months: 6, setupKey: "ssetupfee" },
  { key: "annually", label: "12 tháng", months: 12, setupKey: "asetupfee" },
  { key: "biennially", label: "24 tháng", months: 24, setupKey: "bsetupfee" },
  { key: "triennially", label: "36 tháng", months: 36, setupKey: "tsetupfee" },
];
// Source: https://interdata.vn/vietnam-dedicated-server, checked 2026-10-21.
export const dedicatedFaq = [
  {
    question: "Tôi nên chọn gói máy chủ nào nếu chưa rõ cấu hình cần thuê?",
    answer:
      "Nếu chưa rõ cấu hình, Quý khách nên gửi nhu cầu sử dụng như loại website hoặc ứng dụng, lượng truy cập, dung lượng dữ liệu, hệ điều hành, yêu cầu băng thông và ngân sách dự kiến. InterData sẽ tư vấn cấu hình phù hợp để tránh thuê server quá yếu hoặc dư tài nguyên không cần thiết.",
  },
  {
    question: "Giá thuê máy chủ trên bảng giá đã bao gồm những gì?",
    answer:
      "Giá thuê máy chủ phụ thuộc vào từng gói cấu hình và chu kỳ thanh toán. Thông thường gói dịch vụ bao gồm phần cứng máy chủ, tài nguyên theo cấu hình, IP được cấp kèm, kết nối mạng và hỗ trợ kỹ thuật trong phạm vi hạ tầng. Các yêu cầu mở rộng như thêm IP, băng thông, ổ cứng, RAID hoặc quản trị chuyên sâu cần được xác nhận riêng.",
  },
  {
    question: "Đăng ký chu kỳ dài có được giá tốt hơn không?",
    answer:
      "Có. Một số gói Dedicated Server có mức giá tốt hơn khi chọn chu kỳ thanh toán dài hạn hoặc đang trong chương trình ưu đãi. Quý khách nên kiểm tra bảng giá hiện tại và trao đổi với bộ phận kinh doanh để xác nhận cấu hình còn sẵn, thời hạn ưu đãi và tổng chi phí trước khi đăng ký.",
  },
  {
    question: "Sau khi thanh toán bao lâu tôi nhận được máy chủ?",
    answer:
      "Thời gian triển khai thường trong vòng 24 giờ sau khi hoàn tất đăng ký và thanh toán, tùy tình trạng sẵn có của cấu hình. Nếu Quý khách cần tùy chỉnh RAID, ổ cứng, IP bổ sung, hệ điều hành hoặc cấu hình đặc biệt, thời gian bàn giao có thể cần xác nhận thêm.",
  },
  {
    question: "InterData có hỗ trợ cài đặt hệ điều hành ban đầu không?",
    answer:
      "Có. InterData hỗ trợ cài đặt hệ điều hành ban đầu trong phạm vi kỹ thuật phù hợp. Các hệ điều hành phổ biến gồm Linux, Ubuntu, Debian, AlmaLinux, Rocky Linux,... Khách hàng có thể yêu cầu cài đặt phiên bản phù hợp khi đăng ký dịch vụ.",
  },
  {
    question: "Tôi có được cấp quyền root hoặc quyền quản trị máy chủ không?",
    answer:
      "Có. Khách hàng được cấp quyền quản trị phù hợp với máy chủ để chủ động cài đặt, cấu hình và vận hành hệ thống. Sau khi nhận thông tin truy cập, Quý khách cần tự bảo mật mật khẩu, khóa truy cập, dữ liệu, mã nguồn và phần mềm đang chạy trên server.",
  },
  {
    question: "Gói thuê máy chủ có sẵn IP riêng không?",
    answer:
      "Có. Máy chủ tại InterData được cấp IPv4 riêng biệt theo chính sách của từng gói. Nếu cần thêm IP cho nhiều website, email, ứng dụng riêng hoặc phân tách môi trường vận hành, Quý khách có thể liên hệ bộ phận kinh doanh để được tư vấn.",
  },
  {
    question:
      "Tôi có thể nâng cấp CPU, RAM, ổ cứng hoặc băng thông sau khi thuê không?",
    answer:
      "Có thể nâng cấp hoặc điều chỉnh theo nhu cầu và khả năng đáp ứng của hạ tầng tại thời điểm yêu cầu. Một số thay đổi phần cứng có thể cần thời gian thao tác kỹ thuật hoặc lịch bảo trì ngắn, vì vậy Quý khách nên trao đổi trước để hạn chế ảnh hưởng đến dịch vụ.",
  },
  {
    question: "InterData có hỗ trợ RAID khi thuê máy chủ không?",
    answer:
      "Có. InterData hỗ trợ các cấu hình RAID như RAID 0, RAID 1, RAID 5 và RAID 10 theo nhu cầu vận hành. RAID nên được chọn dựa trên mục tiêu thực tế: ưu tiên tốc độ, dự phòng dữ liệu hoặc cân bằng giữa hiệu năng và an toàn.",
  },
  {
    question:
      "Tôi có được hỗ trợ chuyển dữ liệu từ nhà cung cấp cũ sang InterData không?",
    answer:
      "Có. InterData có thể hỗ trợ chuyển dữ liệu trong phạm vi kỹ thuật phù hợp. Trước khi chuyển, Quý khách nên chuẩn bị backup, thông tin cấu hình hệ thống cũ, tài khoản truy cập cần thiết và chọn thời điểm ít truy cập để giảm rủi ro gián đoạn.",
  },
  {
    question: "Dịch vụ có hỗ trợ kỹ thuật 24/7 không?",
    answer:
      "Có. InterData tiếp nhận hỗ trợ kỹ thuật 24/7 qua hệ thống ticket, hotline và email trong phạm vi trách nhiệm của nhà cung cấp hạ tầng. Các vấn đề liên quan đến mã nguồn, database, ứng dụng riêng hoặc quản trị chuyên sâu cần được thống nhất phạm vi hỗ trợ trước.",
  },
  {
    question: "Tôi có thể thuê thêm dịch vụ quản trị máy chủ không?",
    answer:
      "Có. Nếu doanh nghiệp không có đội kỹ thuật nội bộ, Quý khách có thể trao đổi thêm về dịch vụ quản trị máy chủ. Phạm vi có thể gồm cài đặt, tối ưu web server, cấu hình bảo mật, giám sát, backup hoặc xử lý sự cố, tùy nhu cầu thực tế.",
  },
  {
    question: "Dịch vụ thuê máy chủ có chính sách hoàn tiền không?",
    answer:
      "Chính sách hoàn tiền phụ thuộc vào điều kiện áp dụng của từng dịch vụ và trường hợp cụ thể. Yêu cầu hoàn tiền cần được gửi qua ticket kèm thông tin dịch vụ, lý do và bằng chứng liên quan nếu có. InterData sẽ tiếp nhận, xác nhận với bộ phận liên quan và xử lý theo quy định hiện hành.",
  },
  {
    question: "Nếu máy chủ gặp sự cố, tôi cần liên hệ kênh nào?",
    answer:
      "Quý khách nên gửi ticket trên hệ thống quản lý dịch vụ để InterData có đầy đủ thông tin xử lý. Ngoài ra, Quý khách có thể liên hệ hotline hoặc email hỗ trợ. Khi gửi yêu cầu, nên cung cấp mã dịch vụ, thời điểm phát sinh lỗi, mô tả hiện tượng và hình ảnh hoặc log nếu có.",
  },
  {
    question: "Những mục đích sử dụng nào không được hỗ trợ?",
    answer:
      "Theo điều khoản sử dụng, dịch vụ không hỗ trợ các mục đích vận hành server game, proxy hoặc VPN dưới mọi hình thức. Khách hàng cũng không được sử dụng máy chủ cho spam email, phishing, malware, DDoS, khai thác tiền điện tử hoặc các hoạt động vi phạm pháp luật.",
  },
  {
    question: "Trước khi đặt mua máy chủ tôi cần chuẩn bị thông tin gì?",
    answer:
      "Quý khách nên chuẩn bị mục đích sử dụng, website hoặc ứng dụng cần chạy, hệ điều hành mong muốn, dung lượng dữ liệu, mức traffic, yêu cầu IP, băng thông, backup, thời gian cần bàn giao và ngân sách dự kiến. Các thông tin này giúp InterData tư vấn cấu hình nhanh và sát nhu cầu hơn.",
  },
];
