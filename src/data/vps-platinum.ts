import type { BillingCycle, VpsProduct } from "./vps-pricing";

export const platinumGroups = [
  { gid: 29, label: "VPS PLATINUM FPT" },
  { gid: 101, label: "VPS PLATINUM VIETTEL" },
  { gid: 100, label: "Hot Deals · Inter Platinum" },
] as const;
export type PlatinumGid = (typeof platinumGroups)[number]["gid"];
export type PlatinumPrices = Record<PlatinumGid, VpsProduct[] | null>;
export const platinumBillingCycles: { key: BillingCycle; label: string }[] = [
  { key: "monthly", label: "1 tháng" },
  { key: "quarterly", label: "3 tháng" },
  { key: "semiannually", label: "6 tháng" },
  { key: "annually", label: "12 tháng" },
  { key: "biennially", label: "24 tháng" },
  { key: "triennially", label: "36 tháng" },
];

export const platinumFaq = [
  {
    question: "VPS PLATINUM là gì?",
    answer:
      "VPS PLATINUM là máy chủ ảo sử dụng nền tảng CPU Intel Xeon Platinum, được ảo hóa bằng KVM. Mỗi gói có vCPU, RAM, dung lượng lưu trữ và IPv4 riêng, cùng quyền quản trị để triển khai website, ứng dụng hoặc hệ thống nội bộ.",
  },
  {
    question: "Nên chọn VPS PLATINUM FPT hay Viettel?",
    answer:
      "Hãy so sánh cấu hình, cổng mạng, chi phí theo chu kỳ và vị trí triển khai của từng gói. Nếu người dùng tập trung ở một khu vực hoặc sử dụng một nhà mạng nhất định, bạn nên đề nghị kiểm tra kết nối thực tế trước khi lựa chọn. Bảng giá có hai lựa chọn FPT và Viettel để đối chiếu.",
  },
  {
    question: "Hot Deals Inter Platinum có thanh toán theo tháng không?",
    answer:
      "Chỉ các chu kỳ có giá được hệ thống cung cấp mới xuất hiện trong bảng giá. Các gói Hot Deals có thể chỉ áp dụng chu kỳ dài hạn; số tiền hiển thị là tổng tiền của chu kỳ đã chọn. Kiểm tra điều kiện ưu đãi và giá gia hạn tại trang đăng ký trước khi thanh toán.",
  },
  {
    question:
      "VPS có dùng toàn bộ tài nguyên của CPU Intel Xeon Platinum không?",
    answer:
      "Không. Intel Xeon Platinum là nền tảng CPU của máy chủ vật lý. Số vCPU, RAM và dung lượng cấp cho VPS được ghi rõ trong từng gói. Model và thế hệ CPU thực tế cần được xác nhận theo gói, không suy ra từ tên dòng dịch vụ.",
  },
  {
    question: "VPS PLATINUM hỗ trợ hệ điều hành và phần mềm nào?",
    answer:
      "Bạn có thể chọn các bản phân phối Linux theo danh sách template hiện có. Với quyền root, bạn có thể cài runtime, web server, database hoặc công cụ automation phù hợp. Hãy xác nhận trước nếu cần phiên bản cụ thể, Windows hoặc phần mềm có bản quyền; giấy phép bổ sung có thể tính phí riêng.",
  },
  {
    question: "Tôi có thể nâng cấp và giữ lại dữ liệu không?",
    answer:
      "Bạn có thể yêu cầu nâng cấp vCPU, RAM hoặc lưu trữ theo khả năng cung cấp. Trước khi thay đổi, hãy xác nhận phương án chuyển dữ liệu, chi phí và thời gian gián đoạn dự kiến. Luôn tạo bản sao lưu độc lập và kiểm tra khả năng khôi phục.",
  },
  {
    question:
      "Unlimited Bandwidth có nghĩa là tốc độ mạng không giới hạn không?",
    answer:
      "Không. Unlimited Bandwidth nói đến dung lượng truyền tải theo tháng. Tốc độ kết nối vẫn phụ thuộc network port của gói, tuyến mạng và điều kiện sử dụng thực tế. Đối chiếu riêng thông số cổng mạng trong bảng cấu hình.",
  },
  {
    question: "Backup và hỗ trợ kỹ thuật được thực hiện như thế nào?",
    answer:
      "InterData tiếp nhận yêu cầu qua cổng khách hàng và hỗ trợ kỹ thuật 24/7. Hãy xác nhận lịch backup, số bản giữ lại, quy trình khôi phục và phạm vi hỗ trợ của gói trước khi triển khai. Với dữ liệu quan trọng, cần thêm bản sao lưu ngoài VPS; cài lại hệ điều hành có thể xóa dữ liệu hiện có.",
  },
];
