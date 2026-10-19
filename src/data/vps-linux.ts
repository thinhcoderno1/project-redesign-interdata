import type { BillingCycle } from "./vps-pricing";

export const linuxPricingGid = 3;
export const linuxBillingCycles: { key: BillingCycle; label: string }[] = [
  { key: "monthly", label: "1 tháng" },
  { key: "quarterly", label: "3 tháng" },
  { key: "semiannually", label: "6 tháng" },
  { key: "annually", label: "12 tháng" },
  { key: "biennially", label: "24 tháng" },
  { key: "triennially", label: "36 tháng" },
];

export const linuxFaq = [
  {
    question: "VPS Linux là gì và phù hợp với nhu cầu nào?",
    answer:
      "VPS Linux là máy chủ ảo chạy hệ điều hành Linux với tài nguyên được phân bổ theo gói và quyền quản trị riêng. Bạn có thể dùng để vận hành website, API, cơ sở dữ liệu, môi trường phát triển hoặc công cụ self-host. Nếu chỉ cần một website nhỏ và không muốn quản trị hệ điều hành, Shared Hosting có thể phù hợp hơn.",
  },
  {
    question:
      "Tôi có thể chọn Ubuntu, Debian, AlmaLinux hoặc Rocky Linux không?",
    answer:
      "Hãy đối chiếu bản phân phối và phiên bản cần dùng với danh sách template tại trang đăng ký. Chọn phiên bản còn được nhà phát hành hỗ trợ và tương thích với ứng dụng. Nếu cần một phiên bản hoặc cấu hình cài đặt riêng, hãy xác nhận với InterData trước khi đặt hàng.",
  },
  {
    question: "VPS Linux có quyền root và kết nối SSH không?",
    answer:
      "Bạn có quyền quản trị để cài đặt phần mềm và cấu hình dịch vụ trên VPS. SSH là cách phổ biến để quản trị Linux từ xa. Sau khi nhận VPS, nên thiết lập SSH key, tài khoản quản trị riêng, cập nhật hệ điều hành và giới hạn các cổng truy cập cần thiết.",
  },
  {
    question:
      "Không giới hạn băng thông có đồng nghĩa với tốc độ không giới hạn?",
    answer:
      "Không. Băng thông theo tháng là dung lượng dữ liệu truyền tải, còn network port là giới hạn tốc độ kết nối của gói. Giá và thông số trong từng thẻ cấu hình được lấy từ hệ thống đăng ký; cần đối chiếu cả hai thông số khi chạy website có nhiều truy cập hoặc tải dữ liệu lớn.",
  },
  {
    question: "Giá trong bảng là giá mỗi tháng hay tổng tiền theo chu kỳ?",
    answer:
      "Số tiền hiển thị là tổng giá cho chu kỳ bạn đang chọn, không phải giá quy đổi mỗi tháng. Liên kết đăng ký giữ đúng sản phẩm và chu kỳ đó. Kiểm tra thuế, tùy chọn bổ sung, giấy phép phần mềm và giá gia hạn trên hóa đơn trước khi thanh toán.",
  },
  {
    question: "Tôi chưa quen Linux thì có sử dụng được dịch vụ không?",
    answer:
      "Bạn có thể bắt đầu với cấu hình phù hợp và tài liệu quản trị của bản phân phối, nhưng vẫn cần làm quen với SSH, cập nhật hệ điều hành, phân quyền và sao lưu. Hãy trao đổi phạm vi hỗ trợ trước khi thuê nếu cần cài đặt phần mềm, chuyển dữ liệu hoặc quản trị thường xuyên.",
  },
  {
    question: "Tôi có thể nâng cấp tài nguyên và cài lại hệ điều hành không?",
    answer:
      "Bạn có thể gửi yêu cầu nâng cấp hoặc cài lại hệ điều hành theo khả năng cung cấp của gói. Cần xác nhận chi phí, thời gian gián đoạn và phương án chuyển dữ liệu trước khi thực hiện. Cài lại hệ điều hành có thể xóa dữ liệu hiện có, vì vậy hãy sao lưu và kiểm tra khả năng khôi phục trước.",
  },
  {
    question: "Backup, địa chỉ IP và hỗ trợ kỹ thuật được cung cấp thế nào?",
    answer:
      "Thông số địa chỉ IP được ghi theo từng gói trong bảng giá. InterData tiếp nhận yêu cầu hỗ trợ qua cổng khách hàng; hãy xác nhận lịch backup, số bản giữ lại, cách khôi phục và phạm vi hỗ trợ của gói trước khi triển khai. Với dữ liệu quan trọng, cần thêm bản sao lưu độc lập ngoài VPS.",
  },
];
