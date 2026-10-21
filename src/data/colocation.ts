// Source: https://interdata.vn/vietnam-co-location, checked 2026-10-21.
// Published monthly rates; the original service uses consultation, not checkout.
export const colocationPlans = [
  {
    id: "1u",
    name: "Single Server",
    rack: "1U",
    monthlyPrice: 1600000,
    specs: [
      "1U Server",
      "Power 750W",
      "Không giới hạn băng thông",
      "Tốc độ đường truyền Up to 40Gbps",
    ],
    href: "#support",
    highlighted: false,
  },
  {
    id: "2u",
    name: "Single Server",
    rack: "2U",
    monthlyPrice: 2200000,
    specs: [
      "2U Server",
      "Power 750W",
      "Không giới hạn băng thông",
      "Tốc độ đường truyền Up to 40Gbps",
    ],
    href: "#support",
    highlighted: true,
  },
  {
    id: "3u",
    name: "Single Server",
    rack: "3U",
    monthlyPrice: 2800000,
    specs: [
      "3U Server",
      "Power 750W",
      "Không giới hạn băng thông",
      "Tốc độ đường truyền Up to 40Gbps",
    ],
    href: "#support",
    highlighted: false,
  },
  {
    id: "42u",
    name: "Locking Cabinet",
    rack: "42U",
    monthlyPrice: 36000000,
    specs: [
      "42U Server",
      "Power 7200W",
      "Không giới hạn băng thông",
      "Tốc độ đường truyền Up to 40Gbps",
    ],
    href: "#support",
    highlighted: false,
  },
];
export const colocationFaq = [
  {
    question: "Thuê chỗ đặt máy chủ (Colocation) là gì?",
    answer:
      "Colocation là dịch vụ đặt máy chủ do bạn sở hữu tại datacenter. Bạn thuê không gian rack cùng hạ tầng điện, làm mát và kết nối mạng; phần cứng máy chủ vẫn thuộc về bạn. Đây là điểm khác biệt với dịch vụ thuê máy chủ vật lý của nhà cung cấp.",
  },
  {
    question: "Khi nào nên chọn Colocation thay vì thuê máy chủ?",
    answer:
      "Colocation phù hợp khi bạn đã có thiết bị và muốn chủ động lựa chọn phần cứng, nhưng cần hạ tầng datacenter để vận hành. Nếu chưa có máy chủ hoặc muốn nhà cung cấp cung ứng phần cứng, hãy cân nhắc dịch vụ Thuê Máy Chủ và so sánh tổng chi phí đầu tư, bảo trì, thay thế thiết bị.",
  },
  {
    question: "Dịch vụ chỗ đặt máy chủ dành cho những ai?",
    answer:
      "Dịch vụ phù hợp với doanh nghiệp đã có máy chủ cho website, cơ sở dữ liệu, ERP, CRM hoặc hệ thống nội bộ. Trước khi thuê, cần xác định số thiết bị, kích thước rack, công suất và yêu cầu kết nối để chọn chỗ đặt phù hợp.",
  },
  {
    question: "Có những lựa chọn không gian rack nào?",
    answer:
      "Bảng giá hiện có Single Server 1U, 2U, 3U và Locking Cabinet 42U. Nếu thiết bị có kích thước khác hoặc cần nhiều vị trí, hãy gửi thông số và số lượng để xác nhận khả năng bố trí, tải điện và báo giá.",
  },
  {
    question: "InterData có hỗ trợ cài đặt máy chủ ban đầu không?",
    answer:
      "Bạn có thể trao đổi để được hỗ trợ cài đặt hệ điều hành và một số phần mềm cơ bản. Cần thống nhất phiên bản, khả năng tương thích và phạm vi thao tác trước khi triển khai. Các yêu cầu tối ưu ứng dụng hoặc quản trị chuyên sâu cần được xác nhận riêng.",
  },
  {
    question: "Hạ tầng bảo mật cho chỗ đặt máy chủ gồm những gì?",
    answer:
      "Dịch vụ giới thiệu hạ tầng bảo vệ và hỗ trợ chống DDoS. Hãy xác nhận phạm vi bảo vệ, điều kiện áp dụng và cấu hình kết nối theo phương án triển khai. Khách hàng vẫn cần quản lý firewall trên máy chủ, cập nhật phần mềm, tài khoản truy cập và sao lưu dữ liệu.",
  },
  {
    question: "Đội ngũ kỹ thuật hỗ trợ những công việc nào?",
    answer:
      "InterData tiếp nhận yêu cầu hỗ trợ 24/7. Khi cần kiểm tra nguồn điện, kết nối, tình trạng máy chủ hoặc thao tác trực tiếp tại datacenter, hãy gửi yêu cầu cụ thể qua ticket. Phạm vi thao tác, quyền truy cập thiết bị và chi phí phát sinh nếu có cần được thống nhất trước.",
  },
  {
    question: "Tôi có thể tự quản lý máy chủ từ xa không?",
    answer:
      "Có. Bạn chủ động quản trị hệ điều hành và dịch vụ bằng SSH, RDP hoặc công cụ phù hợp với thiết bị của mình. Phương án truy cập ngoài băng như IPMI hoặc iDRAC phụ thuộc phần cứng và cấu hình mạng, cần xác nhận khi bàn giao.",
  },
  {
    question: "Không giới hạn băng thông có đồng nghĩa luôn đạt 40 Gbps không?",
    answer:
      "Không. Bảng giá công bố không giới hạn băng thông và đường truyền Up to 40Gbps. Khả năng đạt tốc độ thực tế phụ thuộc cổng kết nối, tuyến mạng, thiết bị và mức tải. Cần xác nhận tốc độ cam kết, trong nước/quốc tế và điều kiện sử dụng trong báo giá.",
  },
  {
    question: "Power 750W và 7200W trên bảng giá được hiểu như thế nào?",
    answer:
      "Các gói Single Server công bố Power 750W; tủ 42U công bố Power 7200W. Trước khi đưa thiết bị vào, cần đối chiếu công suất sử dụng thực tế, số nguồn, loại đầu cắm, phương án cấp điện và cách tính điện vượt mức nếu có. Không suy ra hạn mức tiêu thụ hoặc chi phí điện bổ sung khi chưa có thỏa thuận.",
  },
  {
    question: "Có thể yêu cầu địa điểm ngoài Việt Nam không?",
    answer:
      "Trang này mô tả dịch vụ tại Việt Nam, với địa điểm ở Hà Nội và TP. Hồ Chí Minh. Nếu cần chỗ đặt ở quốc gia khác, hãy gửi yêu cầu để InterData xác nhận địa điểm, khả năng cung cấp và điều kiện dịch vụ riêng.",
  },
  {
    question: "Thủ tục bàn giao máy chủ gồm những bước nào?",
    answer:
      "Hai bên kiểm tra cấu hình máy chủ, số lượng và mã số linh kiện, sau đó lập biên bản bàn giao và thống nhất phương án lắp đặt. Bạn nên chuẩn bị thông tin liên hệ kỹ thuật, sơ đồ kết nối và quyền thao tác được phép trên thiết bị.",
  },
  {
    question: "Bao lâu máy chủ được lắp đặt sau khi đăng ký?",
    answer:
      "Trang dịch vụ nêu thời gian triển khai thông thường trong vòng 24 giờ sau khi hoàn tất thủ tục đăng ký và thanh toán. Thời gian thực tế cần xác nhận theo tình trạng chỗ đặt, lịch bàn giao thiết bị, nguồn điện và yêu cầu kết nối.",
  },
  {
    question: "Cài đặt hệ điều hành và phần mềm có phát sinh phí không?",
    answer:
      "Dịch vụ có hỗ trợ cài đặt hệ điều hành và một số phần mềm cơ bản. Hãy xác nhận danh mục công việc được hỗ trợ miễn phí, giấy phép phần mềm và chi phí cho các yêu cầu ngoài phạm vi trước khi đăng ký.",
  },
  {
    question: "InterData có bảo hành phần cứng máy chủ của tôi không?",
    answer:
      "InterData không bảo hành phần cứng máy chủ do khách hàng tự trang bị; nhà cung cấp hỗ trợ xử lý sự cố liên quan đến hạ tầng trong phạm vi dịch vụ. Khách hàng cần có phương án bảo hành, linh kiện thay thế và sao lưu dữ liệu cho thiết bị của mình.",
  },
  {
    question:
      "Tôi có thể đến datacenter để kiểm tra hoặc bảo trì thiết bị không?",
    answer:
      "Bạn có thể trao đổi để được bố trí theo lịch hẹn và quy định ra vào datacenter. Hãy đăng ký người thực hiện, thiết bị cần thao tác, nội dung công việc và thời gian dự kiến. Việc đưa thiết bị vào hoặc mang thiết bị ra cần theo thủ tục bàn giao đã thống nhất.",
  },
];
