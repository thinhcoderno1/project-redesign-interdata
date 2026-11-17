export type CronCommandTemplate = {
  id: string;
  title: string;
  category: "script" | "web" | "backup";
  description: string;
  command: string;
  schedule: { label: string; expression: string };
  replacements: { value: string; description: string }[];
  instructions: string;
  note?: string;
  source: string;
};

export const cronCommandCategories = [
  { id: "all", label: "Tất cả" },
  { id: "script", label: "Chạy script" },
  { id: "web", label: "Website & API" },
  { id: "backup", label: "Sao lưu" },
] as const;

export const cronCommandTemplates: readonly CronCommandTemplate[] = [
  {
    id: "php",
    title: "Chạy script PHP",
    category: "script",
    description: "Chạy tác vụ PHP như xử lý dữ liệu hoặc gửi báo cáo định kỳ.",
    command: "/usr/bin/php /var/www/example.com/scripts/task.php",
    schedule: { label: "Mỗi 5 phút", expression: "*/5 * * * *" },
    replacements: [
      {
        value: "/usr/bin/php",
        description:
          "Đường dẫn PHP CLI trên máy chủ; dùng command -v php để tìm.",
      },
      {
        value: "/var/www/example.com/scripts/task.php",
        description: "Thay bằng đường dẫn đầy đủ đến script PHP của bạn.",
      },
    ],
    instructions:
      "Máy chủ cần có PHP CLI. Chạy thử script bằng đúng tài khoản sẽ chạy cron và kiểm tra các biến môi trường mà script cần.",
    source: "https://www.php.net/manual/en/features.commandline.usage.php",
  },
  {
    id: "python",
    title: "Chạy script Python",
    category: "script",
    description:
      "Tự động chạy script Python cho báo cáo, đồng bộ hoặc xử lý dữ liệu.",
    command: "/usr/bin/python3 /var/www/example.com/scripts/task.py",
    schedule: { label: "Mỗi giờ", expression: "0 * * * *" },
    replacements: [
      {
        value: "/usr/bin/python3",
        description:
          "Đường dẫn Python 3. Nếu dùng venv, thay bằng đường dẫn python trong thư mục venv/bin.",
      },
      {
        value: "/var/www/example.com/scripts/task.py",
        description:
          "Đường dẫn đầy đủ đến script Python đã cài đủ thư viện phụ thuộc.",
      },
    ],
    instructions:
      "Dùng command -v python3 để tìm trình thông dịch. Script nên dùng đường dẫn tuyệt đối cho tệp đầu vào và đầu ra vì thư mục làm việc của cron có thể khác terminal.",
    source: "https://docs.python.org/3/using/cmdline.html",
  },
  {
    id: "node",
    title: "Chạy script Node.js",
    category: "script",
    description:
      "Chạy một script JavaScript có điểm kết thúc theo lịch đã chọn.",
    command: "/usr/bin/node /var/www/example.com/scripts/task.js",
    schedule: { label: "Mỗi 5 phút", expression: "*/5 * * * *" },
    replacements: [
      {
        value: "/usr/bin/node",
        description:
          "Đường dẫn Node.js thực tế; dùng command -v node, đặc biệt nếu cài bằng nvm.",
      },
      {
        value: "/var/www/example.com/scripts/task.js",
        description: "Đường dẫn đầy đủ đến script JavaScript của bạn.",
      },
    ],
    instructions:
      "Cài đủ dependencies và cấu hình biến môi trường cần thiết. Chỉ chọn script chạy xong rồi thoát; không dùng mẫu này để khởi động web server lặp lại mỗi vài phút.",
    source: "https://nodejs.org/api/cli.html",
  },
  {
    id: "bash",
    title: "Chạy shell script",
    category: "script",
    description:
      "Gom nhiều bước xử lý vào một tệp Bash và gọi tệp đó bằng cron.",
    command: "/bin/bash /opt/scripts/task.sh",
    schedule: { label: "Mỗi ngày lúc 02:00", expression: "0 2 * * *" },
    replacements: [
      {
        value: "/bin/bash",
        description:
          "Đường dẫn Bash trên máy chủ; có thể kiểm tra bằng command -v bash.",
      },
      {
        value: "/opt/scripts/task.sh",
        description: "Thay bằng đường dẫn đến shell script của bạn.",
      },
    ],
    instructions:
      "Tài khoản cron cần đọc được script và có quyền thực hiện các thao tác bên trong. Trong script, khai báo rõ thư mục làm việc, đường dẫn và cách ghi log để dễ kiểm tra lỗi.",
    source: "https://www.gnu.org/software/bash/manual/bash.html#Invoking-Bash",
  },
  {
    id: "curl",
    title: "Gọi URL bằng cURL",
    category: "web",
    description:
      "Gửi yêu cầu GET đến endpoint dành cho tác vụ định kỳ của website.",
    command:
      '/usr/bin/curl --fail --silent --show-error --max-time 60 "https://example.com/cron"',
    schedule: { label: "Mỗi 5 phút", expression: "*/5 * * * *" },
    replacements: [
      {
        value: "/usr/bin/curl",
        description: "Đường dẫn cURL; dùng command -v curl để kiểm tra.",
      },
      {
        value: "https://example.com/cron",
        description:
          "Thay bằng URL HTTPS của endpoint mà bạn quản lý, giữ dấu ngoặc kép quanh URL.",
      },
    ],
    instructions:
      "--fail báo lỗi HTTP từ 400 trở lên; --silent giảm thông tin tiến trình, --show-error vẫn hiện lỗi; --max-time 60 giới hạn yêu cầu trong 60 giây. Endpoint cần được bảo vệ và chỉ thực hiện tác vụ bạn mong muốn.",
    note: "Mẫu dùng GET. Nếu API yêu cầu POST hoặc xác thực, chỉnh theo tài liệu của API. Không dán token/mật khẩu vào trang; có thể dùng tệp cấu hình cURL bảo mật trên máy chủ. URL có % cần viết thành \\% trong crontab.",
    source: "https://curl.se/docs/manpage.html",
  },
  {
    id: "laravel",
    title: "Laravel Scheduler",
    category: "web",
    description:
      "Gọi bộ lập lịch Laravel để xử lý các tác vụ đã khai báo trong ứng dụng.",
    command: "cd /var/www/example.com && /usr/bin/php artisan schedule:run",
    schedule: {
      label: "Mỗi phút (cần cho Scheduler)",
      expression: "* * * * *",
    },
    replacements: [
      {
        value: "/var/www/example.com",
        description: "Thư mục gốc dự án Laravel, nơi có tệp artisan.",
      },
      {
        value: "/usr/bin/php",
        description:
          "Đường dẫn PHP CLI phù hợp với phiên bản Laravel của dự án.",
      },
    ],
    instructions:
      "Định nghĩa các tác vụ trong ứng dụng Laravel trước. Chọn lịch Mỗi phút ở phía trên; Laravel sẽ tự quyết định tác vụ nào cần chạy trong từng lần gọi Scheduler.",
    note: "Dùng lệnh này giữ nguyên lịch bạn đang chọn. Với Laravel Scheduler, hãy đổi lịch sang * * * * * để không bỏ lỡ các tác vụ đã khai báo.",
    source: "https://laravel.com/docs/scheduling",
  },
  {
    id: "tar",
    title: "Sao lưu thư mục website",
    category: "backup",
    description:
      "Tạo bản nén .tar.gz của thư mục website, với thời gian trong tên tệp.",
    command:
      'umask 077 && /usr/bin/tar -czf "/var/backups/website-$(/usr/bin/date +\\%Y\\%m\\%d-\\%H\\%M\\%S).tar.gz" -C /var/www example.com',
    schedule: { label: "Mỗi ngày lúc 02:00", expression: "0 2 * * *" },
    replacements: [
      {
        value: "/var/backups",
        description:
          "Thư mục lưu bản sao; tạo sẵn và cấp quyền ghi phù hợp cho tài khoản cron.",
      },
      {
        value: "-C /var/www example.com",
        description:
          "Sao lưu thư mục /var/www/example.com. Thay thư mục cha sau -C và tên thư mục con theo website của bạn.",
      },
    ],
    instructions:
      "Kiểm tra đường dẫn tar và date trên máy chủ. Đặt nơi lưu bản sao bên ngoài thư mục nguồn. umask 077 giới hạn quyền của tệp mới cho tài khoản tạo tệp. Dấu \\ trước % đã được thêm để dùng trong crontab; giữ nguyên khi sao chép.",
    note: "Lệnh ghi thêm tệp sao lưu, không tự xóa bản cũ. Cần đủ dung lượng và quyền đọc dữ liệu; thử giải nén/phục hồi bản sao trước khi dùng cho vận hành. Tệp cùng tên có thể bị ghi đè nếu chạy trùng thời điểm.",
    source: "https://www.gnu.org/software/tar/manual/tar.html",
  },
  {
    id: "mysql",
    title: "Sao lưu cơ sở dữ liệu MySQL",
    category: "backup",
    description:
      "Xuất một cơ sở dữ liệu ra tệp .sql có thời gian trong tên tệp.",
    command:
      'umask 077 && /usr/bin/mysqldump --defaults-extra-file=/etc/mysql/backup.cnf --single-transaction --no-tablespaces my_database > "/var/backups/mysql-$(/usr/bin/date +\\%Y\\%m\\%d-\\%H\\%M\\%S).sql"',
    schedule: { label: "Mỗi ngày lúc 03:00", expression: "0 3 * * *" },
    replacements: [
      {
        value: "my_database",
        description: "Thay bằng tên cơ sở dữ liệu cần sao lưu.",
      },
      {
        value: "/etc/mysql/backup.cnf",
        description:
          "Tệp cấu hình có nhóm [client] chứa host, user và password; chuẩn bị trực tiếp trên máy chủ, chỉ tài khoản cron được đọc (ví dụ quyền 600).",
      },
      {
        value: "/var/backups",
        description:
          "Thư mục đã tồn tại, có đủ dung lượng và quyền ghi; giới hạn quyền truy cập tệp sao lưu vì có thể chứa dữ liệu riêng tư.",
      },
    ],
    instructions:
      "Kiểm tra đường dẫn mysqldump và quyền đọc database. --defaults-extra-file phải là tùy chọn đầu tiên. --single-transaction phù hợp bảng InnoDB; tránh thay đổi cấu trúc bảng trong lúc sao lưu. umask 077 giới hạn quyền của tệp mới cho tài khoản tạo tệp. Giữ các dấu \\% khi thêm vào crontab.",
    note: "Lệnh tạo tệp mới và có thể ghi đè nếu trùng tên; không tự dọn bản cũ. Tệp có thể chưa đầy đủ nếu dump lỗi. Kiểm tra kết quả và thử phục hồi; không nhập mật khẩu trực tiếp vào lệnh mẫu.",
    source: "https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html",
  },
];
