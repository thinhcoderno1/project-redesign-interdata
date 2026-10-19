import type { BillingCycle } from "./vps-pricing";

export const goldPricingGid = 20;
export const goldBillingCycles: { key: BillingCycle; label: string }[] = [
  { key: "monthly", label: "1 tháng" },
  { key: "quarterly", label: "3 tháng" },
  { key: "semiannually", label: "6 tháng" },
  { key: "annually", label: "12 tháng" },
  { key: "biennially", label: "24 tháng" },
  { key: "triennially", label: "36 tháng" },
];

export const goldFaq = [
  {
    question: "VPS Gold là gì và phù hợp với nhu cầu nào?",
    answer:
      "VPS Gold là dịch vụ máy chủ ảo dùng nền tảng CPU Intel Xeon Gold, lưu trữ SSD NVMe và quyền quản trị riêng. Bạn có thể triển khai website, API, cơ sở dữ liệu hoặc công cụ self-host. Hãy chọn vCPU, RAM, lưu trữ và lưu lượng truyền tải theo tải thực tế của ứng dụng.",
  },
  {
    question: "Nên chọn gói VPS Gold HCM hay Hà Nội?",
    answer:
      "Ưu tiên vị trí gần người dùng chính và kiểm tra kết nối thực tế trước khi quyết định. Các gói có hậu tố HN thuộc lựa chọn Hà Nội; gói HCM và Hà Nội có thể khác giá hoặc dung lượng dù cùng số thứ tự Plan. Đối chiếu từng thẻ cấu hình, không suy ra cấu hình chỉ từ tên Plan.",
  },
  {
    question: "VPS Gold có kỳ thanh toán tháng không?",
    answer:
      "Bảng giá chỉ hiển thị các chu kỳ đang được hệ thống đăng ký cung cấp. Nếu kỳ tháng không xuất hiện, bạn có thể chọn kỳ 3 tháng hoặc các kỳ dài hơn đang có giá. Số tiền hiển thị là tổng tiền của chu kỳ đã chọn, không phải giá quy đổi theo tháng. Kiểm tra thêm thuế, tùy chọn và giá gia hạn tại trang đăng ký.",
  },
  {
    question: "VPS có được sử dụng toàn bộ CPU Intel Xeon Gold không?",
    answer:
      "Không. Intel Xeon Gold là dòng CPU của máy chủ vật lý; số vCPU, RAM và dung lượng cấp cho VPS được ghi riêng trong mỗi gói. Model và thế hệ CPU thực tế cần được xác nhận theo dịch vụ, không suy ra từ tên dòng Gold hoặc ảnh minh họa.",
  },
  {
    question: "Cổng mạng 1Gbps có đồng nghĩa với băng thông không giới hạn?",
    answer:
      "Không. Network port là thông số cổng kết nối, còn băng thông hàng tháng trong bảng giá là lưu lượng dữ liệu truyền tải của gói. Tốc độ sử dụng thực tế còn phụ thuộc tuyến mạng, máy đích và tải ứng dụng. Đối chiếu cả giới hạn lưu lượng lẫn cổng mạng khi chạy dịch vụ truyền nhiều dữ liệu.",
  },
  {
    question: "VPS Gold hỗ trợ hệ điều hành và phần mềm nào?",
    answer:
      "Chọn bản phân phối và phiên bản Linux theo danh sách template tại thời điểm đăng ký. Với quyền quản trị, bạn có thể cài web server, runtime, database hoặc công cụ automation tương thích. Xác nhận trước nếu cần Windows, panel hoặc phần mềm có bản quyền; giấy phép và công cài đặt có thể là tùy chọn riêng.",
  },
  {
    question: "Tôi có thể nâng cấp VPS Gold và giữ dữ liệu không?",
    answer:
      "Bạn có thể gửi yêu cầu nâng vCPU, RAM hoặc lưu trữ theo khả năng cung cấp. Trước khi thay đổi, hãy xác nhận giá, phương án chuyển dữ liệu và thời gian gián đoạn dự kiến. Luôn có bản sao lưu độc lập; cài lại hệ điều hành có thể xóa dữ liệu hiện có.",
  },
  {
    question: "Backup và hỗ trợ kỹ thuật của VPS Gold được thực hiện thế nào?",
    answer:
      "InterData tiếp nhận yêu cầu hỗ trợ qua cổng khách hàng. Hãy xác nhận lịch sao lưu, số bản giữ lại, cách khôi phục và phạm vi hỗ trợ của gói trước khi triển khai. Với dữ liệu quan trọng, cần thêm bản sao lưu ngoài VPS và kiểm tra khả năng khôi phục định kỳ.",
  },
];
