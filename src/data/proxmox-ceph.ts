export const proxmoxCephOptions = [
  {
    id: "doc-lap",
    name: "Proxmox VE độc lập",
    description:
      "Ảo hóa trên một máy chủ, tổ chức máy ảo và Linux container theo nhu cầu ứng dụng. Khởi đầu gọn, có kế hoạch sao lưu và mở rộng.",
    audience:
      "Doanh nghiệp nhỏ, môi trường phát triển hoặc hệ thống chấp nhận cửa sổ bảo trì.",
    image: "/images/vps/infrastructure-v4/cpu.webp",
    href: "#proxmox-ceph-option-doc-lap",
    featured: false,
    features: [
      "Khảo sát phần cứng và tài nguyên ứng dụng",
      "Cài Proxmox VE, cấu hình VM / LXC",
      "Thiết lập mạng và lưu trữ cục bộ",
      "Lập lịch backup, kiểm tra khôi phục",
    ],
  },
  {
    id: "cluster-ha",
    name: "Proxmox Cluster HA",
    description:
      "Kết nối nhiều node thành cụm quản trị tập trung. Thiết kế quorum, tài nguyên dự phòng và lưu trữ để cấu hình HA cho workload phù hợp.",
    audience:
      "Hệ thống cần phục hồi dịch vụ khi node gặp sự cố và chủ động bảo trì theo kế hoạch.",
    image: "/images/solutions/server-racks.webp",
    href: "#proxmox-ceph-option-cluster-ha",
    featured: false,
    features: [
      "Thiết kế cluster, quorum và mạng cụm",
      "Chọn lưu trữ và tài nguyên dự phòng",
      "Cấu hình HA theo nhóm máy ảo",
      "Kiểm thử failover và quy trình bảo trì",
    ],
  },
  {
    id: "hci-ceph",
    name: "Proxmox + Ceph HCI",
    description:
      "Kết hợp ảo hóa và lưu trữ phân tán trên cụm máy chủ. Thiết kế Ceph RBD, mạng lưu trữ và chính sách dữ liệu theo tải thực tế.",
    audience:
      "Hạ tầng nhiều node cần lưu trữ dùng chung và lộ trình mở rộng tài nguyên theo cụm.",
    image: "/images/solutions/giai-phap-private-cloud.jpg",
    href: "#proxmox-ceph-option-hci-ceph",
    featured: true,
    features: [
      "Khảo sát cụm từ 3 node cho mô hình HCI",
      "Quy hoạch OSD, pool và failure domain",
      "Thiết kế mạng và dư địa phục hồi Ceph",
      "Đo tải, thử sự cố và bàn giao vận hành",
    ],
  },
] as const;

export const proxmoxCephReasons = [
  {
    title: "Quản trị tập trung",
    text: "Tổ chức node, máy ảo và container trên giao diện quản trị Proxmox VE; phân quyền theo nhiệm vụ.",
  },
  {
    title: "VM & Linux container",
    text: "Chọn KVM cho máy ảo hoặc LXC cho Linux container theo yêu cầu hệ điều hành và ứng dụng.",
  },
  {
    title: "Lưu trữ theo workload",
    text: "Đối chiếu local storage, lưu trữ dùng chung hoặc Ceph với dung lượng, IOPS và khả năng vận hành.",
  },
  {
    title: "HA có điều kiện rõ ràng",
    text: "Thiết kế quorum, lưu trữ và tài nguyên dự phòng trước khi cấu hình cơ chế khởi động lại dịch vụ.",
  },
  {
    title: "Backup & Khôi phục",
    text: "Tách phương án sao lưu khỏi cơ chế nhân bản dữ liệu. Kiểm tra restore theo mục tiêu phục hồi.",
  },
  {
    title: "Bàn giao để vận hành",
    text: "Ghi nhận cấu hình cụm, cảnh báo và các bước bảo trì, thêm node hoặc xử lý sự cố thường gặp.",
  },
] as const;

