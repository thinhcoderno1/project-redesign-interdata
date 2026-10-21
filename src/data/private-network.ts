export const privateNetworkOptions = [
  {
    id: "noi-bo",
    name: "Mạng nội bộ ứng dụng",
    description:
      "Kết nối các máy chủ trong một hệ thống để ứng dụng, database và dịch vụ nền giao tiếp qua mạng riêng.",
    audience:
      "Website, API và hệ thống có các thành phần cần trao đổi dữ liệu nội bộ.",
    image: "/images/vps/infrastructure-v4/network.webp",
    href: "#private-network-option-noi-bo",
    featured: false,
    features: [
      "Khảo sát máy chủ và kết nối hiện có",
      "Quy hoạch dải IP và subnet nội bộ",
      "Thiết lập luồng giao tiếp ứng dụng – dữ liệu",
      "Kiểm tra kết nối và bàn giao cấu hình",
    ],
  },
  {
    id: "phan-vung",
    name: "Phân vùng hệ thống",
    description:
      "Tổ chức các vùng ứng dụng, dữ liệu và quản trị. Kiểm soát luồng truy cập giữa các thành phần theo vai trò.",
    audience:
      "Doanh nghiệp cần tách môi trường production, staging hoặc các nhóm dịch vụ.",
    image: "/images/home/infrastructure/protection-monitoring.webp",
    href: "#private-network-option-phan-vung",
    featured: true,
    features: [
      "Thiết kế subnet theo vai trò hoặc môi trường",
      "Xây dựng ma trận truy cập giữa các vùng",
      "Phương án firewall, ACL và định tuyến",
      "Kiểm thử luồng cho phép và luồng bị chặn",
    ],
  },
  {
    id: "da-diem",
    name: "Kết nối đa điểm",
    description:
      "Lập phương án kết nối văn phòng, datacenter hoặc hạ tầng hiện có, phù hợp với đường truyền và thiết bị hai đầu.",
    audience:
      "Hệ thống có nhiều địa điểm hoặc cần kết nối giữa hạ tầng tại chỗ và máy chủ bên ngoài.",
    image: "/images/solutions/giai-phap-private-cloud.jpg",
    href: "#private-network-option-da-diem",
    featured: false,
    features: [
      "Khảo sát các điểm kết nối và dải IP",
      "Phương án site-to-site VPN/IPsec khi phù hợp",
      "Định tuyến và kiểm soát truy cập liên mạng",
      "Thống nhất kịch bản giám sát và bảo trì",
    ],
  },
] as const;

export const privateNetworkReasons = [
  {
    title: "Tách luồng nội bộ",
    text: "Tổ chức giao tiếp giữa ứng dụng, database và dịch vụ nền theo đường đi được xác định.",
  },
  {
    title: "Quy hoạch địa chỉ rõ ràng",
    text: "Lập IP plan để hạn chế trùng dải mạng và chuẩn bị cho việc kết nối thêm hệ thống.",
  },
  {
    title: "Phân vùng theo vai trò",
    text: "Tách vùng dữ liệu, ứng dụng và quản trị; xác định thành phần nào cần được liên lạc.",
  },
  {
    title: "Kiểm soát truy cập",
    text: "Thiết lập firewall hoặc ACL theo nguồn, đích và dịch vụ cần dùng, tránh mở kết nối quá rộng.",
  },
  {
    title: "Kiểm thử trước bàn giao",
    text: "Kiểm tra cả kết nối được cho phép và kết nối cần chặn theo sơ đồ đã thống nhất.",
  },
  {
    title: "Có cơ sở để vận hành",
    text: "Bàn giao sơ đồ, thông tin subnet, định tuyến và quy tắc truy cập để thuận tiện bảo trì.",
  },
] as const;

export const privateNetworkUseCases = [
  {
    image: "website",
    title: "Website & Database",
    text: "Tách luồng truy cập website khỏi kết nối tới database. Chỉ cho phép tầng ứng dụng truy cập các cổng dữ liệu cần thiết.",
  },
  {
    image: "development",
    title: "Development, Staging & Production",
    text: "Phân chia môi trường thử nghiệm và vận hành. Kiểm soát truy cập giữa các môi trường theo tài khoản và nhiệm vụ.",
  },
  {
    image: "business",
    title: "ERP, CRM & Hệ thống nội bộ",
    text: "Kết nối các thành phần của phần mềm nghiệp vụ. Xác định đường đi và chính sách cho người dùng, ứng dụng và quản trị viên.",
  },
  {
    image: "database",
    title: "Dữ liệu & Sao lưu",
    text: "Tổ chức luồng đồng bộ và sao lưu giữa các máy chủ. Xác định cửa sổ truyền dữ liệu, đích lưu trữ và quyền truy cập.",
  },
  {
    image: "remote",
    title: "Văn phòng & Datacenter",
    text: "Kết nối hệ thống tại văn phòng với máy chủ bên ngoài qua phương án định tuyến và bảo vệ lưu lượng phù hợp.",
  },
  {
    image: "tools",
    title: "Cụm dịch vụ & Container",
    text: "Lập mạng cho máy chủ ảo, container và dịch vụ nền. Đối chiếu khả năng của nền tảng, cổng mạng và chính sách triển khai.",
  },
] as const;

