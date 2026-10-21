export const vmwareOptions = [
  {
    id: "vsphere",
    name: "vSphere cơ bản",
    description:
      "Khởi đầu ảo hóa trên một host hoặc nhóm host theo nhu cầu. Tổ chức máy ảo, mạng và datastore, kết hợp quản trị tập trung bằng vCenter khi phù hợp với phạm vi và bản quyền.",
    audience:
      "Doanh nghiệp cần hợp nhất máy chủ, chuẩn hóa máy ảo và quy trình quản trị ban đầu.",
    image: "/images/vps/infrastructure-v4/cpu.webp",
    href: "#vmware-option-vsphere",
    featured: false,
    features: [
      "Khảo sát phần cứng, workload và quyền sử dụng",
      "Cài host, cấu hình mạng và datastore",
      "Tổ chức máy ảo, template và phân quyền",
      "Thống nhất backup, restore và bàn giao",
    ],
  },
  {
    id: "cluster-ha",
    name: "Cluster HA / vMotion",
    description:
      "Thiết kế cụm vSphere cho quản trị nhiều host, dự phòng máy ảo và bảo trì theo kế hoạch. Đánh giá điều kiện HA, vMotion và tài nguyên còn lại khi một host dừng hoạt động.",
    audience:
      "Hệ thống cần phục hồi máy ảo khi host gặp sự cố và chủ động di chuyển workload để bảo trì.",
    image: "/images/solutions/server-racks.webp",
    href: "#vmware-option-cluster-ha",
    featured: false,
    features: [
      "Thiết kế cluster và quản trị qua vCenter",
      "Đánh giá CPU, mạng và lưu trữ cho vMotion",
      "Cấu hình HA và dự phòng theo quyền sử dụng",
      "Kiểm thử failover, migration và bảo trì",
    ],
  },
  {
    id: "vsan-hci",
    name: "HCI với vSAN",
    description:
      "Kết hợp tài nguyên ảo hóa với lưu trữ vSAN theo kiến trúc phù hợp. Quy hoạch phần cứng, mạng, storage policy và miền lỗi trước khi đưa máy ảo vào vận hành.",
    audience:
      "Hạ tầng nhiều host cần lưu trữ dùng chung và lộ trình mở rộng theo cụm.",
    image: "/images/solutions/giai-phap-private-cloud.jpg",
    href: "#vmware-option-vsan-hci",
    featured: true,
    features: [
      "Đối chiếu cấu hình với Compatibility Guide",
      "Thiết kế mạng vSAN và storage policy",
      "Tính dung lượng thực dùng, dư địa phục hồi",
      "Thử sự cố, bảo trì và bàn giao runbook",
    ],
  },
] as const;

export const vmwareReasons = [
  {
    title: "Quản trị theo hệ thống",
    text: "Tổ chức host, máy ảo và quyền truy cập theo nhóm dịch vụ. Dùng vCenter để quản trị tập trung khi thuộc phạm vi triển khai.",
  },
  {
    title: "Chuẩn hóa máy ảo",
    text: "Xây dựng cấu hình máy ảo và template theo ứng dụng. Kiểm soát tài nguyên, mạng và cách cấp phát cho từng nhóm dịch vụ.",
  },
  {
    title: "Lưu trữ theo workload",
    text: "Đối chiếu local datastore, NAS / SAN hoặc vSAN với dung lượng, tải đọc ghi và khả năng vận hành của đội ngũ.",
  },
  {
    title: "HA có điều kiện rõ ràng",
    text: "Thiết kế tài nguyên dự phòng, đường truy cập storage và quy tắc khởi động lại máy ảo trước khi bật cơ chế HA.",
  },
  {
    title: "Bảo trì có kế hoạch",
    text: "Kiểm tra điều kiện di chuyển máy ảo, khả năng tương thích CPU và kết nối trước khi đưa vMotion vào quy trình bảo trì.",
  },
  {
    title: "Phục hồi có kiểm thử",
    text: "Thống nhất cách sao lưu máy ảo, cấu hình quản trị và dữ liệu. Thử restore, bàn giao tài liệu và trách nhiệm vận hành.",
  },
] as const;