export const proxmoxCephUseCases = [
  {
    image: "business",
    title: "ERP, CRM & Ứng dụng nội bộ",
    text: "Tổ chức các máy ảo phục vụ nghiệp vụ. Phân bổ CPU, RAM và lưu trữ theo mức độ quan trọng của từng ứng dụng.",
  },
  {
    image: "development",
    title: "Development & Staging",
    text: "Tạo môi trường thử nghiệm bằng VM hoặc LXC. Tách mạng, tài nguyên và quyền truy cập khỏi hệ thống production.",
  },
  {
    image: "website",
    title: "Website & Dịch vụ nhiều tầng",
    text: "Chia các tầng web, ứng dụng và dữ liệu thành nhóm máy ảo. Thiết kế mạng và backup theo luồng vận hành.",
  },
  {
    image: "database",
    title: "Hạ tầng lưu trữ phân tán",
    text: "Đánh giá Ceph cho lưu trữ dùng chung của cụm. Đo tải đọc ghi, dự trù dung lượng sau nhân bản và khi phục hồi.",
  },
  {
    image: "remote",
    title: "Chuyển đổi nền tảng ảo hóa",
    text: "Kiểm kê máy ảo, driver và phụ thuộc ứng dụng trước khi chuyển đổi. Chạy thử, xác nhận dữ liệu và chuẩn bị rollback.",
  },
  {
    image: "tools",
    title: "Cụm dịch vụ doanh nghiệp",
    text: "Làm nền cho nhiều nhóm dịch vụ trên hạ tầng riêng. Quy hoạch tài nguyên dự phòng, phân quyền và lịch bảo trì.",
  },
] as const;

export const proxmoxCephInfrastructure = [
  {
    id: "compute",
    title: "Thiết kế ",
    accent: "node & tài nguyên",
    text: "Kiểm tra CPU, RAM, ổ đĩa và khả năng tương thích. Phân bổ tài nguyên cho máy ảo, dịch vụ cụm và phần dự phòng khi một node dừng hoạt động.",
    image: "/images/solutions/server-racks.webp",
    benefits: ["CPU / RAM", "Dư địa dự phòng", "Khả năng mở rộng"],
  },
  {
    id: "storage",
    title: "Lựa chọn ",
    accent: "lưu trữ & Ceph",
    text: "Chọn local, shared storage hoặc Ceph theo yêu cầu. Với Ceph, quy hoạch OSD, pool, số bản sao và failure domain; dung lượng sử dụng không bằng tổng dung lượng ổ đĩa.",
    image: "/images/vps/infrastructure-v4/storage.webp",
    benefits: ["OSD / Pool", "Failure domain", "Dung lượng thực dùng"],
  },
  {
    id: "network",
    title: "Tách luồng ",
    accent: "mạng cụm & dữ liệu",
    text: "Quy hoạch luồng quản trị, Corosync, migration và storage. Đánh giá băng thông, độ trễ và đường dự phòng theo lưu lượng vận hành và phục hồi.",
    image: "/images/vps/infrastructure-v4/network.webp",
    benefits: ["Corosync", "Migration", "Storage network"],
  },
  {
    id: "recovery",
    title: "Kiểm thử ",
    accent: "HA, backup & restore",
    text: "Thử các tình huống đã thống nhất: dừng node, khôi phục máy ảo và bảo trì cụm. Bàn giao cảnh báo, tài liệu và trách nhiệm vận hành từng thành phần.",
    image: "/images/home/infrastructure/protection-monitoring.webp",
    benefits: ["Thử failover", "Kiểm tra restore", "Tài liệu vận hành"],
  },
] as const;