export const privateNetworkInfrastructure = [
  {
    id: "ip",
    title: "Quy hoạch ",
    accent: "dải IP & subnet",
    text: "Rà soát mạng đang dùng, tách subnet theo chức năng và dự trù không gian địa chỉ cho các hệ thống cần kết nối.",
    image: "/images/vps/infrastructure-v4/network.webp",
    benefits: ["IP plan", "Không chồng lấn", "Dự trù mở rộng"],
  },
  {
    id: "segments",
    title: "Phân vùng ",
    accent: "theo hệ thống",
    text: "Lựa chọn cách phân đoạn phù hợp với nền tảng, như VLAN hoặc các mạng ảo. Tách môi trường và giới hạn phạm vi giao tiếp.",
    image: "/images/solutions/server-racks.webp",
    benefits: ["Theo vai trò", "Theo môi trường", "Theo nền tảng"],
  },
  {
    id: "routing",
    title: "Kiểm soát ",
    accent: "truy cập & định tuyến",
    text: "Xác định nguồn, đích, cổng và chiều kết nối. Thống nhất firewall, route và phương án mã hóa cho các luồng cần bảo vệ.",
    image: "/images/home/infrastructure/protection-monitoring.webp",
    benefits: ["Firewall / ACL", "Routing", "Mã hóa theo luồng"],
  },
  {
    id: "handover",
    title: "Kiểm thử ",
    accent: "& bàn giao vận hành",
    text: "Đối chiếu kết quả với ma trận truy cập, ghi nhận cấu hình và thống nhất kịch bản thay đổi hoặc khôi phục khi cần.",
    image: "/images/vps/infrastructure-v4/datacenter.webp",
    benefits: ["Kiểm tra hai chiều", "Tài liệu cấu hình", "Kịch bản bảo trì"],
  },
] as const;

export const privateNetworkComparison = [
  {
    criterion: "Mục đích",
    private: "Giao tiếp nội bộ giữa các thành phần hệ thống",
    public: "Cung cấp dịch vụ hoặc truy cập qua Internet",
    vpn: "Tạo kết nối được bảo vệ giữa người dùng hoặc các mạng",
  },
  {
    criterion: "Đường đi",
    private: "Subnet và định tuyến theo thiết kế mạng riêng",
    public: "IP public, gateway và định tuyến Internet",
    vpn: "Tunnel giữa các điểm kết nối trên mạng nền",
  },
  {
    criterion: "Kiểm soát truy cập",
    private: "Firewall / ACL theo vùng và dịch vụ",
    public: "Firewall, xác thực ứng dụng và chính sách công bố dịch vụ",
    vpn: "Xác thực đầu kết nối và giới hạn mạng được truy cập",
  },
  {
    criterion: "Mã hóa",
    private: "Cần cấu hình bổ sung nếu yêu cầu bảo vệ dữ liệu truyền",
    public: "Dùng TLS hoặc cơ chế bảo vệ ở ứng dụng và kết nối",
    vpn: "Phụ thuộc giao thức và cấu hình; IPsec có thể bảo vệ lưu lượng IP",
  },
  {
    criterion: "Khi kết hợp",
    private: "Làm mạng nội bộ cho ứng dụng và dữ liệu",
    public: "Dùng cho các điểm cần phục vụ bên ngoài",
    vpn: "Dùng để truy cập hoặc nối các mạng riêng khi phù hợp",
  },
] as const;

export const privateNetworkSteps = [
  {
    title: "Khảo sát hệ thống",
    text: "Thu thập sơ đồ, IP hiện có, nền tảng máy chủ, các điểm kết nối và nhu cầu truy cập.",
  },
  {
    title: "Thiết kế phương án",
    text: "Thống nhất subnet, định tuyến, ma trận truy cập và phạm vi công việc cần triển khai.",
  },
  {
    title: "Cấu hình & Kiểm thử",
    text: "Thực hiện theo kế hoạch thay đổi, kiểm tra đường đi và các luồng được phép hoặc cần chặn.",
  },
  {
    title: "Bàn giao & Vận hành",
    text: "Bàn giao cấu hình, sơ đồ kết nối và hướng dẫn theo dõi, thay đổi hoặc khôi phục.",
  },
] as const;