export const vmwareUseCases = [
  {
    image: "business",
    title: "ERP, CRM & Dịch vụ nội bộ",
    text: "Tổ chức máy ảo theo nhóm nghiệp vụ. Phân bổ CPU, RAM và datastore theo tải, mức độ quan trọng và phụ thuộc ứng dụng.",
  },
  {
    image: "website",
    title: "Website, API & Database",
    text: "Tách các tầng web, ứng dụng và dữ liệu thành nhóm máy ảo. Thiết kế mạng, quyền truy cập và backup theo luồng vận hành.",
  },
  {
    image: "development",
    title: "Development & Staging",
    text: "Chuẩn hóa môi trường thử nghiệm bằng template. Giới hạn tài nguyên và tách quyền quản trị khỏi hệ thống production.",
  },
  {
    image: "remote",
    title: "Hợp nhất máy chủ",
    text: "Kiểm kê máy chủ và ứng dụng trước khi chuyển sang máy ảo. Chạy thử, xác nhận dữ liệu và chuẩn bị phương án quay lại khi cần.",
  },
  {
    image: "database",
    title: "Hạ tầng HCI & Lưu trữ",
    text: "Đánh giá vSAN khi cần lưu trữ dùng chung theo cụm. Tính dung lượng sau áp dụng policy và khả năng phục hồi theo miền lỗi.",
  },
  {
    image: "tools",
    title: "Bảo trì & Mở rộng cụm",
    text: "Lập kế hoạch di chuyển máy ảo, thêm host hoặc nâng cấp. Đối chiếu tương thích, tài nguyên dự phòng và cửa sổ bảo trì.",
  },
] as const;

export const vmwareInfrastructure = [
  {
    id: "compute",
    title: "Đối chiếu ",
    accent: "host & tài nguyên",
    text: "Rà soát CPU, RAM, NIC, controller và firmware theo nền tảng được chọn. Phân bổ tài nguyên cho máy ảo, lớp quản trị và phần dự phòng khi một host ngừng hoạt động.",
    image: "/images/solutions/server-racks.webp",
    benefits: ["CPU / RAM", "Tương thích phần cứng", "Dư địa dự phòng"],
  },
  {
    id: "network",
    title: "Quy hoạch ",
    accent: "mạng & quản trị",
    text: "Tách và kiểm thử luồng quản trị, máy ảo, vMotion và storage theo thiết kế. Thống nhất VLAN, uplink, DNS, đồng bộ thời gian và quyền truy cập vCenter.",
    image: "/images/vps/infrastructure-v4/network.webp",
    benefits: ["VLAN / Uplink", "vMotion network", "Phân quyền vCenter"],
  },
  {
    id: "storage",
    title: "Thiết kế ",
    accent: "datastore & vSAN",
    text: "Lựa chọn NAS / SAN, datastore cục bộ hoặc vSAN theo phạm vi. Với vSAN, kiểm tra cấu hình được hỗ trợ, storage policy, failure domain và dung lượng cần để phục hồi.",
    image: "/images/vps/infrastructure-v4/storage.webp",
    benefits: ["Datastore", "Storage policy", "Failure domain"],
  },
  {
    id: "recovery",
    title: "Kiểm thử ",
    accent: "HA, backup & restore",
    text: "Thử failover, di chuyển máy ảo và khôi phục dữ liệu theo kịch bản đã thống nhất. Bàn giao cấu hình, cảnh báo và hướng dẫn bảo trì phù hợp với quyền sử dụng hiện có.",
    image: "/images/home/infrastructure/protection-monitoring.webp",
    benefits: ["Thử failover", "Kiểm tra restore", "Runbook vận hành"],
  },
] as const;

