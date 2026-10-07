# Bàn giao homepage InterData

Bản review ngày 07/10/2026. Chưa deploy hoặc publish.

## Đã triển khai

- Đủ thứ tự A–N: utility/header, hero, khuyến mãi, 4 dịch vụ, 3 giải pháp, năng lực, phản hồi, báo chí, giáo dục, tư vấn theo nhu cầu, hạ tầng, tài nguyên, CTA và footer.
- Hero full width, nội dung căn giữa. Ảnh chụp lối đi giữa hai dãy rack từ PxHere (CC0), lớp phủ navy 72%, vị trí ảnh căn giữa; không dùng ảnh AI.
- 22 color tokens theo tài liệu, focus 3px/offset 4px, trạng thái selected/hover, skip link, `lang=vi`, một H1 trên mỗi trang.
- Menu desktop mở bằng click/Enter, đóng bằng Escape hoặc click ngoài; mobile dialog có focus containment, trả focus và khóa scroll. Selector tư vấn cập nhật nội dung, hướng chọn và CTA; hỗ trợ phím mũi tên, Home/End.
- Ảnh WebP, font Be Vietnam Pro đóng gói cục bộ, ảnh đầu trang được ưu tiên, ảnh bên dưới lazy-load. Bản đồ SVG trang trí, không có datacenter markers/routes.
- Không thêm Shared Hosting vào dịch vụ chính, không dựng trang sản phẩm/backend/account riêng, không tạo form báo thành công giả.

## Nguồn đã đọc và sử dụng

Hai tài liệu brief/color tìm thấy trong `C:\Users\interdigi 03\Downloads\KLVN\BlogPost`, đã đọc toàn bộ trước khi viết implementation. Bản sao trong thư mục này.

| Nội dung | Nguồn | Cách dùng |
| --- | --- | --- |
| Phản hồi | `D:\InterData\thue-vps\components\testimonials-2.jsx` | Giữ nguyên lời chia sẻ và attribution Trịnh Bảo/BALICO, Thắng Nguyễn/UMIX, Vĩnh Minh Đạo/RealDev. Không thêm rating, doanh thu hoặc kết quả định lượng. |
| Ảnh khách hàng/logo | `D:\InterData\thue-vps\public\images\skin\testimonial` và `customer` | BALICO chỉ có logo tại asset được chọn, nên không trình bày logo như ảnh Trịnh Bảo. Hai portrait còn lại giữ attribution từ dự án nguồn, cần duyệt quan hệ ảnh/người. |
| Báo chí | `D:\InterData\thue-vps\components\partners.js` và `public\images\skin\news` | Chọn bài VnExpress, Thanh Niên, VTV; giữ title, thumbnail, URL. Không coi bài báo là endorsement. |
| Trường học | `D:\InterData\home\components\free-hosting\infine-slider.tsx` và `public\assets\logo` | 7 logo, giữ màu và tỷ lệ. Intro không bổ sung phạm vi hợp tác. |
| Chiến dịch | `D:\InterData\home\components\header\dealhosting.js` và `public\assets\promotions` | 2 artwork nguyên vẹn, layout mới. Không thêm giá, ngày hết hạn hoặc countdown. Banner có thông báo chờ duyệt trong review; public mode ẩn các banner pending. |
| Logo InterData | `D:\InterData-Project-News-Website-2026\public\images\logo.webp`, gốc `https://interdata.vn/assets/LogoNewSlogan-07.png` | Logo chính thức, không dùng các bản trang trí Tết trong hai dự án nguồn. Không biến đổi màu hoặc tỷ lệ. |
| Hero datacenter | https://pxhere.com/en/photo/628457 | Ảnh chụp lối đi chính giữa hai dãy rack, CC0; nguồn và giấy phép đã kiểm tra ngày 07/10/2026. Đóng gói WebP tại `/images/hero-datacenter-aisle.webp`; không gắn nhãn facility InterData. Ghi chú nguồn ảnh trên demo được điều khiển bằng `showEditorialNotes`. |
| Datacenter section hạ tầng | `C:\Users\interdigi 03\Downloads\KLVN\BlogPost\Viettel-IDC.jpg` | Tệp ảnh do người dùng cung cấp, sao chép nguyên bản tại `/images/viettel-idc.jpg` ngày 07/10/2026. Nền phủ toàn section, căn trái; gradient navy đậm dần sang phải, nội dung căn phải. Mobile căn ảnh tại 38% và phủ navy tối thiểu 88% để dễ đọc. Ghi chú nguồn vẫn ẩn trên demo. |
| Bài viết | `D:\InterData\thue-vps\components\post.js`, WordPress REST API chính thức | 3 bài VPS từ nguồn được chỉ định và 1 tin hợp tác VNPT. API cung cấp title, image, date, URL; snapshot tại `src/data/articles.json`. Không tuyên bố có dữ liệu popularity. |
| Contact/legal | https://interdata.vn/ và https://interdata.vn/contact | Đối chiếu công ty, MST, địa chỉ, hotline và các URL sản phẩm/chính sách. Email đối chiếu thêm footer dự án `home`. |

Chi tiết đường dẫn ảnh và kích thước: `asset-manifest.json`. Chỉ tái sử dụng nội dung và tài sản, không sao chép stylesheet hoặc layout nguồn.

## Kiểm tra đã thực hiện

