export const kubernetesOptions = [
  {
    id: "dev-staging",
    name: "K8s Dev / Staging",
    description:
      "Xây dựng môi trường phát triển và kiểm thử container. Chuẩn hóa manifest, cấu hình truy cập và quy trình đưa ứng dụng lên Kubernetes trước khi vận hành production.",
    audience:
      "Đội phát triển cần thử nghiệm ứng dụng, pipeline và cách vận hành Kubernetes.",
    image: "/images/vps/infrastructure-v4/cpu.webp",
    href: "#kubernetes-option-dev-staging",
    featured: false,
    features: [
      "Khảo sát ứng dụng và môi trường hiện có",
      "Thiết lập cluster phục vụ dev / staging",
      "Tổ chức namespace, RBAC và triển khai mẫu",
      "Bàn giao manifest và hướng dẫn sử dụng",
    ],
  },
  {
    id: "production",
    name: "Production Cluster",
    description:
      "Đưa ứng dụng container vào vận hành với kiến trúc cluster, kết nối dịch vụ và lưu trữ được thiết kế theo tải. Xác định rõ yêu cầu dự phòng và trách nhiệm quản trị.",
    audience:
      "Website, API và dịch vụ doanh nghiệp cần một nền tảng triển khai container có quy trình.",
    image: "/images/solutions/server-racks.webp",
    href: "#kubernetes-option-production",
    featured: false,
    features: [
      "Quy hoạch control plane và worker",
      "Chọn CNI, công bố dịch vụ và TLS",
      "Thiết kế storage, backup và quan sát hệ thống",
      "Kiểm thử triển khai, cập nhật và khôi phục",
    ],
  },
  {
    id: "production-ha",
    name: "Production HA",
    description:
      "Thiết kế control plane dự phòng và phân bố workload theo khả năng chịu lỗi. Đánh giá cả đường truy cập, storage, dữ liệu và tài nguyên còn lại khi có sự cố.",
    audience:
      "Hệ thống cần giảm điểm lỗi đơn và có kịch bản bảo trì, phục hồi được kiểm thử.",
    image: "/images/solutions/giai-phap-private-cloud.jpg",
    href: "#kubernetes-option-production-ha",
    featured: true,
    features: [
      "Thiết kế control plane, etcd và API endpoint HA",
      "Phân bố workload và tài nguyên dự phòng",
      "Thống nhất backup, RPO / RTO và cảnh báo",
      "Thử sự cố, bảo trì và bàn giao runbook",
    ],
  },
] as const;

export const kubernetesReasons = [
  {
    title: "Điều phối theo khai báo",
    text: "Tổ chức workload bằng manifest, xác định trạng thái mong muốn và quy trình cập nhật ứng dụng theo phiên bản.",
  },
  {
    title: "Tách môi trường rõ ràng",
    text: "Tổ chức namespace và phân quyền theo đội nhóm. Kết hợp chính sách mạng và bảo mật theo yêu cầu hệ thống.",
  },
  {
    title: "Mở rộng có cơ sở",
    text: "Đánh giá requests, limits và chỉ số tải trước khi cấu hình autoscaling; đối chiếu tài nguyên thực có của cluster.",
  },
  {
    title: "Thiết kế theo khả năng chịu lỗi",
    text: "Xem xét control plane, worker, đường truy cập và lưu trữ cùng nhau; phân bố workload theo miền lỗi phù hợp.",
  },
  {
    title: "Theo dõi để vận hành",
    text: "Thống nhất metrics, log và cảnh báo cần theo dõi. Chọn công cụ theo phạm vi thay vì mặc định cluster đã có đủ.",
  },
  {
    title: "Khôi phục có kiểm thử",
    text: "Tách kế hoạch sao lưu cấu hình, etcd và dữ liệu ứng dụng. Kiểm tra restore cùng quy trình bảo trì trước bàn giao.",
  },
] as const;

