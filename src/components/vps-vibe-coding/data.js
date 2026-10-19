export const steps = [
  {
    title: "Đăng ký & chọn gói",
    desc: "Chưa chắc chọn gì? Để lại thông tin, InterData tư vấn giúp bạn.",
  },
  {
    title: "Chọn đúng OS template",
    desc: "Lúc khởi tạo máy, chọn template Ubuntu-22.04-EzyPlatform. Hệ thống sẽ tự cài EzyPlatform và cấp subdomain trỏ sẵn, bạn không phải đụng vào phần kỹ thuật nào khác.",
    template: "Ubuntu-22.04-EzyPlatform",
    note: "Đây là bước duy nhất bạn cần để tâm. Chọn template khác thì máy sẽ không có sẵn EzyPlatform.",
  },
  {
    title: "Nhận email bàn giao",
    desc: "IP, tài khoản, link hướng dẫn - mở ra là dùng.",
  },
  {
    title: "Bắt đầu mô tả ý tưởng",
    desc: "Có 7 ngày dùng thử kèm hỗ trợ.",
  },
];

export const roleLayers = [
  {
    id: "ban",
    tone: "you",
    icon: "you",
    tag: "Bạn + AI",
    title: "Nghĩ ra và mô tả điều bạn muốn.",
    items: [
      "Mô tả ý tưởng bằng tiếng Việt",
      "Xem kết quả và chỉnh lại cho vừa ý",
      "Làm chủ sản phẩm và dữ liệu",
    ],
  },
  {
    id: "ezyplatform",
    tone: "platform",
    icon: "platform",
    tag: "EzyPlatform - Nền tảng",
    title: "Giữ cho công cụ luôn tốt.",
    items: [
      "Nơi AI làm việc và bạn triển khai",
      "Xử lý lỗi nền tảng",
      "Cập nhật tính năng",
      "Hướng dẫn sử dụng",
      "1-click deploy",
    ],
  },
  {
    id: "interdata",
    tone: "infra",
    icon: "infra",
    tag: "InterData - Hạ tầng",
    title: "Giữ cho mọi thứ luôn chạy.",
    items: [
      "Máy chủ ổn định, tốc độ cao",
      "Sao lưu định kỳ",
      "Chống tấn công Anti-DDoS",
      "Online 24/7",
      "Hỗ trợ vận hành",
    ],
  },
];

