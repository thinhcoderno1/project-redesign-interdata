export const s3Options = [
  {
    id: "application",
    name: "Ứng dụng & Media",
    description:
      "Tách hình ảnh, video và tệp người dùng khỏi máy chủ ứng dụng. Tổ chức bucket theo môi trường, kiểm soát quyền truy cập và lên kế hoạch kết nối CDN khi cần phân phối nội dung.",
    audience:
      "Website, thương mại điện tử, ứng dụng SaaS và nền tảng có nhiều tệp tải lên.",
    image: "/images/s3-object-storage/option-application-media-v1.webp",
    href: "#s3-option-application",
    featured: false,
    features: [
      "Quy hoạch dung lượng và lưu lượng tải xuống",
      "Tổ chức bucket cho từng ứng dụng",
      "Kiểm thử SDK, upload và URL có thời hạn",
      "Tư vấn kết nối CDN theo luồng truy cập",
    ],
  },
  {
    id: "backup",
    name: "Backup & Lưu trữ",
    description:
      "Xây dựng nơi nhận bản sao lưu cho máy chủ và dữ liệu ứng dụng. Xác định thời gian giữ dữ liệu, quyền của tài khoản backup và quy trình phục hồi theo mức độ quan trọng của từng hệ thống.",
    audience:
      "Đội IT cần lưu bản sao ngoài máy chủ nguồn, giữ nhiều mốc dữ liệu và kiểm tra restore.",
    image: "/images/s3-object-storage/option-backup-storage-v1.webp",
    href: "#s3-option-backup",
    featured: true,
    features: [
      "Khảo sát phần mềm và lịch sao lưu",
      "Tính dung lượng theo số bản cần giữ",
      "Đối chiếu versioning và retention cần dùng",
      "Thử khôi phục dữ liệu trước bàn giao",
    ],
  },
  {
    id: "dedicated",
    name: "Hạ tầng riêng",
    description:
      "Thiết kế hệ thống object storage theo nhu cầu riêng của doanh nghiệp. Làm rõ kiến trúc, kết nối, miền lỗi và trách nhiệm quản trị trước khi lựa chọn tài nguyên triển khai.",
    audience:
      "Doanh nghiệp cần chủ động hạ tầng, phân tách truy cập và lập kế hoạch mở rộng dữ liệu.",
    image: "/images/s3-object-storage/option-dedicated-infrastructure-v1.webp",
    href: "#s3-option-dedicated",
    featured: false,
    features: [
      "Thiết kế tài nguyên theo tải đọc ghi",
      "Quy hoạch mạng và phân quyền truy cập",
      "Thống nhất dự phòng, giám sát và vận hành",
      "Lập lộ trình chuyển dữ liệu và mở rộng",
    ],
  },
] as const;

export const s3Reasons = [
  {
    title: "Tách tệp khỏi ứng dụng",
    text: "Đưa ảnh, tài liệu và tệp tải lên về một lớp lưu trữ riêng. Máy chủ ứng dụng tập trung xử lý nghiệp vụ thay vì giữ toàn bộ dữ liệu tệp.",
  },
  {
    title: "Kết nối qua S3 API",
    text: "Tích hợp bằng SDK, CLI hoặc phần mềm có hỗ trợ S3-compatible. Đối chiếu các thao tác ứng dụng thực sự dùng trước khi chuyển dữ liệu.",
  },
  {
    title: "Phân quyền theo dữ liệu",
    text: "Tách bucket và tài khoản theo ứng dụng, môi trường hoặc nhóm người dùng. Cấp quyền đọc ghi theo đúng mục đích truy cập.",
  },
  {
    title: "Mở rộng có kế hoạch",
    text: "Dự tính dung lượng tăng trưởng, số lượng object và lưu lượng tải xuống. Chọn phương án theo dữ liệu và cách ứng dụng sử dụng dữ liệu.",
  },
  {
    title: "Giữ dữ liệu đúng vòng đời",
    text: "Xác định thời gian giữ ảnh, log và bản backup. Đánh giá chính sách lifecycle, phiên bản và retention theo nền tảng triển khai.",
  },
  {
    title: "Phục hồi có kiểm thử",
    text: "Thử tải lên, tải xuống và khôi phục bản sao với dữ liệu đại diện. Lưu trữ dự phòng cần đi cùng quy trình restore thực tế.",
  },
] as const;