export const kubernetesUseCases = [
  {
    image: "website",
    title: "Website, API & Microservices",
    text: "Tổ chức các dịch vụ container, kết nối nội bộ và điểm truy cập bên ngoài. Thiết kế health check và cập nhật theo cách ứng dụng hoạt động.",
  },
  {
    image: "development",
    title: "Development & Staging",
    text: "Chuẩn hóa manifest và môi trường kiểm thử. Phân quyền, giới hạn tài nguyên và kiểm tra pipeline trước khi đưa ứng dụng lên production.",
  },
  {
    image: "business",
    title: "Ứng dụng nghiệp vụ",
    text: "Đánh giá khả năng container hóa của ERP, CRM hoặc dịch vụ nội bộ. Xác định cấu hình, secret và các hệ thống phụ thuộc trước triển khai.",
  },
  {
    image: "database",
    title: "Workload có dữ liệu",
    text: "Lựa chọn storage, cơ chế gắn volume và phương án backup theo ứng dụng. Kiểm tra độ bền dữ liệu, khôi phục và vận hành stateful workload.",
  },
  {
    image: "remote",
    title: "Đội nhóm & Nhiều môi trường",
    text: "Thiết kế quyền truy cập và phân tách môi trường. Chọn namespace hoặc cluster riêng theo mức độ cách ly và yêu cầu quản trị.",
  },
  {
    image: "tools",
    title: "CI/CD & Xử lý tác vụ",
    text: "Kết nối quy trình build, registry và triển khai theo phạm vi. Tổ chức Job, CronJob hoặc worker xử lý nền với tài nguyên phù hợp.",
  },
] as const;

export const kubernetesInfrastructure = [
  {
    id: "cluster",
    title: "Quy hoạch ",
    accent: "control plane & worker",
    text: "Chọn topology theo workload, tài nguyên và yêu cầu phục hồi. Với HA, thiết kế API endpoint, quorum etcd và miền lỗi; nhiều worker không tự làm control plane có dự phòng.",
    image: "/images/solutions/server-racks.webp",
    benefits: ["Control plane", "Worker nodes", "Failure domain"],
  },
  {
    id: "network",
    title: "Kết nối ",
    accent: "dịch vụ & truy cập",
    text: "Đánh giá CNI, DNS, dải mạng và đường công bố dịch vụ. Lựa chọn Gateway hoặc Ingress theo nền tảng, cấu hình TLS và NetworkPolicy với plugin hỗ trợ thực thi.",
    image: "/images/vps/infrastructure-v4/network.webp",
    benefits: ["CNI / DNS", "Gateway / Ingress", "TLS / NetworkPolicy"],
  },
  {
    id: "storage",
    title: "Thiết kế ",
    accent: "storage & dữ liệu",
    text: "Đối chiếu CSI, StorageClass và PVC với ứng dụng. Làm rõ access mode, hiệu năng, khả năng phục hồi của storage và cách sao lưu dữ liệu bên ngoài vòng đời Pod.",
    image: "/images/vps/infrastructure-v4/storage.webp",
    benefits: ["CSI / PVC", "Dữ liệu ứng dụng", "Backup / Restore"],
  },
  {
    id: "operations",
    title: "Chuẩn bị ",
    accent: "bảo mật & vận hành",
    text: "Thống nhất RBAC, quản lý secret, quan sát hệ thống và kế hoạch nâng cấp. Kiểm thử triển khai, khôi phục và bàn giao cấu hình cùng trách nhiệm vận hành.",
    image: "/images/home/infrastructure/protection-monitoring.webp",
    benefits: ["RBAC / Secret", "Metrics / Log", "Runbook vận hành"],
  },
] as const;

