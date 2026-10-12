import type { BillingCycle } from "./vps-pricing";

export const amdBillingCycles: {
  key: BillingCycle;
  label: string;
  months: number;
}[] = [
  { key: "monthly", label: "1 tháng", months: 1 },
  { key: "quarterly", label: "3 tháng", months: 3 },
  { key: "semiannually", label: "6 tháng", months: 6 },
  { key: "annually", label: "12 tháng", months: 12 },
  { key: "biennially", label: "24 tháng", months: 24 },
  { key: "triennially", label: "36 tháng", months: 36 },
];

export const amdFaq = [
  {
    question: "VPS AMD là gì?",
    answer:
      "VPS AMD là máy chủ ảo chạy trên nền tảng CPU AMD. Bạn sử dụng vCPU, RAM và dung lượng lưu trữ theo gói đã chọn, với quyền quản trị riêng để cài đặt website, ứng dụng hoặc môi trường phát triển.",
  },
  {
    question: "Mỗi VPS có được dùng toàn bộ 64 nhân của EPYC 7763 không?",
    answer:
      "Không. 64 nhân, 128 luồng là thông số của một CPU AMD EPYC 7763 trên máy chủ vật lý. Số vCPU và dung lượng RAM cấp cho VPS được ghi riêng trong từng gói ở bảng giá. Model CPU cụ thể của gói cần được xác nhận khi đăng ký.",
  },
  {
    question: "VPS AMD hỗ trợ hệ điều hành nào?",
    answer:
      "Bạn có thể lựa chọn các bản phân phối Linux như Ubuntu và Debian. Danh sách hệ điều hành và phiên bản có sẵn được xác nhận khi đăng ký; nếu cần phiên bản hoặc phần mềm cụ thể, hãy trao đổi với đội ngũ kỹ thuật trước.",
  },
  {
    question: "Tôi có thể nâng cấp cấu hình khi ứng dụng tăng tải không?",
    answer:
      "Bạn có thể trao đổi với InterData để nâng cấp vCPU, RAM hoặc lưu trữ theo nhu cầu và khả năng cung cấp. Hãy sao lưu trước khi thay đổi và xác nhận chi phí, thời gian thực hiện cũng như khả năng phải khởi động lại VPS.",
  },
  {
    question: "Giá theo chu kỳ là giá mỗi tháng hay tổng tiền phải trả?",
    answer:
      "Bảng giá hiển thị tổng tiền của chu kỳ bạn chọn. Ví dụ, chọn 12 tháng thì số tiền hiển thị là cho cả 12 tháng. Hãy kiểm tra lại hóa đơn, thuế, tùy chọn bổ sung và tình trạng cung cấp trên trang đăng ký trước khi thanh toán.",
  },
  {
    question: "Tôi có quyền tự cài đặt phần mềm trên VPS không?",
    answer:
      "Có. Với quyền root, bạn có thể cài đặt và cấu hình phần mềm phù hợp với hệ điều hành và điều khoản dịch vụ. Bạn cũng cần quản lý tài khoản truy cập, cập nhật bảo mật và sao lưu dữ liệu ứng dụng.",
  },
  {
    question: "Tôi nhận thông tin VPS và yêu cầu hỗ trợ ở đâu?",
    answer:
      "Thông tin quản trị được gửi qua email sau khi đăng ký, thanh toán và hoàn tất khởi tạo dịch vụ. Khi cần hỗ trợ, bạn có thể gửi ticket qua cổng khách hàng InterData. Thời gian khởi tạo và phạm vi hỗ trợ cần được xác nhận theo đơn hàng.",
  },
  {
    question: "Cài lại hệ điều hành có làm mất dữ liệu không?",
    answer:
      "Có. Cài lại hệ điều hành có thể xóa dữ liệu hiện có trên VPS. Hãy sao lưu dữ liệu và cấu hình ra nơi lưu trữ khác, kiểm tra khả năng khôi phục rồi mới thực hiện.",
  },
];