export const faqs = [
  {
    group: "People Also Ask",
    question: "VPS là gì và khác Shared Hosting ở điểm nào?",
    answer:
      "VPS là máy chủ ảo có hệ điều hành và tài nguyên riêng theo gói; bạn được quyền cài runtime, database và cấu hình máy chủ. Shared Hosting dùng chung môi trường do nhà cung cấp quản lý nên dễ dùng hơn nhưng bị giới hạn quyền tùy chỉnh. VPS phù hợp khi dự án cần quyền quản trị, chạy Node.js, Docker, API hoặc nhiều dịch vụ nền.",
  },
  {
    group: "People Also Ask",
    question: "VPS dùng để làm gì?",
    answer:
      "VPS thường dùng để chạy website, API, database, ứng dụng nội bộ, môi trường dev/test, bot và các dịch vụ cần hoạt động 24/7. Với VPS Vibe Coding, mục tiêu chính là tạo một môi trường luôn trực tuyến để dựng, thử nghiệm và triển khai website hoặc ứng dụng từ EzyPlatform.",
  },
  {
    group: "People Also Ask",
    question: "VPS cần bao nhiêu RAM để chạy website hoặc ứng dụng?",
    answer:
      "Website nhỏ hoặc môi trường thử nghiệm có thể bắt đầu từ 2–3 GB RAM. WordPress nhiều plugin, nhiều website hoặc ứng dụng có database nên chọn khoảng 4–8 GB. Nếu chạy đồng thời Docker, build source, database và nhiều service, nên ưu tiên từ 8 GB; hãy nâng cấp khi RAM thường xuyên vượt 80% hoặc máy bắt đầu dùng swap liên tục.",
  },
  {
    group: "People Also Ask",
    question: "Nên chọn VPS Linux hay VPS Windows?",
    answer:
      "Chọn Linux nếu chạy EzyPlatform, Node.js, PHP, Python, Docker hoặc WordPress vì nhẹ và không tốn license Windows. Chỉ nên chọn Windows khi phần mềm bắt buộc cần Windows Server, IIS, .NET Framework cũ, MSSQL hoặc thao tác qua Remote Desktop. Luồng VPS Vibe Coding hiện được định hướng trên Ubuntu/EzyPlatform.",
  },
  {
    group: "People Also Ask",
    question: "SSD NVMe giúp VPS nhanh hơn ở điểm nào?",
    answer:
      "NVMe cải thiện các tác vụ đọc/ghi như cài package, build source, truy vấn database, giải nén và backup. Nó không tự khắc phục ứng dụng viết chưa tối ưu hoặc thiếu RAM/CPU, nhưng giúp giảm nghẽn ổ đĩa rõ rệt so với HDD và thường nhanh hơn SSD SATA.",
  },
  {
    group: "People Also Ask",
    question: "VPS có địa chỉ IP riêng không?",
    answer:
      "Có. Các gói đang hiển thị trên website kèm 1 IPv4 riêng theo thông tin bảng giá nguồn. IP này dùng để SSH, trỏ tên miền và công bố dịch vụ ra Internet. IP riêng không đồng nghĩa tự động an toàn; bạn vẫn cần mật khẩu mạnh hoặc SSH key, firewall và cập nhật hệ điều hành.",
  },
  {
    group: "People Also Ask",
    question: "Băng thông không giới hạn có nghĩa là tốc độ luôn tối đa?",
    answer:
      "Không. “Unlimited Bandwidth” nghĩa là không giới hạn tổng dung lượng truyền tải theo tháng trong điều kiện sử dụng của gói; tốc độ tức thời vẫn bị giới hạn bởi network port. Các gói VPS Vibe Coding hiện có port 300 Mbps, nên tốc độ thực tế còn phụ thuộc tuyến mạng, máy người dùng và tải trên VPS.",
  },
  {
    group: "People Also Ask",
    question: "Một VPS có thể chạy nhiều website cùng lúc không?",
    answer:
      "Có. Bạn có thể cấu hình nhiều domain hoặc container trên một VPS. Số website không phải giới hạn cố định: nó phụ thuộc lượng truy cập, plugin, database và RAM/CPU mỗi website dùng. Nên theo dõi tài nguyên thực tế và tách các dự án quan trọng nếu chúng có mức tải hoặc yêu cầu bảo mật khác nhau.",
  },
  {
    group: "Trước khi mua",
    question:
      "Tôi không biết quản trị server thì có dùng VPS Vibe Coding được không?",
    answer:
      "Có thể dùng nếu bạn đi theo luồng EzyPlatform được chuẩn bị cho sản phẩm. Khi khởi tạo, chọn đúng template Ubuntu-22.04-EzyPlatform để hệ thống cài nền tảng thay vì bắt đầu từ VPS trắng. Tuy vậy, các thay đổi sâu ngoài EzyPlatform như firewall, dịch vụ hệ thống hoặc mã nguồn tùy chỉnh vẫn có thể cần kiến thức kỹ thuật.",
  },
  {
    group: "Trước khi mua",
    question: "Sau khi thanh toán bao lâu tôi nhận được VPS?",
    answer:
      "Hệ thống InterData hỗ trợ khởi tạo VPS tự động sau khi đơn hàng và thanh toán được xác nhận. Thông tin đăng nhập sẽ được gửi về email tài khoản; thời gian có thể lâu hơn nếu đơn hàng cần xác minh hoặc template đang cài đặt. Nếu chưa nhận được, hãy kiểm tra thư rác và trạng thái dịch vụ trong cổng khách hàng.",
  },
  {
    group: "Trước khi mua",
    question: "Mua VPS Vibe Coding có kèm tên miền không?",
    answer:
      "Có. InterData sẽ cấp một subdomain để khách hàng bắt đầu sử dụng; quyền lợi này chỉ áp dụng với VPS Vibe Coding. Bạn vẫn có thể tự trỏ thêm tên miền riêng về VPS bất cứ lúc nào.",
    linkLabel: "Đăng ký tên miền tại InterData",
    linkUrl: "https://support.interdata.vn/cart.php?a=add&domain=register",
  },
  {
    group: "Trước khi mua",
    question: "Tôi có toàn quyền root và được tự cài phần mềm không?",
    answer:
      "Có, VPS cung cấp quyền quản trị để cài runtime, database, Docker và phần mềm phù hợp. Bạn cũng chịu trách nhiệm với cấu hình tự thay đổi, bản quyền phần mềm và bảo mật bên trong máy. Không nên chạy ứng dụng bằng tài khoản root và cần tạo snapshot hoặc backup trước thay đổi lớn.",
  },
  {
    group: "Trước khi mua",
    question: "Có thể nâng cấp CPU, RAM hoặc dung lượng sau khi mua không?",
    answer:
      "Có thể nâng cấp tài nguyên hoặc chuyển lên gói cao hơn khi dự án tăng tải. Dữ liệu và cấu hình thường được giữ nguyên, nhưng một số thay đổi có thể cần khởi động lại VPS. Hãy gửi yêu cầu kỹ thuật trước khi nâng cấp hệ thống production để được xác nhận thời gian gián đoạn và phương án backup.",
  },
  {
    group: "Trước khi mua",
    question: "Backup có sẵn và tôi có cần tự sao lưu thêm không?",
    answer:
      "InterData có cơ chế backup định kỳ theo thông tin dịch vụ, nhưng backup hạ tầng không nên là bản sao duy nhất của dữ liệu quan trọng. Bạn vẫn nên tự sao lưu mã nguồn, database và file lên một nơi tách biệt; đồng thời xác nhận lịch lưu, số phiên bản và quy trình khôi phục áp dụng cho đúng gói trước khi mua.",
  },
  {
    group: "Trước khi mua",
    question: "InterData hỗ trợ những gì khi VPS gặp sự cố?",
    answer:
      "Đội kỹ thuật hỗ trợ 24/7 các vấn đề thuộc hạ tầng như trạng thái VPS, nguồn, mạng, cấp phát tài nguyên và truy cập dịch vụ. Lỗi trong mã nguồn, plugin hoặc cấu hình phần mềm do bạn tự cài có thể cần kiểm tra riêng và không mặc nhiên thuộc phạm vi quản trị VPS. Khi gửi ticket, nên kèm thời điểm lỗi, IP và ảnh hoặc log liên quan.",
  },
  {
    group: "Trước khi mua",
    question:
      "Giá trên bảng đã là chi phí cuối cùng và giá gia hạn có giữ nguyên không?",
    answer:
      "Bảng giá nguồn của VPS Vibe Coding hiện ghi rõ gia hạn không đổi giá cho ba gói Vibe Basic, Vibe Standard và Vibe Pro. Bạn vẫn nên kiểm tra tổng tiền, chu kỳ thanh toán và các tùy chọn bổ sung tại trang đặt hàng trước khi trả tiền. License, control panel, IP bổ sung hoặc dịch vụ quản trị có thể phát sinh phí nếu bạn chủ động chọn thêm.",
  },
];