export const kubernetesComparison = [
  {
    criterion: "Mục tiêu",
    development: "Phát triển, thử nghiệm ứng dụng và pipeline",
    production: "Vận hành dịch vụ theo kiến trúc đã thống nhất",
    ha: "Giảm điểm lỗi đơn, kiểm thử khả năng phục hồi",
  },
  {
    criterion: "Control plane",
    development: "Theo quy mô môi trường thử nghiệm",
    production: "Chọn topology theo mức độ quan trọng của dịch vụ",
    ha: "Dự phòng nhiều node, API endpoint và quorum etcd",
  },
  {
    criterion: "Workload & Tài nguyên",
    development: "Ưu tiên kiểm thử chức năng và cấu hình",
    production: "Requests / limits, replica và kiểm tra cập nhật",
    ha: "Thêm phân bố theo miền lỗi và tài nguyên dự phòng",
  },
  {
    criterion: "Network & Storage",
    development: "Phục vụ kết nối và kiểm thử dữ liệu",
    production: "CNI, truy cập dịch vụ, CSI và backup theo ứng dụng",
    ha: "Đánh giá dự phòng cả đường truy cập và lưu trữ",
  },
  {
    criterion: "Kiểm thử bàn giao",
    development: "Triển khai mẫu và hướng dẫn sử dụng",
    production: "Cập nhật ứng dụng, theo dõi và khôi phục",
    ha: "Thêm kịch bản sự cố, bảo trì và tiêu chí RPO / RTO",
  },
  {
    criterion: "Phạm vi quản trị",
    development: "Thống nhất tài khoản và trách nhiệm sử dụng",
    production: "Làm rõ phần cluster, ứng dụng và dữ liệu",
    ha: "Thêm quy trình phản ứng, cảnh báo và bảo trì cụm",
  },
] as const;

export const kubernetesSteps = [
  {
    title: "Khảo sát workload",
    text: "Kiểm kê ứng dụng, image, lưu trữ và kết nối. Làm rõ nhu cầu mở rộng, bảo mật và mục tiêu phục hồi.",
  },
  {
    title: "Thiết kế cluster",
    text: "Thống nhất control plane, worker, CNI, storage, đường truy cập và kế hoạch backup theo phạm vi.",
  },
  {
    title: "Triển khai & Kiểm thử",
    text: "Cấu hình cluster, đưa ứng dụng mẫu vào chạy và thử cập nhật, kết nối, cảnh báo, khôi phục theo tiêu chí nghiệm thu.",
  },
  {
    title: "Bàn giao & Vận hành",
    text: "Bàn giao manifest, quyền truy cập và tài liệu. Hướng dẫn theo dõi, bảo trì, nâng cấp và xử lý tình huống đã thống nhất.",
  },
] as const;