export const privateNetworkFaq = [
  {
    question: "Private Network là gì?",
    answer:
      "Private Network là mạng được tổ chức cho giao tiếp nội bộ của một hệ thống hoặc tổ chức. Máy chủ, ứng dụng và dữ liệu kết nối theo dải địa chỉ, subnet, định tuyến và chính sách truy cập đã thiết kế. Phạm vi mạng riêng phụ thuộc nền tảng và cách triển khai.",
  },
  {
    question: "Private Network có đồng nghĩa với kết nối được mã hóa không?",
    answer:
      "Không. Phân tách mạng và mã hóa là hai cơ chế khác nhau. Khi cần bảo vệ dữ liệu trên đường truyền, phải lựa chọn cơ chế phù hợp như TLS ở ứng dụng hoặc IPsec cho kết nối giữa các điểm, đồng thời quản lý khóa và quyền truy cập.",
  },
  {
    question: "Mạng riêng khác VPN như thế nào?",
    answer:
      "Mạng riêng mô tả cách tổ chức và giới hạn giao tiếp trong hệ thống. VPN là một cách tạo kết nối giữa người dùng hoặc các mạng qua hạ tầng truyền dẫn. Hai giải pháp có thể kết hợp: các máy chủ dùng mạng nội bộ, còn văn phòng kết nối tới mạng đó qua VPN phù hợp.",
  },
  {
    question: "Máy chủ có IP private có truy cập Internet được không?",
    answer:
      "Có thể, nếu có đường ra được cấu hình, chẳng hạn gateway hoặc NAT cùng quy tắc firewall phù hợp. Việc dùng địa chỉ private không tự tạo đường ra Internet và cũng không tự mở truy cập từ Internet vào máy chủ.",
  },
  {
    question: "Có thể kết nối các máy chủ đang sử dụng không?",
    answer:
      "Cần kiểm tra nền tảng, vị trí, cổng mạng, quyền cấu hình và các dải IP đang dùng. Khả năng kết nối không giống nhau giữa VPS, máy chủ vật lý và từng môi trường ảo hóa. Nên gửi sơ đồ hiện tại để chọn phương án ít ảnh hưởng đến ứng dụng.",
  },
  {
    question: "Kết nối hai datacenter có phải chỉ cần cùng một dải IP không?",
    answer:
      "Không. Cần thiết kế đường truyền, định tuyến hoặc cơ chế kết nối phù hợp; phải xử lý dải địa chỉ chồng lấn, MTU và chính sách truy cập. Không nên giả định mạng Layer 2 tự kéo dài giữa hai địa điểm chỉ vì dùng chung dải địa chỉ.",
  },
  {
    question:
      "Làm thế nào để tránh trùng dải IP khi nối văn phòng với datacenter?",
    answer:
      "Lập danh sách các dải mạng của từng bên trước khi kết nối. Đối chiếu subnet đang dùng, chọn dải không chồng lấn và thống nhất phương án đổi địa chỉ hoặc xử lý định tuyến nếu hệ thống hiện tại có xung đột. Các dải IPv4 private thường dùng được quy định trong RFC 1918.",
  },
  {
    question: "Triển khai có làm gián đoạn ứng dụng không?",
    answer:
      "Ảnh hưởng tùy vào thay đổi cổng mạng, route, firewall và cách ứng dụng sử dụng địa chỉ IP. Cần đánh giá trước, chọn cửa sổ bảo trì nếu cần, sao lưu cấu hình và chuẩn bị phương án khôi phục. Không mặc định mọi thay đổi đều thực hiện được mà không gián đoạn.",
  },
  {
    question: "Cần chuẩn bị thông tin gì để nhận tư vấn?",
    answer:
      "Nên chuẩn bị số lượng và vị trí máy chủ, nền tảng đang sử dụng, sơ đồ mạng, dải IP, danh sách dịch vụ cần kết nối, yêu cầu bảo mật, lưu lượng dự kiến và lịch triển khai mong muốn. Nếu có ma trận nguồn – đích – cổng, hãy gửi kèm để xác định phạm vi nhanh hơn.",
  },
  {
    question: "Chi phí và phạm vi quản trị được xác định như thế nào?",
    answer:
      "Chi phí phụ thuộc kiến trúc, số điểm kết nối, khả năng của hạ tầng, thiết bị hoặc giấy phép cần dùng và phạm vi vận hành. Liên hệ InterData để thống nhất công việc triển khai, phần hạ tầng đi kèm và trách nhiệm quản trị trước khi nhận phương án cụ thể.",
  },
] as const;