export const infraSpecs = [
  {
    icon: "cpu",
    label: "CPU thế hệ mới",
    value: "AMD EPYC / Intel Xeon",
    desc: "Vi xử lý máy chủ đời mới, nhiều nhân, xử lý mượt cả khi nhiều khách cùng truy cập một lúc.",
  },
  {
    icon: "disk",
    label: "Lưu trữ",
    value: "NVMe U.2 Gen4",
    desc: "Ổ NVMe chuẩn doanh nghiệp, đọc ghi nhanh hơn hẳn SSD thường, trang tải gần như tức thì.",
  },
  {
    icon: "gauge",
    label: "Network & độ trễ",
    value: "300Mbps · 0-21ms",
    desc: "Cổng mạng 300Mbps, ping nội địa 0-21ms - khách trong nước vào trang gần như không phải chờ.",
  },
  {
    icon: "infinity",
    label: "Băng thông",
    value: "Không giới hạn",
    desc: "Lượt truy cập tăng vọt lúc chạy quảng cáo hay khuyến mãi cũng không lo bị bóp băng thông.",
  },
  {
    icon: "globe",
    label: "Địa chỉ IP",
    value: "IPv4 riêng",
    desc: "Mỗi VPS một địa chỉ IPv4 riêng, không dùng chung, không bị ảnh hưởng bởi website khác.",
  },
  {
    icon: "rack",
    label: "Hạ tầng đặt tại",
    value: "DC FPT/Viettel",
    desc: "Máy chủ đặt tại Data Center trong nước, đường truyền tới khách hàng Việt Nam ngắn nhất.",
  },
];