export const vmwareComparison = [
  {
    criterion: "Mục tiêu",
    foundation: "Khởi đầu ảo hóa và chuẩn hóa máy ảo",
    cluster: "Quản trị cụm, dự phòng và bảo trì máy ảo",
    hci: "Ảo hóa kết hợp lưu trữ dùng chung theo cụm",
  },
  {
    criterion: "Kiến trúc",
    foundation: "Một host hoặc nhóm host theo phạm vi",
    cluster: "Cluster vSphere quản trị qua vCenter",
    hci: "Cụm host và kiến trúc vSAN được đánh giá riêng",
  },
  {
    criterion: "Lưu trữ",
    foundation: "Datastore theo hạ tầng hiện có",
    cluster: "Storage cho phép host đích truy cập dữ liệu theo thiết kế",
    hci: "vSAN với policy, miền lỗi và dư địa phục hồi",
  },
  {
    criterion: "Dự phòng & Bảo trì",
    foundation: "Khôi phục theo phương án backup và hạ tầng khả dụng",
    cluster: "HA và vMotion khi đủ điều kiện kỹ thuật, bản quyền",
    hci: "Kết hợp dự phòng compute và khả năng chịu lỗi của storage",
  },
  {
    criterion: "Kiểm thử bàn giao",
    foundation: "Cấu hình máy ảo, truy cập và restore",
    cluster: "Thêm failover, migration và tài nguyên dự phòng",
    hci: "Thêm tình huống lỗi storage, resync và bảo trì vSAN",
  },
  {
    criterion: "Bản quyền",
    foundation: "Đối chiếu phiên bản, tính năng và quyền sử dụng",
    cluster: "Kiểm tra quyền dùng vCenter, HA và vMotion",
    hci: "Kiểm tra thêm quyền sử dụng và dung lượng vSAN",
  },
] as const;

export const vmwareSteps = [
  {
    title: "Khảo sát & Kiểm kê",
    text: "Thu thập phần cứng, máy ảo, tải ứng dụng và quyền sử dụng hiện có. Làm rõ mục tiêu phục hồi và cửa sổ bảo trì.",
  },
  {
    title: "Thiết kế phương án",
    text: "Thống nhất host, vCenter, network, datastore và backup. Đánh giá HA, vMotion hoặc vSAN theo nhu cầu và điều kiện áp dụng.",
  },
  {
    title: "Triển khai & Kiểm thử",
    text: "Cấu hình hạ tầng, chuyển tải theo kế hoạch và thử các kịch bản đã thống nhất. Đối chiếu kết quả với tiêu chí nghiệm thu.",
  },
  {
    title: "Bàn giao & Vận hành",
    text: "Bàn giao cấu hình, tài khoản theo phân quyền và tài liệu. Hướng dẫn theo dõi, bảo trì, mở rộng và khôi phục hệ thống.",
  },
] as const;

