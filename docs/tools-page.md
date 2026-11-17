# Công cụ online InterData

**Trạng thái: đang ẩn, chưa được duyệt.** `toolsPageApproved` trong `src/data/page-availability.ts` đang là `false`: `/cong-cu/` trả 404 và noindex, không render giao diện công cụ/schema trang, không hiện liên kết menu/footer và không có trong sitemap. Áp dụng cả môi trường review lẫn public, không có query hoặc biến môi trường để mở xem trước. Chỉ đổi cờ sau khi người dùng yêu cầu mở lại; mã nguồn và kiểm tra chức năng được giữ nguyên.

Trang `/cong-cu/` dùng header/footer chung, với ba tab trên cùng URL. Có thể mở trực tiếp `/cong-cu/#cron`, `/cong-cu/#nginx` hoặc `/cong-cu/#vps`. Chuyển tab giữ dữ liệu đang nhập; tải lại trang đặt lại các giá trị mặc định. Mọi phép tính và việc tạo tệp đều thực hiện trong trình duyệt.

## Cron Job Generator

- Lịch mẫu, chỉnh riêng từng trường hoặc nhập trực tiếp biểu thức Linux cron 5 trường.
- Hỗ trợ số, `*`, danh sách, khoảng, bước; Chủ nhật là 0 hoặc 7. Không hỗ trợ tên tháng/thứ, macro `@daily`, giây hay cú pháp Quartz.
- Ngày trong tháng và ngày trong tuần tuân theo quy tắc wildcard/OR của cron Linux. Tính tối đa 5 lần chạy trong 32 năm để bao phủ lịch ngày nhuận. Múi giờ xem trước: Việt Nam (UTC+7) hoặc UTC; lựa chọn này không thay đổi múi giờ máy chủ.
- Thêm lệnh tùy chọn để tạo dòng crontab người dùng hoàn chỉnh. Chặn lệnh nhiều dòng và nhắc escape `%`. Kết quả chỉ có biểu thức khi chưa nhập lệnh.
- Sao chép và tải `crontab.txt`; không cài đặt hoặc thực thi job.
- Thư viện 8 lệnh mẫu, lọc theo nhóm script/website & API/sao lưu: PHP, Python, Node.js, Bash, cURL, Laravel Scheduler, tar và mysqldump. Mỗi mẫu có lịch gợi ý, hướng dẫn thay tham số, yêu cầu môi trường và nguồn tài liệu chính thức.
- “Sao chép lệnh” chỉ lấy lệnh, không lấy biểu thức cron. “Dùng lệnh này” thay ô Lệnh cần chạy, chuyển focus về ô và giữ lịch đang chọn. Thông báo dưới ô nhắc thay đường dẫn và lịch gợi ý; Laravel cần chọn Mỗi phút. Không có lệnh nào được thực thi từ trình duyệt.
- Mẫu sao lưu có timestamp đã escape `%` để dùng trong crontab, cảnh báo quyền ghi/dung lượng và không tự xóa tệp cũ. Mẫu MySQL dùng tệp cấu hình credentials trên máy chủ, không yêu cầu nhập mật khẩu vào trang.