export const s3UseCases = [
  {
    image: "website",
    title: "Website & Thương mại điện tử",
    text: "Lưu ảnh sản phẩm, tài liệu tải xuống và nội dung người dùng. Tách dữ liệu tệp khỏi vòng đời triển khai của website.",
  },
  {
    image: "development",
    title: "Ứng dụng SaaS & Mobile",
    text: "Tổ chức tệp theo khách hàng và môi trường. Kiểm soát luồng upload, download và thời hạn chia sẻ qua ứng dụng.",
  },
  {
    image: "remote",
    title: "Hình ảnh, Video & Media",
    text: "Tập trung thư viện nội dung, quản lý metadata và dự tính lưu lượng phân phối. Đánh giá CDN khi có nhiều lượt tải.",
  },
  {
    image: "database",
    title: "Bản sao lưu máy chủ",
    text: "Lưu bản backup hoặc bản xuất database ngoài máy chủ nguồn. Kiểm tra công cụ S3 và thử phục hồi theo lịch.",
  },
  {
    image: "business",
    title: "Tài liệu & Hồ sơ doanh nghiệp",
    text: "Tách dữ liệu nội bộ khỏi nội dung công khai. Quy hoạch quyền truy cập và thời gian lưu theo từng nhóm tài liệu.",
  },
  {
    image: "tools",
    title: "Log, Dataset & Phân tích",
    text: "Lưu tệp log, dữ liệu xuất và dataset cho pipeline phân tích. Tổ chức object key, định dạng và vòng đời theo cách khai thác.",
  },
] as const;

export const s3Infrastructure = [
  {
    id: "capacity",
    title: "Quy hoạch ",
    accent: "dung lượng & tăng trưởng",
    text: "Tính dung lượng từ dữ liệu gốc, số phiên bản, lịch backup và thời gian giữ. Xem cả số lượng object, kích thước tệp và tải đồng thời để tránh chọn chỉ theo tổng GB.",
    image: "/images/vps/infrastructure-v4/storage.webp",
    benefits: [
      "Dung lượng thực dùng",
      "Số lượng object",
      "Tăng trưởng dữ liệu",
    ],
  },
  {
    id: "access",
    title: "Kiểm soát ",
    accent: "kết nối & quyền truy cập",
    text: "Xác định endpoint, kết nối HTTPS và quyền cho từng ứng dụng. Giữ secret key ở phía máy chủ, tách quyền đọc ghi và rà soát yêu cầu CORS khi trình duyệt truy cập trực tiếp.",
    image: "/images/vps/infrastructure-v4/network.webp",
    benefits: ["Endpoint / HTTPS", "Phân quyền bucket", "Quản lý access key"],
  },
  {
    id: "integration",
    title: "Đối chiếu ",
    accent: "API & công cụ đang dùng",
    text: "Chạy thử SDK, CLI và phần mềm backup với endpoint được chọn. Kiểm tra chữ ký xác thực, upload tệp lớn, URL có thời hạn và các API cần dùng thay vì mặc định tương thích mọi tính năng AWS.",
    image: "/images/vps/infrastructure-v4/cpu.webp",
    benefits: ["SDK / CLI", "Multipart upload", "Kiểm thử ứng dụng"],
  },
  {
    id: "recovery",
    title: "Thiết kế ",
    accent: "vòng đời & phục hồi",
    text: "Thống nhất thời gian giữ dữ liệu, quyền xóa và cách phục hồi. Với yêu cầu chống xóa hoặc ghi đè, đánh giá riêng versioning, Object Lock và chính sách retention theo nền tảng hỗ trợ.",
    image: "/images/home/infrastructure/protection-monitoring.webp",
    benefits: ["Chính sách lưu giữ", "Kiểm thử restore", "Giám sát dung lượng"],
  },
] as const;

