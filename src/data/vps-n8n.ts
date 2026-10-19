import type { VpsProduct } from "./vps-pricing";
export const n8nDefaultGid = 3;
export const n8nServices = [
  {
    gid: 20,
    label: "VPS GOLD",
    href: "/vps-gold/",
    store: "https://support.interdata.vn/index.php?rp=/store/vps-gold",
  },
  {
    gid: 67,
    label: "VPS AMD",
    href: "/vps-amd/",
    store: "https://support.interdata.vn/index.php?rp=/store/amd-g3-vps",
  },
  {
    gid: 29,
    label: "VPS PLATINUM",
    href: "/vps-platinum/",
    store: "https://support.interdata.vn/index.php?rp=/store/vps-platinum",
  },
  {
    gid: 101,
    label: "PLATINUM · VIETTEL",
    href: "/vps-platinum/",
    store:
      "https://support.interdata.vn/index.php?rp=/store/vps-platinum-viettel-hcm",
  },
  {
    gid: 3,
    label: "VPS LINUX",
    href: "/vps-linux/",
    store: "https://support.interdata.vn/index.php?rp=/store/cloud-vps",
  },
] as const;
export type N8nGid = (typeof n8nServices)[number]["gid"];
export type N8nPrices = Record<N8nGid, VpsProduct[] | null>;
export const n8nFaq = [
  {
    question: "VPS n8n có phải một dòng VPS riêng của InterData không?",
    answer:
      "Không. Đây là cách triển khai n8n bằng template hệ điều hành cài sẵn n8n. Tất cả dịch vụ VPS của InterData đều hỗ trợ template này. Bạn chọn dòng VPS, cấu hình và chu kỳ phù hợp, sau đó chọn template n8n ở bước cấu hình đơn hàng.",
  },
  {
    question: "Tôi cần chọn cấu hình nào để bắt đầu với n8n?",
    answer:
      "Hãy dựa trên số workflow chạy đồng thời, lượng dữ liệu mỗi lần xử lý, thời gian lưu lịch sử thực thi và các dịch vụ chạy cùng VPS. Bạn có thể so sánh các gói VPS hiện có trong bảng giá; hãy kiểm tra tải thực tế trước khi tăng quy mô.",
  },
  {
    question: "Chọn template n8n như thế nào khi đăng ký?",
    answer:
      "Chọn dịch vụ VPS và chu kỳ trong bảng giá, mở trang đăng ký rồi chọn template n8n trong danh sách hệ điều hành. Kiểm tra cấu hình, phiên bản template và hóa đơn trước khi thanh toán. Sau khi VPS được bàn giao, làm theo thông tin truy cập để hoàn tất thiết lập n8n.",
  },
  {
    question: "Giá trong bảng có phải giá của một gói n8n riêng không?",
    answer:
      "Không. Đây là giá của từng gói VPS thuộc dịch vụ bạn đang chọn và là tổng tiền theo chu kỳ, không phải giá quy đổi mỗi tháng. Kiểm tra thuế, tùy chọn bổ sung và giá gia hạn tại trang đăng ký. Phí sử dụng API hoặc tính năng n8n cần giấy phép riêng không mặc nhiên nằm trong giá VPS.",
  },
  {
    question: "Dùng template cài sẵn có cần biết quản trị VPS không?",
    answer:
      "Template giúp rút ngắn bước cài đặt ban đầu. Bạn vẫn cần quản lý tài khoản, HTTPS, bảo mật, cập nhật và sao lưu. InterData hỗ trợ hạ tầng VPS theo phạm vi dịch vụ; việc xây dựng workflow và vận hành ứng dụng n8n cần do bạn quản lý hoặc trao đổi thêm về phạm vi hỗ trợ.",
  },
  {
    question: "Tôi có thể chạy AI Agent trên n8n không?",
    answer:
      "Bạn có thể xây dựng workflow kết nối dịch vụ AI qua API và quản lý thông tin xác thực trong n8n. Chi phí, giới hạn và quyền truy cập phụ thuộc nhà cung cấp API. Khả năng chạy mô hình AI ngay trên VPS phụ thuộc phần cứng và yêu cầu mô hình; không nên xem VPS tiêu chuẩn là máy chủ GPU.",
  },
  {
    question: "Cần sao lưu những gì trước khi cập nhật hoặc cài lại VPS?",
    answer:
      "Cần có bản sao lưu dữ liệu n8n, thông tin cấu hình và khóa mã hóa dùng cho credentials, đồng thời kiểm tra quy trình khôi phục. Cài lại hệ điều hành có thể xóa dữ liệu hiện có. Xác nhận lịch backup của gói và giữ thêm bản sao độc lập ngoài VPS cho dữ liệu quan trọng.",
  },
  {
    question: "Self-host n8n có bao gồm mọi tính năng và không giới hạn không?",
    answer:
      "Không nên hiểu như vậy. Các tính năng phụ thuộc phiên bản và giấy phép n8n; tài nguyên VPS, giới hạn API và mức chạy đồng thời cũng ảnh hưởng khả năng vận hành. Hãy đối chiếu tài liệu chính thức của n8n và điều kiện của các dịch vụ bạn kết nối trước khi sử dụng.",
  },
];
export const n8nComparison = [
  {
    criterion: "Cài đặt ban đầu",
    template: "Chọn template hệ điều hành cài sẵn n8n",
    manual: "Tự chuẩn bị môi trường và cài đặt n8n",
  },
  {
    criterion: "Chọn dịch vụ VPS",
    template: "Dùng được trên tất cả dịch vụ VPS InterData",
    manual: "Chọn VPS đáp ứng yêu cầu triển khai",
  },
  {
    criterion: "Tùy chỉnh môi trường",
    template: "Kiểm tra cấu hình có sẵn, điều chỉnh theo nhu cầu",
    manual: "Chủ động thiết kế môi trường ngay từ đầu",
  },
  {
    criterion: "Workflow & tích hợp",
    template: "Bạn tự tạo workflow và kết nối tài khoản",
    manual: "Bạn tự tạo workflow và kết nối tài khoản",
  },
  {
    criterion: "Vận hành lâu dài",
    template: "Bạn quản lý cập nhật, bảo mật và sao lưu",
    manual: "Bạn quản lý cập nhật, bảo mật và sao lưu",
  },
];