export const vmwareFaq = [
  {
    question: "vSphere, vCenter và vSAN có vai trò gì?",
    answer:
      "vSphere cung cấp nền tảng ảo hóa để chạy máy ảo trên host. vCenter hỗ trợ quản trị tập trung nhiều host và các tính năng cụm theo quyền sử dụng. vSAN cung cấp lưu trữ được định nghĩa bằng phần mềm, tích hợp với hạ tầng vSphere. Không phải phương án VMware nào cũng cần vSAN hoặc bao gồm mọi thành phần.",
  },
  {
    question: "Nên chọn vSphere cơ bản, Cluster HA hay HCI với vSAN?",
    answer:
      "vSphere cơ bản phù hợp khi cần chuẩn hóa máy ảo và quản trị ban đầu. Cluster HA / vMotion dành cho nhu cầu dự phòng host và bảo trì có kế hoạch. HCI với vSAN cần đánh giá thêm phần cứng, mạng, policy dữ liệu và năng lực vận hành storage. Nên chọn theo workload, hạ tầng hiện có và mục tiêu phục hồi.",
  },
  {
    question: "vSphere HA có bảo đảm máy ảo không gián đoạn không?",
    answer:
      "Không. Khi host gặp sự cố, vSphere HA có thể khởi động lại máy ảo trên host khả dụng nếu đáp ứng điều kiện lưu trữ, kết nối và tài nguyên. Vẫn có thời gian phát hiện lỗi và khởi động máy ảo. Ứng dụng cần mức sẵn sàng cao hơn có thể cần dự phòng ở tầng ứng dụng hoặc database; HA cũng không thay thế backup.",
  },
  {
    question: "HA và vMotion khác nhau như thế nào?",
    answer:
      "HA xử lý việc phục hồi máy ảo trong các tình huống sự cố được hỗ trợ. vMotion phục vụ di chuyển máy ảo đang chạy giữa các host khi đáp ứng điều kiện tương thích, mạng, lưu trữ và quyền sử dụng. vMotion thường được dùng cho bảo trì có kế hoạch, không thay cho cơ chế khôi phục sau khi host nguồn đã dừng đột ngột.",
  },
  {
    question: "Có thể dùng vMotion cho mọi máy ảo không?",
    answer:
      "Cần kiểm tra CPU của các host, cấu hình và thiết bị máy ảo, đường mạng cũng như lưu trữ của từng tình huống di chuyển. EVC có thể giúp quản lý khác biệt tập tính năng CPU trong phạm vi được hỗ trợ, nhưng không khắc phục mọi vấn đề tương thích. Máy ảo phụ thuộc thiết bị cục bộ hoặc passthrough cần được đánh giá riêng và chạy thử.",
  },
  {
    question: "Có bắt buộc dùng vSAN khi tạo cluster VMware không?",
    answer:
      "Không. Có thể thiết kế datastore trên NAS / SAN hoặc giải pháp lưu trữ phù hợp khác. Khi chọn vSAN, cần kiểm tra phần cứng, driver và firmware được hỗ trợ, kiến trúc storage, mạng và policy dữ liệu. Số host, witness nếu cần và khả năng chịu lỗi được xác định theo topology, không dùng một cấu hình cố định cho mọi hệ thống.",
  },
  {
    question: "vSAN và snapshot máy ảo có thay thế backup không?",
    answer:
      "Không. Khả năng chịu lỗi của storage và snapshot phục vụ các mục đích khác với bản sao lưu độc lập. Cần phương án backup cho máy ảo, dữ liệu ứng dụng và cấu hình quản trị, kèm lịch giữ bản sao và kiểm tra restore. RPO/RTO phải được xác định theo ứng dụng và kiểm chứng qua kịch bản khôi phục.",
  },
  {
    question: "Có thể tận dụng máy chủ hoặc chuyển máy ảo đang dùng không?",
    answer:
      "Cần đối chiếu phần cứng, phiên bản, driver, firmware, định dạng máy ảo và các phụ thuộc ứng dụng. Nếu chuyển từ nền tảng khác, phải đánh giá công cụ và đường chuyển đổi được hỗ trợ. Nên thử với nhóm máy ảo đại diện, sao lưu dữ liệu và chuẩn bị rollback trước khi chuyển tải chính thức; không mặc định không có thời gian dừng.",
  },
  {
    question: "Cần cung cấp thông tin gì trước khi triển khai?",
    answer:
      "Nên chuẩn bị cấu hình host, sơ đồ mạng và storage, danh sách máy ảo, tải CPU/RAM, dung lượng và tải đọc ghi, phiên bản nền tảng, thông tin quyền sử dụng và lịch backup. Bổ sung yêu cầu bảo mật, RPO/RTO, cửa sổ bảo trì và trách nhiệm vận hành để xác định phạm vi công việc.",
  },
  {
    question:
      "Phương án có bao gồm bản quyền VMware và quản trị định kỳ không?",
    answer:
      "Các hạng mục phải được làm rõ trong phương án cụ thể: phần cứng, công triển khai, quyền sử dụng phần mềm, hỗ trợ của hãng và quản trị định kỳ. Tính năng phụ thuộc phiên bản, gói sản phẩm và entitlement hiện hành. Liên hệ InterData để đối chiếu nhu cầu với quyền sử dụng hiện có; không mặc định bản quyền hoặc hỗ trợ trọn gói đã bao gồm.",
  },
] as const;