export const s3Comparison = [
  {
    criterion: "Cách truy cập",
    object: "Object qua API, bucket và object key",
    block: "Volume / thiết bị khối gắn vào máy chủ",
    file: "Tệp và thư mục qua giao thức như NFS / SMB",
  },
  {
    criterion: "Nhu cầu phù hợp",
    object: "Ảnh, video, tệp ứng dụng, backup và dataset",
    block: "Ổ hệ điều hành, database và ứng dụng cần đĩa",
    file: "Thư mục dùng chung và ứng dụng cần filesystem",
  },
  {
    criterion: "Cập nhật dữ liệu",
    object: "Thường tải lên object mới để thay nội dung tệp",
    block: "Đọc ghi các khối theo nhu cầu của filesystem",
    file: "Đọc ghi tệp theo ngữ nghĩa của giao thức sử dụng",
  },
  {
    criterion: "Tích hợp ứng dụng",
    object: "SDK, CLI, công cụ backup hoặc kết nối S3 API",
    block: "Gắn volume, tạo filesystem hoặc dùng thiết bị khối",
    file: "Mount hoặc ánh xạ thư mục chia sẻ",
  },
  {
    criterion: "Cần đánh giá",
    object: "Dung lượng, số object, request và lưu lượng tải xuống",
    block: "Dung lượng volume, IOPS, độ trễ và dự phòng",
    file: "Số tệp, quyền truy cập, khóa tệp và tải đồng thời",
  },
  {
    criterion: "Trường hợp cần cân nhắc",
    object: "Ứng dụng cần POSIX hoặc ghi ngẫu nhiên trong tệp",
    block: "Chia sẻ tệp trực tiếp cho nhiều máy chủ",
    file: "Phân phối lượng lớn nội dung qua API công khai",
  },
] as const;

export const s3Steps = [
  {
    title: "Khảo sát dữ liệu",
    text: "Ghi nhận dung lượng, loại tệp, tốc độ tăng trưởng, công cụ đang dùng và yêu cầu truy cập.",
  },
  {
    title: "Chọn phương án",
    text: "Thống nhất tài nguyên, endpoint, phân quyền, chính sách lưu giữ và phạm vi hỗ trợ.",
  },
  {
    title: "Tích hợp & Chạy thử",
    text: "Cấu hình kết nối, thử upload / download và chuyển nhóm dữ liệu đại diện để đối chiếu.",
  },
  {
    title: "Nghiệm thu & Bàn giao",
    text: "Kiểm tra dữ liệu, quyền truy cập, khả năng khôi phục và bàn giao hướng dẫn vận hành.",
  },
] as const;