export const whyInterData = [
  {
    icon: "support",
    title: "Support 24/7",
    note: "Có người trực máy chủ suốt ngày đêm.",
  },
  {
    icon: "backup",
    title: "Backup định kỳ",
    note: "Sao lưu tự động, cần là khôi phục lại được.",
  },
  {
    icon: "shield",
    title: "Anti-DDoS",
    note: "Chặn tấn công trước khi chạm tới máy của bạn.",
  },
  {
    icon: "key",
    title: "Full root access",
    note: "Toàn quyền, muốn cài gì hay đổi gì cũng được.",
  },
  {
    icon: "bolt",
    title: "Khởi tạo nhanh chóng",
    note: "Vài phút là có máy để bắt đầu làm việc.",
  },
  {
    icon: "tag",
    title: "Thường xuyên có ưu đãi",
    note: "Giá tốt theo từng đợt khuyến mãi.",
  },
];

export const ezyModules = [
  { icon: "website", label: "Website" },
  { icon: "cms", label: "Quản trị nội dung" },
  { icon: "database", label: "Cơ sở dữ liệu" },
  { icon: "cart", label: "Đăng & bán hàng" },
  { icon: "mail", label: "Gửi email" },
  { icon: "api", label: "API & MCP Server" },
  { icon: "plugin", label: "Marketplace plugin" },
];

export const ezyPillars = [
  {
    icon: "ai",
    title: "AI-ready + MCP Server",
    desc: "MCP Server nối AI thẳng vào dữ liệu thật, nên AI ghép được API cho từng màn hình: danh sách sản phẩm, giỏ hàng, thanh toán, tra cứu đơn.",
  },
  {
    icon: "flow",
    title: "Tự động hóa & marketing",
    desc: "Email tự gửi theo trạng thái đơn hàng. EzyMarketing lo chiến dịch, nhóm đối tượng và lịch chạy bằng cron.",
  },
  {
    icon: "plug",
    title: "Tích hợp dịch vụ ngoài",
    desc: "Đăng nhập, email, thanh toán, vận chuyển và Webhook đều có sẵn, bạn không phải tự viết lại từ đầu.",
  },
];

export const ezyIntegrations = [
  { name: "EzyLogin", services: "Google, Facebook" },
  { name: "EzyMail", services: "Gửi & nhận email" },
  { name: "EzyPayment", services: "VNPay, PayPal, Chuyển khoản" },
  { name: "EzyDelivery", services: "GHTK, Viettel Post" },
  { name: "Webhook", services: "Nối sang hệ thống khác" },
];

export const noCodeUseCases = [
  {
    title: "Website bán hàng",
    desc: "Sản phẩm, giỏ hàng, thanh toán VNPay/chuyển khoản, giao hàng GHTK/Viettel Post.",
    image: "/images/mockup-ecommerce.png",
    alt: "Mockup website bán hàng có giỏ hàng và thanh toán",
    icon: "store",
    tint: "0 67 236",
  },
  {
    title: "Landing page thu khách",
    desc: "Trang + form + tự gửi email khi có khách.",
    image: "/images/mockup-landing-page.png",
    alt: "Mockup landing page thu khách với form đăng ký",
    icon: "magnet",
    tint: "0 67 236",
  },
  {
    title: "Blog / Website doanh nghiệp",
    desc: "Đăng bài, quản lý nội dung, làm SEO.",
    image: "/images/mockup-business-blog.png",
    alt: "Mockup blog và website doanh nghiệp",
    icon: "news",
    tint: "0 67 236",
  },
  {
    title: "CRM mini / Công cụ nội bộ",
    desc: "Quản lý khách, đơn, quy trình nhỏ.",
    image: "/images/mockup-mini-crm.png",
    alt: "Mockup dashboard CRM mini và công cụ nội bộ",
    icon: "users",
    tint: "0 67 236",
  },
];

export const techUseCases = [
  {
    title: "Ra MVP trong ngày",
    desc: "Bỏ qua setup máy chủ, nhận brief sáng demo chiều.",
    image: "/images/mockup-mvp.png",
    alt: "Lập trình viên dựng MVP với AI, từ ý tưởng tới bản chạy thật",
    icon: "rocket",
    tint: "0 67 236",
  },
  {
    title: "Ghép API cho từng màn hình bằng AI",
    desc: "MCP Server kết nối AI với dữ liệu thật.",
    image: "/images/mockup-ai-api.png",
    alt: "AI ghép các màn hình với endpoint API và nguồn dữ liệu thật",
    icon: "screens",
    tint: "0 67 236",
  },
  {
    title: "Tự động hóa & marketing",
    desc: "Email tự động theo trạng thái đơn, chiến dịch chạy theo lịch.",
    image: "/images/mockup-automation.png",
    alt: "Luồng tự động hóa email, SMS và chiến dịch marketing",
    icon: "megaphone",
    tint: "0 67 236",
  },
];
