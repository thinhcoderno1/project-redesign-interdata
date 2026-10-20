import type { BillingCycle, VpsProduct } from "./vps-pricing";

export type PlatinumCloudProduct = VpsProduct & { available: boolean };
export const platinumCloudPricingGid = 41;
export const platinumCloudBillingCycles: {
  key: BillingCycle;
  label: string;
}[] = [
  { key: "monthly", label: "1 tháng" },
  { key: "quarterly", label: "3 tháng" },
  { key: "semiannually", label: "6 tháng" },
  { key: "annually", label: "12 tháng" },
  { key: "biennially", label: "24 tháng" },
  { key: "triennially", label: "36 tháng" },
];

export const platinumCloudComparisonRows = [
  {
    criterion: "Nền tảng",
    cloud: "Intel Xeon Platinum Gen 2, tài nguyên theo gói",
    hosting: "Môi trường hosting được nhà cung cấp quản trị",
  },
  {
    criterion: "Quyền quản trị",
    cloud: "Tự cấu hình hệ điều hành và dịch vụ",
    hosting: "Quản lý website trong phạm vi control panel",
  },
  {
    criterion: "Ứng dụng phù hợp",
    cloud: "Website, API, database, container và hệ thống nội bộ",
    hosting: "Website tương thích với môi trường hosting có sẵn",
  },
  {
    criterion: "Lưu trữ và kết nối",
    cloud: "NVMe U.2, cổng mạng 10 Gbps; dung lượng và lưu lượng theo gói",
    hosting: "Đối chiếu dung lượng, I/O và lưu lượng theo gói hosting",
  },
  {
    criterion: "Vận hành",
    cloud: "Cần quản lý cập nhật, firewall, giám sát và sao lưu",
    hosting: "Nhà cung cấp quản lý nền tảng; khách hàng quản lý mã nguồn",
  },
  {
    criterion: "Khi cần mở rộng",
    cloud: "Trao đổi phương án nâng CPU, RAM hoặc dung lượng theo tải",
    hosting: "Nâng gói hoặc chuyển sang máy chủ riêng khi cần tùy chỉnh sâu",
  },
];

export const platinumCloudFaq = [
  {
    question: "Platinum Cloud Server sử dụng nền tảng gì?",
    answer:
      "Dịch vụ sử dụng nền tảng Intel Xeon Platinum thế hệ 2 (dòng 82xx), kết hợp lưu trữ NVMe U.2. Cấu hình hiển thị vCPU, RAM, dung lượng và lưu lượng theo gói; thông tin IP cần đối chiếu theo gói và địa điểm. Hiệu năng còn phụ thuộc phần mềm và mức tải thực tế.",
  },
  {
    question: "Platinum Cloud Server khác VPS Linux ở điểm nào?",
    answer:
      "Platinum Cloud là dòng dịch vụ dựa trên nền tảng Intel Xeon Platinum Gen 2; Linux là hệ điều hành có thể dùng trên máy chủ. Hai tên gọi mô tả các khía cạnh khác nhau. Khi lựa chọn, hãy đối chiếu cấu hình, loại lưu trữ, mạng, template hệ điều hành và phạm vi hỗ trợ của từng gói.",
  },
  {
    question: "Cổng mạng 10 Gbps có phải tốc độ truyền luôn đạt 10 Gbps?",
    answer:
      "Không. Đây là thông số cổng mạng, còn tốc độ truyền thực tế phụ thuộc tuyến kết nối, điểm đích và tải hệ thống. Lưu lượng theo tháng được ghi riêng trong mỗi gói; hãy tính cả dữ liệu tải lên, tải xuống và đồng bộ trước khi chọn cấu hình.",
  },
  {
    question:
      "Tôi có thể chọn hệ điều hành và triển khai ứng dụng riêng không?",
    answer:
      "Bạn có thể chủ động cài đặt phần mềm trên môi trường máy chủ của mình. Kiểm tra danh sách template và phiên bản đang cung cấp khi đăng ký. Với Windows, phần mềm có giấy phép hoặc yêu cầu cài đặt riêng, cần xác nhận khả năng hỗ trợ và chi phí trước khi đặt hàng.",
  },
  {
    question: "Giá hiển thị là giá mỗi tháng hay tổng tiền của chu kỳ?",
    answer:
      "Bảng giá hiển thị tổng tiền cho chu kỳ được chọn, từ 1 đến 36 tháng; không quy đổi các chu kỳ dài thành giá tháng. Nút đăng ký đi đến đúng sản phẩm và chu kỳ. Kiểm tra thuế, tùy chọn bổ sung và giá gia hạn trong đơn hàng trước khi thanh toán.",
  },
  {
    question: "Có thể nâng cấu hình mà không gián đoạn dịch vụ không?",
    answer:
      "Hãy gửi cấu hình hiện tại, tài nguyên cần bổ sung và khoảng thời gian có thể bảo trì để đội ngũ kỹ thuật kiểm tra phương án. Thời gian thực hiện và khả năng phải khởi động lại phụ thuộc gói và thay đổi cụ thể. Cần có bản sao lưu trước khi nâng cấp.",
  },
  {
    question: "Sao lưu và hỗ trợ kỹ thuật được cung cấp thế nào?",
    answer:
      "InterData tiếp nhận yêu cầu kỹ thuật qua cổng khách hàng. Trước khi triển khai, xác nhận lịch backup, số bản giữ lại, cách khôi phục và phạm vi hỗ trợ của gói. Với dữ liệu quan trọng, hãy duy trì thêm bản sao độc lập và kiểm tra khôi phục định kỳ.",
  },
  {
    question: "Các gói có hậu tố HN khác gì và khi nào có thể đăng ký?",
    answer:
      "Hậu tố HN phân biệt cấu hình tại Hà Nội. Giá và tài nguyên có thể khác các gói tiêu chuẩn; hãy giữ đúng tên và địa điểm khi lựa chọn. Nếu gói đang hết tài nguyên, liên hệ InterData để kiểm tra khả năng cung cấp. Cần xác nhận riêng tùy chọn IPv4 vì mô tả gói HN không công bố cùng thông tin IP như các gói tiêu chuẩn.",
  },
];