export const s3Faq = [
  {
    question: "S3 Object Storage là gì?",
    answer:
      "Object storage lưu dữ liệu dưới dạng object trong bucket. Mỗi object có dữ liệu, metadata và object key để truy cập qua API. Đây là cách tổ chức phù hợp cho ảnh, video, tài liệu và bản sao lưu; khác với ổ đĩa gắn vào máy chủ hoặc thư mục chia sẻ NFS / SMB.",
  },
  {
    question: "S3-compatible có phải là dịch vụ Amazon S3 không?",
    answer:
      "Không. S3-compatible mô tả khả năng giao tiếp với API theo mô hình S3, không đồng nghĩa dịch vụ chạy trên AWS hay có toàn bộ tính năng Amazon S3. Cần kiểm tra endpoint, SDK và các thao tác ứng dụng cần dùng trên nền tảng được lựa chọn.",
  },
  {
    question: "Có thể dùng S3 thay ổ đĩa chạy database không?",
    answer:
      "Không nên xem S3 là thay thế trực tiếp cho volume chạy database. Object storage không cung cấp đầy đủ ngữ nghĩa của một filesystem POSIX hay thiết bị khối. Bạn có thể lưu bản xuất hoặc backup database trên S3; với dữ liệu đang hoạt động, cần chọn cơ chế lưu trữ được chính database hỗ trợ.",
  },
  {
    question: "Có thể kết nối bằng SDK, CLI hoặc phần mềm backup sẵn có không?",
    answer:
      "Có thể tích hợp với công cụ có hỗ trợ endpoint S3-compatible, nhưng cần chạy thử phiên bản và tính năng cụ thể. Thông tin kết nối thường gồm endpoint, bucket, access key, secret key và các tham số theo nền tảng. Cần kiểm tra xác thực, upload tệp lớn và quy trình khôi phục trước khi đưa vào vận hành.",
  },
  {
    question: "Bucket có cần công khai để chia sẻ tệp không?",
    answer:
      "Không nhất thiết. Có thể thiết kế ứng dụng cấp URL có thời hạn khi nền tảng hỗ trợ presigned URL. Người có URL có thể sử dụng quyền trong phạm vi được cấp đến khi URL hết hiệu lực, nên cần bảo vệ đường dẫn này. Secret key phải được giữ phía máy chủ, không đưa vào mã nguồn trình duyệt.",
  },
  {
    question: "Versioning và Object Lock có tự động được bật không?",
    answer:
      "Không nên mặc định. Cần xác nhận nền tảng hỗ trợ, cấu hình bucket và chính sách lưu giữ. Versioning lưu các phiên bản object; Object Lock đặt điều kiện bảo vệ phiên bản trước việc xóa hoặc ghi đè. Hai cơ chế phục vụ mục tiêu khác nhau và phải được cấu hình, kiểm thử theo yêu cầu thực tế.",
  },
  {
    question: "Lưu backup trên S3 đã đủ để bảo vệ dữ liệu chưa?",
    answer:
      "Chưa. Nơi lưu bản sao chỉ là một phần của phương án backup. Cần xác định lịch sao lưu, thời gian giữ, quyền xóa, tính độc lập của bản sao và mục tiêu phục hồi. Hãy thử restore định kỳ; replication hoặc versioning riêng lẻ không thay thế toàn bộ quy trình sao lưu.",
  },
  {
    question: "Chi phí cần dự tính ngoài dung lượng lưu trữ là gì?",
    answer:
      "Tùy phương án, cần làm rõ lưu lượng tải xuống, số request, số phiên bản dữ liệu, thời gian giữ backup và phạm vi quản trị. Kết nối CDN hoặc hạ tầng riêng cũng cần được tính theo nhu cầu. Liên hệ InterData với thông tin dữ liệu và lưu lượng để xác định các hạng mục trong báo giá.",
  },
  {
    question: "Có thể chuyển dữ liệu từ hệ thống lưu trữ đang dùng không?",
    answer:
      "Cần kiểm tra dung lượng, metadata, quyền truy cập, đường truyền và công cụ của nguồn hiện tại. Nên chuyển thử một tập dữ liệu, đối chiếu số lượng và checksum phù hợp, rồi lập lịch đồng bộ phần phát sinh. Chỉ đổi kết nối ứng dụng sau khi nghiệm thu và có phương án quay lại khi cần.",
  },
  {
    question: "Cần chuẩn bị thông tin gì để được tư vấn?",
    answer:
      "Bạn nên cung cấp dung lượng hiện tại, tăng trưởng dự kiến, số lượng và kích thước tệp, lưu lượng tải xuống, công cụ tích hợp và thời gian cần giữ dữ liệu. Bổ sung yêu cầu phân quyền, vị trí lưu trữ, mục tiêu khôi phục và người chịu trách nhiệm vận hành để lựa chọn phương án phù hợp.",
  },
] as const;