- `npm run lint`: đạt, không lỗi/cảnh báo.
- `npm run typecheck`: đạt.
- `npm run build`: đạt; tạo static routes `/`, `/content-review` và not-found. `npm run start` chạy ở http://localhost:3100.
- `npm run test:ui`: đạt trên production cục bộ tại 360, 390, 768, 1024, 1440px. Mỗi viewport không tràn ngang, không ảnh lỗi, không anchor thiếu đích và không page errors. Menu click/bàn phím, mobile Escape/focus loop/return focus và cả 4 lựa chọn tư vấn đã kiểm tra.
- axe WCAG 2 A/AA, 2.1 AA, 2.2 AA ở cả 5 viewport: không phát hiện violation. Kiểm tra kích thước control/link đang hiển thị không có mục nhỏ hơn 24px ở một chiều. Đây là kiểm tra tự động, không phải chứng nhận WCAG hay kiểm thử bằng mọi screen reader.
- Screenshot hero, toàn trang và tư vấn tại cả 5 viewport trong `artifacts`. Đã xem ảnh desktop/mobile và rà soát trực tiếp Chrome; sửa focus mobile, bố cục chiến dịch dạng vuông, kích thước chữ và các vùng chạm trước lượt kiểm tra cuối.
- `node scripts/contrast-check.mjs`: 8 cặp semantic đạt; kiểm tra toàn bộ pixel ảnh thật ghép với overlay CSS cho tất cả responsive crops. Tối thiểu white hero 9,91:1; secondary hero 6,80:1; caption 10,52:1.
- `npm run test:links`: 19/21 external URLs trả HTTP 200. URL đăng ký và đăng nhập trả 403 với fetch tự động; sau đó đã mở và xác nhận cả hai trang thật trên Chrome. Trang đăng nhập hiển thị form email/mật khẩu; link “Create account” dẫn đến đúng trang đăng ký với heading “Đăng ký tài khoản”. Cloudflare ban đầu xuất hiện rồi trang có thể truy cập bình thường. Không nhập thông tin, gửi form, đăng nhập hay tạo tài khoản.
- Chrome người dùng có extension thêm `cz-shortcut-listen` lên body, tạo hydration warning trong `next dev`. Profile sạch dùng trong UI tests không có warning này; production preview không có dev error overlay. Không thêm suppressHydrationWarning để che lỗi.

Bằng chứng: `artifacts/qa-results.json`, `artifacts/link-check.json`, `artifacts/contrast-results.json` và screenshots. Chưa đo Lighthouse/Core Web Vitals trên hosting thực tế, chưa kiểm thử mạng di động hoặc thiết bị vật lý.

## Nội dung và điểm còn cần duyệt

1. **7 claims pending trong content model:** “Uptime 99.9% SLA”, “Support 24/7”, “80Gbp băng thông”, “30.000+ Doanh Nghiệp Tin Tưởng InterData”, “12+ Năm Kinh Nghiệm”, “100.000+ Khách Hàng”, “1000+ Máy Chủ”. Không đổi số hoặc đơn vị. “80Gbp” cần xác nhận đơn vị và phạm vi đo. Doanh nghiệp và khách hàng giữ thành hai tập khác nhau.
2. **Thông tin brief về hạ tầng:** xác nhận Viettel IDC/FPT, cấu hình thế hệ CPU/SSD, phạm vi kết nối, bảo vệ và giám sát theo từng dịch vụ. Không thêm chứng nhận, anti-DDoS capacity hoặc guarantee.
3. **Chiến dịch:** duyệt tính hiệu lực và các điều kiện/giá có sẵn trong artwork trước khi cho phép public. Hiện cả hai campaign là pending.
4. **Tài sản:** duyệt quyền dùng quote, portrait, logo trường, tên trường và phạm vi quan hệ. Có nguồn local không đồng nghĩa đã xác minh độc lập hoặc có approval mới.
5. **Ảnh thực tế:** ảnh minh họa stock đã có; chưa có ảnh facility InterData được xác nhận cho brief này. Có thể thay bằng tài sản datacenter đã duyệt.
6. **Đích giải pháp:** chưa có URL riêng được xác nhận cho Proxmox, Kubernetes, S3. Header/footer đến anchor thật trên homepage, CTA đến contact. Không tự tạo product page.
7. **Tích hợp:** CTA dùng trang contact chính thức và hotline/email đã đối chiếu. Không có form/backend/analytics mới; không kiểm thử việc gửi form trên trang contact bên ngoài.
8. **Tài khoản:** đã xác nhận hai trang đích qua Chrome. Chưa kiểm thử gửi form, đăng nhập thành công hoặc tạo tài khoản; đó là chức năng của hệ thống hỗ trợ hiện hữu, ngoài phạm vi homepage.

## Bản review và bản public

`NEXT_PUBLIC_CONTENT_MODE` mặc định review. `/content-review` và chú thích review chỉ hiện trong chế độ này. Bản review và cả metadata hiện để `noindex,nofollow`, chưa xuất bản.

Đặt `NEXT_PUBLIC_CONTENT_MODE=public` trước build để không trình bày pending claims/campaigns/infrastructure như dữ liệu đã duyệt. Public mode chưa build/test trong lượt này. Để giữ các section đầy đủ khi public, cần đưa content thật đã duyệt vào model; không đổi status chỉ để làm đầy giao diện. Việc deploy/indexing nằm ngoài phạm vi được yêu cầu.