export const proxmoxCephComparison = [
  {
    criterion: "Kiến trúc",
    standalone: "Một máy chủ chạy Proxmox VE",
    cluster: "Nhiều node trong cụm, chọn lưu trữ phù hợp",
    ceph: "Cụm tích hợp ảo hóa và lưu trữ phân tán",
  },
  {
    criterion: "Lưu trữ",
    standalone: "Local storage theo phần cứng",
    cluster: "Shared storage hoặc phương án replication được đánh giá riêng",
    ceph: "Ceph RBD, pool và failure domain theo thiết kế",
  },
  {
    criterion: "Khi node gặp sự cố",
    standalone: "Cần khôi phục trên hạ tầng khả dụng",
    cluster: "HA khởi động lại workload khi đủ điều kiện",
    ceph: "HA và khả năng truy cập dữ liệu phụ thuộc cả quorum và trạng thái Ceph",
  },
  {
    criterion: "Yêu cầu vận hành",
    standalone: "Theo dõi host, tài nguyên và backup",
    cluster: "Thêm quorum, HA, mạng cụm và lưu trữ",
    ceph: "Thêm sức khỏe OSD, dung lượng và quá trình phục hồi",
  },
  {
    criterion: "Nhu cầu phù hợp",
    standalone: "Khởi đầu ảo hóa, dev/test, tải có thể bảo trì",
    cluster: "Quản trị tập trung và dự phòng theo dịch vụ",
    ceph: "Hạ tầng nhiều node cần lưu trữ dùng chung, mở rộng theo cụm",
  },
  {
    criterion: "Sao lưu",
    standalone: "Cần backup riêng và kiểm tra restore",
    cluster: "HA không thay thế backup",
    ceph: "Nhân bản Ceph không thay thế backup",
  },
] as const;

export const proxmoxCephSteps = [
  {
    title: "Khảo sát & Đo tải",
    text: "Kiểm kê máy chủ, máy ảo, dung lượng và ứng dụng. Thống nhất mục tiêu phục hồi, cửa sổ bảo trì và phạm vi công việc.",
  },
  {
    title: "Thiết kế kiến trúc",
    text: "Chọn mô hình node, storage, mạng, quorum và backup. Dự trù tài nguyên khi bảo trì hoặc phục hồi sau sự cố.",
  },
  {
    title: "Triển khai & Kiểm thử",
    text: "Cấu hình nền tảng, chuyển tải theo kế hoạch và thử HA, lưu trữ, restore. Đối chiếu tiêu chí nghiệm thu đã thống nhất.",
  },
  {
    title: "Bàn giao & Vận hành",
    text: "Bàn giao cấu hình, tài khoản theo phân quyền, hướng dẫn giám sát và quy trình bảo trì, mở rộng hoặc khôi phục.",
  },
] as const;