export const kubernetesFaq = [
  {
    question: "Kubernetes (K8s) dùng để làm gì?",
    answer:
      "Kubernetes là nền tảng điều phối ứng dụng container theo trạng thái mong muốn. Control plane quản lý trạng thái cluster, còn worker chạy workload. Giải pháp triển khai cần kết hợp hạ tầng, mạng, lưu trữ và cách vận hành ứng dụng; cài cluster mới là một phần của công việc.",
  },
  {
    question:
      "Khi nào nên dùng Kubernetes thay vì chạy container trên một máy chủ?",
    answer:
      "Kubernetes phù hợp khi có nhiều dịch vụ, cần chuẩn hóa triển khai hoặc quản lý workload trên nhiều node. Với ứng dụng nhỏ, ít thay đổi và đội ngũ vận hành hạn chế, chạy container trên một máy chủ có thể đơn giản hơn. Nên đối chiếu nhu cầu mở rộng, độ phức tạp và chi phí vận hành trước khi chọn.",
  },
  {
    question: "Cluster HA có bảo đảm ứng dụng không gián đoạn không?",
    answer:
      "Không. Dự phòng control plane giúp giảm phụ thuộc vào một node quản trị, nhưng tính sẵn sàng của ứng dụng còn phụ thuộc replica, cách phân bố Pod, health check, đường truy cập và dữ liệu. Cần thử sự cố và xác định mục tiêu phục hồi cho từng dịch vụ thay vì coi HA của cluster là cam kết không gián đoạn.",
  },
  {
    question: "Cần bao nhiêu node để xây dựng control plane HA?",
    answer:
      "Số node phụ thuộc topology. Với mô hình kubeadm stacked etcd, tài liệu Kubernetes yêu cầu tối thiểu ba control-plane node để có HA và bảo đảm quorum; topology dùng etcd ngoài có yêu cầu riêng cho từng lớp. Số worker và tài nguyên dự phòng cần được tính tiếp theo workload, không lấy số node quản trị làm giới hạn cho cả hệ thống.",
  },
  {
    question: "Kubernetes có tự tăng tài nguyên khi tải cao không?",
    answer:
      "Cần cấu hình cơ chế phù hợp. Horizontal Pod Autoscaler điều chỉnh số replica theo metrics và chính sách, nhưng không tự tạo thêm máy chủ. Việc mở rộng node cần giải pháp riêng và khả năng hỗ trợ của hạ tầng. Requests, limits, nguồn metrics và tài nguyên còn lại phải được kiểm tra để autoscaling hoạt động như mong muốn.",
  },
  {
    question: "Database và dữ liệu lâu dài nên đặt ở đâu?",
    answer:
      "Có thể đánh giá chạy database bên ngoài cluster hoặc chạy stateful workload với storage phù hợp. PersistentVolume giúp quản lý lưu trữ ngoài vòng đời Pod, nhưng không tự bảo đảm backup hay khả năng chịu lỗi của hệ thống lưu trữ. Cần chọn CSI, access mode, cách sao lưu và kiểm tra khôi phục theo đặc thù dữ liệu.",
  },
  {
    question: "Namespace có đủ để cách ly các đội nhóm không?",
    answer:
      "Namespace giúp tổ chức tài nguyên, nhưng mức độ cách ly phụ thuộc thêm RBAC, chính sách mạng, bảo mật Pod và cấu hình nền tảng. NetworkPolicy cần CNI hỗ trợ thực thi. Với yêu cầu cách ly cao, có thể cần cluster riêng hoặc biện pháp bổ sung sau khi đánh giá mức độ tin cậy giữa các nhóm.",
  },
  {
    question:
      "Có thể đưa ứng dụng hiện có lên Kubernetes mà không sửa gì không?",
    answer:
      "Cần kiểm tra image container, cấu hình, secret, dữ liệu, health check và các phụ thuộc của ứng dụng. Một số ứng dụng cần điều chỉnh cách ghi file, quản lý phiên hoặc xử lý tín hiệu dừng. Nên chạy thử, kiểm tra dữ liệu và chuẩn bị rollback; không mặc định mọi ứng dụng có thể chuyển đổi mà không gián đoạn.",
  },
  {
    question: "Cần cung cấp gì để nhận phương án triển khai?",
    answer:
      "Nên chuẩn bị danh sách ứng dụng, image hoặc cách build, CPU/RAM đang dùng, dung lượng dữ liệu, sơ đồ kết nối, môi trường mục tiêu và quy trình CI/CD hiện tại. Cung cấp thêm yêu cầu bảo mật, RPO/RTO, lịch bảo trì và khả năng quản trị của đội ngũ để xác định phạm vi phù hợp.",
  },
  {
    question:
      "Liên hệ triển khai có bao gồm quản trị ứng dụng và hỗ trợ định kỳ không?",
    answer:
      "Phạm vi được thống nhất theo phương án cụ thể. Cần làm rõ phần hạ tầng, cài cluster, triển khai ứng dụng, backup, giám sát, nâng cấp và phản ứng sự cố thuộc trách nhiệm bên nào. Chi phí phụ thuộc quy mô và công việc cần làm; không mặc định đây là dịch vụ managed Kubernetes trọn gói hoặc đã bao gồm hỗ trợ định kỳ.",
  },
] as const;
