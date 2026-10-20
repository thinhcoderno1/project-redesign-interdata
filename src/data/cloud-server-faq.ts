export const cloudServerFaqs = [
  {
    question: "Tôi nên chọn gói Cloud Server nào nếu chưa rành kỹ thuật?",
    answer:
      "Nếu chưa chắc nên chọn cấu hình nào, bạn nên bắt đầu từ nhu cầu thực tế: website giới thiệu, web bán hàng, ứng dụng nội bộ, database hay môi trường dev/test. InterData có thể tư vấn cấu hình theo lượng truy cập, mã nguồn, dung lượng dữ liệu và ngân sách để tránh thuê gói quá thấp hoặc quá dư.",
  },
  {
    question: "Khi nào nên thuê Cloud Server thay vì Hosting?",
    answer:
      "Bạn nên thuê Cloud Server khi website hoặc ứng dụng cần tài nguyên riêng, toàn quyền cài đặt phần mềm, chạy nhiều dịch vụ nền, xử lý lượng truy cập lớn hơn hoặc cần cấu hình bảo mật riêng. Nếu chỉ có một website nhỏ và không muốn tự quản trị máy chủ, Hosting vẫn là lựa chọn đơn giản hơn.",
  },
  {
    question: "Bảng giá Cloud Server trên trang đã bao gồm những gì?",
    answer:
      "Bảng giá hiển thị chi phí thuê gói Cloud Server theo cấu hình và chu kỳ thanh toán đang có trên hệ thống. Thông thường cấu hình sẽ gồm CPU, RAM, dung lượng lưu trữ và các thông số liên quan. Các dịch vụ phát sinh như license phần mềm, cấu hình nâng cao hoặc hỗ trợ đặc thù cần được kiểm tra riêng trước khi đăng ký.",
  },
  {
    question: "Giá hiển thị là theo tháng hay theo chu kỳ thanh toán khác?",
    answer:
      "Giá trong bảng được hiển thị theo chu kỳ thanh toán của từng gói. Một số gói có thể tính theo tháng, một số gói có thể áp dụng chu kỳ tối thiểu dài hơn tùy dữ liệu đặt hàng. Trước khi thanh toán, bạn nên kiểm tra lại giá, chu kỳ và thông tin gói ở trang đặt hàng.",
  },
  {
    question: "Tôi có thể nâng cấp CPU, RAM hoặc ổ cứng sau khi dùng không?",
    answer:
      "Có. Khi website hoặc ứng dụng tăng trưởng, bạn có thể liên hệ InterData để kiểm tra phương án nâng cấp CPU, RAM hoặc dung lượng lưu trữ. Đội kỹ thuật sẽ tư vấn theo gói đang dùng và tình trạng hệ thống để hạn chế ảnh hưởng đến dữ liệu, thời gian hoạt động và cấu hình hiện tại.",
  },
  {
    question:
      "Thuê Cloud Server có được toàn quyền root hoặc administrator không?",
    answer:
      "Có. Khách hàng được cấp quyền quản trị cao nhất để cài đặt hệ điều hành, web server, database, control panel, firewall hoặc các phần mềm cần thiết cho dự án. Vì có toàn quyền quản trị, bạn cũng cần cẩn trọng khi phân quyền, mở port và thay đổi cấu hình hệ thống.",
  },
  {
    question: "InterData có hỗ trợ cài đặt ban đầu không?",
    answer:
      "InterData hỗ trợ khách hàng trong quá trình khởi tạo và tư vấn các bước triển khai ban đầu theo phạm vi dịch vụ. Nếu bạn cần cài đặt cấu hình riêng, migrate dữ liệu, tối ưu web server hoặc xử lý yêu cầu đặc thù, hãy trao đổi trước để đội kỹ thuật xác nhận phạm vi hỗ trợ.",
  },
  {
    question:
      "Cloud Server có phù hợp để chạy website WordPress hoặc web bán hàng không?",
    answer:
      "Có. Cloud Server phù hợp cho WordPress, website doanh nghiệp, landing page, web bán hàng và hệ thống có database riêng. Với WordPress hoặc thương mại điện tử, bạn nên chọn cấu hình dựa trên lượng truy cập, số plugin, dung lượng ảnh, cache và nhu cầu backup để tránh nghẽn tài nguyên.",
  },
  {
    question:
      "Cloud Server có chạy được ứng dụng, API hoặc database riêng không?",
    answer:
      "Có. Bạn có thể dùng Cloud Server để chạy ứng dụng backend, API, database, cronjob, bot, môi trường staging hoặc các dịch vụ nội bộ. Nên tách tài nguyên hoặc chọn cấu hình cao hơn nếu database và ứng dụng có tải lớn, nhiều kết nối đồng thời hoặc yêu cầu uptime cao.",
  },
  {
    question: "Một Cloud Server có thể chạy bao nhiêu website?",
    answer:
      "Số lượng website phụ thuộc vào cấu hình Cloud Server, mã nguồn, lưu lượng truy cập, database và cách tối ưu. Về mặt kỹ thuật có thể chạy nhiều website, nhưng để ổn định bạn nên phân bổ theo tài nguyên thực tế thay vì đặt số lượng quá lớn trên một gói nhỏ.",
  },
  {
    question: "InterData có hỗ trợ chuyển dữ liệu từ nhà cung cấp khác không?",
    answer:
      "Có. InterData có thể hỗ trợ chuyển dữ liệu tùy theo nền tảng hiện tại, dung lượng, cấu trúc website hoặc ứng dụng và thời gian downtime cho phép. Bạn nên gửi trước thông tin hệ thống cũ để đội kỹ thuật đánh giá phương án chuyển, rủi ro và thời gian thực hiện.",
  },
  {
    question: "Dữ liệu của tôi có được sao lưu tự động không?",
    answer:
      "Tùy chọn sao lưu cần được kiểm tra theo gói dịch vụ và nhu cầu sử dụng. Với dữ liệu quan trọng, bạn nên có chính sách backup riêng theo ngày hoặc theo tuần, lưu bản sao ở vị trí an toàn và kiểm tra khả năng khôi phục định kỳ thay vì chỉ dựa vào một bản lưu duy nhất.",
  },
  {
    question: "Cloud Server có chống DDoS và Firewall không?",
    answer:
      "InterData triển khai các lớp bảo vệ như Firewall, Anti-DDoS và giám sát hệ thống để giảm rủi ro tấn công. Tuy nhiên, mức độ bảo vệ thực tế còn phụ thuộc vào loại tấn công, cấu hình dịch vụ, port đang mở và cách bạn bảo mật ứng dụng trên máy chủ.",
  },
  {
    question: "Tôi có thể cài đặt những hệ điều hành nào trên Cloud Server?",
    answer:
      "Cloud Server tại InterData hỗ trợ đa dạng các hệ điều hành Linux phổ biến và tối ưu hiện nay như Ubuntu, Debian, CentOS, AlmaLinux, Rocky Linux... Khách hàng có thể linh hoạt lựa chọn hoặc cài đặt lại hệ điều hành phù hợp với môi trường triển khai của dự án.",
  },
  {
    question:
      "Nếu Cloud Server gặp lỗi ngoài giờ hành chính thì được hỗ trợ thế nào?",
    answer:
      "InterData có đội ngũ hỗ trợ kỹ thuật 24/7 qua các kênh như ticket, live chat, email, hotline, Zalo hoặc Fanpage. Khi gửi yêu cầu, bạn nên mô tả lỗi, thời điểm phát sinh, thao tác gần nhất và ảnh chụp/log nếu có để kỹ thuật kiểm tra nhanh hơn.",
  },
  {
    question: "Tôi cần chuẩn bị gì trước khi đăng ký Cloud Server?",
    answer:
      "Bạn nên chuẩn bị mục đích sử dụng, mã nguồn hoặc nền tảng đang chạy, lượng truy cập dự kiến, dung lượng dữ liệu, hệ điều hành mong muốn, yêu cầu backup, ngân sách và thời gian cần triển khai. Các thông tin này giúp InterData tư vấn gói sát nhu cầu hơn.",
  },
];