export const proxmoxCephFaq = [
  {
    question: "Proxmox VE và Ceph đảm nhiệm vai trò gì?",
    answer:
      "Proxmox VE là nền tảng quản trị ảo hóa, hỗ trợ máy ảo KVM và Linux container LXC. Ceph là hệ thống lưu trữ phân tán có thể tích hợp với Proxmox VE. Hai thành phần kết hợp trong mô hình HCI khi hạ tầng và nhu cầu phù hợp; không phải mọi triển khai Proxmox đều cần Ceph.",
  },
  {
    question: "Khi nào nên chọn một node, Cluster HA hoặc HCI?",
    answer:
      "Một node phù hợp khi cần khởi đầu ảo hóa và chấp nhận dừng dịch vụ để bảo trì. Cluster HA dành cho nhu cầu quản trị nhiều node và phục hồi workload theo thiết kế. HCI Proxmox + Ceph cần đánh giá thêm phần cứng, mạng, dung lượng và năng lực vận hành lưu trữ phân tán. Nên chọn theo tải và mục tiêu phục hồi thay vì chỉ theo số máy chủ.",
  },
  {
    question: "Cần bao nhiêu node để triển khai Proxmox + Ceph?",
    answer:
      "Tài liệu Proxmox hướng dẫn cụm HCI Proxmox + Ceph từ ít nhất ba máy chủ. Tuy nhiên, ba node không tự bảo đảm khả năng chịu lỗi hoặc đủ hiệu năng. Cần thiết kế quorum, MON, OSD, số bản sao, failure domain và tài nguyên còn lại khi một node dừng; cấu hình cuối cùng phụ thuộc tải thực tế.",
  },
  {
    question: "HA có bảo đảm ứng dụng không gián đoạn không?",
    answer:
      "Không. HA của Proxmox có thể khởi động lại máy ảo hoặc container trên node khả dụng khi điều kiện về quorum, lưu trữ và tài nguyên được đáp ứng. Vẫn có thời gian phát hiện sự cố và khởi động dịch vụ. Ứng dụng cần mức sẵn sàng cao hơn có thể cần cơ chế dự phòng ở tầng ứng dụng hoặc database.",
  },
  {
    question: "Nhân bản dữ liệu Ceph có thay thế backup không?",
    answer:
      "Không. Nhân bản phục vụ khả năng sẵn sàng của dữ liệu trong cụm, còn thao tác xóa nhầm hoặc lỗi ở tầng ứng dụng vẫn có thể ảnh hưởng dữ liệu đang dùng. Cần phương án backup tách biệt, lịch giữ bản sao và kiểm tra restore; có thể đánh giá Proxmox Backup Server theo phạm vi triển khai.",
  },
  {
    question: "Có bắt buộc dùng Ceph khi tạo Proxmox Cluster không?",
    answer:
      "Không. Proxmox VE hỗ trợ nhiều loại lưu trữ cục bộ, dùng chung và phân tán. Chọn Ceph khi lợi ích lưu trữ dùng chung và mở rộng phù hợp với chi phí phần cứng, mạng và vận hành. Cluster quản trị tập trung cũng không tự đồng nghĩa mọi máy ảo đã được cấu hình HA.",
  },
  {
    question:
      "Có thể chuyển máy ảo từ nền tảng đang sử dụng sang Proxmox không?",
    answer:
      "Cần kiểm tra nền tảng nguồn, định dạng đĩa, hệ điều hành khách, driver, license ứng dụng và kết nối mạng. Thực hiện thử với nhóm máy ảo đại diện, sao lưu trước khi chuyển đổi và chuẩn bị rollback. Thời gian dừng và cách di chuyển được thống nhất sau khảo sát, không mặc định chuyển đổi trực tiếp mà không gián đoạn.",
  },
  {
    question: "Live migration có áp dụng cho mọi máy ảo không?",
    answer:
      "Không. Khả năng di chuyển khi đang chạy phụ thuộc cấu hình CPU, thiết bị, loại lưu trữ và kết nối giữa các node. Các workload có PCI passthrough hoặc phụ thuộc thiết bị cục bộ cần được đánh giá riêng. Phải kiểm tra tương thích và thử nghiệm trước khi đưa migration vào quy trình bảo trì.",
  },
  {
    question: "Cần chuẩn bị thông tin gì trước khi triển khai?",
    answer:
      "Nên có cấu hình máy chủ, sơ đồ mạng, danh sách máy ảo, CPU/RAM đang dùng, dung lượng và tải đọc ghi, lịch backup, yêu cầu RPO/RTO và thời gian bảo trì có thể chấp nhận. Nếu đã có NAS, SAN hoặc hạ tầng ảo hóa, hãy cung cấp thông tin để đánh giá khả năng tận dụng.",
  },
  {
    question: "Chi phí, subscription và quản trị được tính như thế nào?",
    answer:
      "Phạm vi phụ thuộc số node, loại storage, mức độ chuyển đổi, yêu cầu HA, backup và trách nhiệm vận hành. Cần làm rõ phần cứng, công triển khai, subscription hỗ trợ hoặc repository khi cần và phí quản trị định kỳ. Liên hệ InterData để xác định các hạng mục trong phương án cụ thể; không mặc định mọi thành phần đều đã bao gồm.",
  },
] as const;