Tham khảo: [crontab(5)](https://man7.org/linux/man-pages/man5/crontab.5.html).

## Nginx Config Generator

- Reverse Proxy đến ứng dụng HTTP bằng IPv4/hostname và cổng; hoặc website tĩnh với tùy chọn fallback SPA.
- Tùy chọn tên miền `www`, HTTPS với chứng chỉ có sẵn, chuyển HTTP sang HTTPS, Gzip và WebSocket cho proxy.
- Kiểm tra hostname, cổng và đường dẫn trước khi tạo cấu hình; không nội suy ký tự điều khiển hay dấu phân cách directive từ trường nhập.
- HTTPS cần đường dẫn chứng chỉ/khóa trên máy chủ; công cụ không cấp chứng chỉ. Upstream hiện hỗ trợ HTTP, không hỗ trợ upstream HTTPS hoặc IPv6.
- Tải `interdata-site.conf`, đặt trong tệp được include dưới `http {}`. WebSocket thêm `map` ở cấp `http`. Mẫu chặn tệp ẩn, giới hạn upload 20 MB. Chạy `sudo nginx -t` trước khi reload trên máy chủ.

Tham khảo: [Nginx Proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html), [Nginx HTTPS](https://nginx.org/en/docs/http/configuring_https_servers.html).

## Tính toán cấu hình VPS

- Mô hình lập kế hoạch web/API trên Linux; mặc định theo WordPress, thương mại điện tử, API/Node.js hoặc website tĩnh. Các hệ số là giả định của công cụ, không phải benchmark hay gói bán InterData.
- Nhập số người hoạt động đồng thời, yêu cầu/người/phút, dữ liệu hiện tại, tăng trưởng GB/tháng, thời gian dự trù và dự phòng. Có thể cộng RAM CSDL chạy cùng VPS.
- Phần giả định cho chỉnh CPU ms/yêu cầu, thời gian xử lý ms/yêu cầu, RAM MB/yêu cầu, RAM nền ứng dụng và CSDL. Đổi loại ứng dụng nạp lại giả định mẫu, giữ số người/dung lượng/dự phòng.
- Tải = người dùng × yêu cầu/người/phút ÷ 60; số yêu cầu đang xử lý = tải × thời gian xử lý (giây). CPU = (0,25 + tải × thời gian CPU tính bằng giây) × dự phòng ÷ 0,7. RAM = (0,75 + RAM ứng dụng + RAM CSDL nếu dùng chung + RAM cho các yêu cầu đang xử lý) × dự phòng. SSD = (12 GB hệ điều hành + dữ liệu + tăng trưởng × số tháng) × dự phòng. Dự phòng = 1 + %/100.
- CPU tối thiểu 1, sau đó làm tròn lên bội 2; RAM tối thiểu 2 GB, làm tròn lên bội 2; SSD tối thiểu 20 GB, làm tròn lên bội 10. Không giới hạn ngầm kết quả lớn: vượt 32 vCPU, 128 GB RAM hoặc 2.000 GB SSD sẽ ghi rõ nhu cầu tài nguyên tổng và đề nghị đánh giá kiến trúc.
- Ví dụ mặc định: 100 người × 3 yêu cầu/phút = 5 yêu cầu/giây; CPU 120 ms, xử lý 500 ms, RAM tăng 64 MB/yêu cầu, ứng dụng 0,75 GB, CSDL 1 GB; dữ liệu 20 GB tăng 2 GB/tháng trong 6 tháng, dự phòng 30% → 2 vCPU, 4 GB RAM, 60 GB SSD.
- Hướng dẫn 4 bước, công thức minh bạch, sao chép/tải TXT bao gồm giả định. Chưa tính băng thông, IOPS, backup cục bộ, GPU, tác vụ nền nặng hay dự phòng nhiều máy chủ. Cần kiểm thử tải và đo lại trước khi chọn cấu hình thực tế.
- Logic: `src/lib/vps-sizing.ts`; giao diện/CSS: `src/components/tools/vps-calculator.*`. Tham khảo phương pháp: [Google SRE capacity planning](https://sre.google/sre-book/service-best-practices/); hệ số tính toán do dự án định nghĩa.

## Source và kiểm tra

Mỗi tab có phần hướng dẫn sử dụng riêng bên dưới công cụ: 4 bước thực hiện, ví dụ cụ thể và lưu ý khi áp dụng. Nút “Hướng dẫn” ở đầu công cụ cuộn đến và chuyển focus vào phần tương ứng. Nội dung đặt tại `src/components/tools/tool-usage-guides.tsx`, dùng layout chung và xếp một cột trên màn hình nhỏ.

- Route/metadata: `src/app/(website)/cong-cu/page.tsx`.
- UI/CSS: `src/components/tools/`.
- Logic thuần: `src/lib/tool-generators.ts`.
- Lệnh mẫu: `src/data/cron-command-templates.ts`; giao diện thư viện: `src/components/tools/cron-command-library.tsx`.
- Thêm vào sitemap, schema CollectionPage, menu desktop/mobile và footer. Cụm liên hệ nổi xếp ngang trên màn hình nhỏ riêng trang công cụ để giảm che khuất biểu mẫu.

```powershell
npm run test:tools:data
npm run dev
# Trong terminal khác (server ở cổng 3000):
$env:TEST_BASE_URL = 'http://127.0.0.1:3000'
npm run test:tools
```

Test UI mặc định dùng cổng 3100. Khi trang đang ẩn, `test:tools` kiểm tra URL trả 404/noindex, không có schema trang, liên kết menu/footer hoặc mục sitemap. Khi được mở lại, cùng script kiểm tra tab, giữ state, bàn phím, clipboard, tải tệp, validation, accessibility và không tràn ngang ở 320/390/768/1024/1440px. `test:tools:data` vẫn kiểm tra logic công cụ khi trang ẩn. Ảnh QA và tệp tải thử lưu trong `artifacts/tools/` (không commit). Kiểm tra cú pháp thực tế với binary Nginx và môi trường chứng chỉ là bước thực hiện trên máy chủ đích.
