# Bàn giao homepage InterData

Bản review ngày 07/10/2026. Chưa deploy hoặc publish.

## Đã triển khai

- Đủ thứ tự A–N: utility/header, hero, khuyến mãi, dịch vụ hạ tầng, 5 giải pháp, năng lực, phản hồi, báo chí, giáo dục, tư vấn theo nhu cầu, hạ tầng, tài nguyên, CTA và footer.
- Hero full width, nội dung căn giữa. Dùng ảnh `public/images/solutions/datacenter-aisle.webp` theo yêu cầu người dùng ngày 09/10/2026, lớp phủ đen pha navy 64–80% đậm ở giữa và gradient xanh nhẹ tại hai góc, vị trí ảnh căn giữa. H1 “Giải Pháp [Ứng dụng] Vượt Trội”: phần ứng dụng xanh sáng luân phiên mỗi 3,2 giây giữa Lưu Trữ Web, Hạ Tầng Self-Host, Triển Khai Ứng Dụng và Ảo Hóa Máy Chủ. Chữ cũ cuộn lên, chữ mới đi vào từ dưới trong 0,7 giây; vùng chứa co giãn chiều rộng cùng nhịp, hai phần chữ trắng luôn giữ nguyên độ rõ, không có nút pause; tự dừng khi ra khỏi màn hình hoặc tab bị ẩn, hỗ trợ giảm chuyển động và nội dung tĩnh khi không chạy JavaScript. Một nút “Dùng thử miễn phí” dạng viên thuốc màu xanh thương hiệu dẫn đến `https://interdata.vn/thue-vps/#pricing` theo CTA dùng thử trong project nguồn; thanh thông số nền trắng/icon xanh. Kiểm tra tương tác bằng `npm run test:hero-heading`.
- Parallax nhẹ cho nền Hero và section hạ tầng: biên độ tối đa ±64px trên desktop/tablet, ±28px trên mobile. Chỉ cập nhật theo frame khi section đang hiển thị; hỗ trợ thay đổi `prefers-reduced-motion` tức thời và nền tĩnh khi JavaScript không chạy.
- H1 hero luôn trên một hàng. Cỡ chữ được tính theo cụm dài nhất và chiều rộng khả dụng với font thực tế; khoảng cách hai bên phần ứng dụng cố định trong mỗi viewport, chiều rộng phần ứng dụng theo đúng cụm đang hiển thị. Tự tính lại khi resize hoặc font tải xong; CSS giữ một hàng khi JavaScript bị tắt. Trên mobile, cỡ chữ nhỏ hơn để toàn bộ câu vừa màn hình. Mép cắt của vùng cuộn có khoảng dư 0,12em để giữ đầy đủ dấu tiếng Việt và nét chữ nhô ra; không thay đổi khoảng cách hai bên.
- 22 color tokens theo tài liệu, focus 3px/offset 4px, trạng thái selected/hover, skip link, `lang=vi`, một H1 trên mỗi trang.
- Menu desktop mở bằng click/Enter, đóng bằng Escape hoặc click ngoài; mobile dialog có focus containment, trả focus và khóa scroll. Selector tư vấn cập nhật nội dung, hướng chọn và CTA; hỗ trợ phím mũi tên, Home/End.
- Top bar và nav bar nằm trong cùng một header sticky, nền trắng và lớp bóng nhẹ. Khoảng tránh header khi đến anchor theo chiều cao thực tế, cập nhật bằng ResizeObserver; có fallback CSS trên desktop/tablet/mobile.
- Phản hồi gồm 8 card trong 3 slide (3–3–2), desktop 3 cột, màn hình nhỏ xếp dọc. Card theo mẫu người dùng ngày 08/10/2026: logo trong ô nổi, sao vàng trang trí, quote và thông tin khách hàng dưới đường phân cách. Sao không biểu thị số điểm đánh giá được xác minh. Mặc định trích khoảng 25% số từ; “Xem đầy đủ / Thu gọn” dùng `details/summary` native, giữ nguyên toàn bộ lời chia sẻ và dùng được khi không có JavaScript. Có nút trước/sau, chấm chọn, phím trái/phải/Home/End, kéo chuột và vuốt cảm ứng; không autoplay. Khi JavaScript không chạy, lướt ngang bằng cơ chế native của trình duyệt.
- Ảnh WebP, font Be Vietnam Pro đóng gói cục bộ, ảnh đầu trang được ưu tiên, ảnh bên dưới lazy-load. Bản đồ SVG trang trí, không có datacenter markers/routes.
- Không thêm Shared Hosting vào dịch vụ chính, không dựng trang sản phẩm/backend/account riêng, không tạo form báo thành công giả.

## Nguồn đã đọc và sử dụng

Hai tài liệu brief/color tìm thấy trong `C:\Users\interdigi 03\Downloads\KLVN\BlogPost`, đã đọc toàn bộ trước khi viết implementation. Bản sao trong thư mục này.

| Nội dung | Nguồn | Cách dùng |
| --- | --- | --- |
| Phản hồi | `D:\InterData\thue-vps\components\testimonials-2.jsx` (được import tại `app/page.js`) | Giữ đủ 8 feedback, nguyên văn lời chia sẻ, tên và đơn vị theo thứ tự nguồn: SEO Việt, RealDev, BALICO, Trường Phong, UMIX Việt Nam, Digizone Việt Nam, Đồng Hồ Hải Triều, Jobkey. Tên Jobke từ nguồn đã được sửa thành Jobkey trong dữ liệu project ngày 08/10/2026. Chỉ sử dụng content; không lấy thiết kế, animation hoặc rating. |
| Logo phản hồi | `D:\InterData\thue-vps\public\images\skin\customer` | Sao chép nguyên bản 8 logo được khai báo trong feedback đang dùng, đóng gói tại `/images/testimonials/`. Dùng đúng tỷ lệ, không gán logo thành chân dung khách hàng. Các portrait từ bố cục cũ không còn hiển thị trong section này. |
| Báo chí | `D:\InterData\thue-vps\components\partners.js` và `public\images\skin\news` | Chọn bài VnExpress, Thanh Niên, VTV; giữ title, thumbnail, URL. Không coi bài báo là endorsement. |
| Trường học | `D:\InterData\home\components\free-hosting\infine-slider.tsx` và `public\assets\logo` | 7 logo, giữ màu và tỷ lệ. Intro không bổ sung phạm vi hợp tác. |
| Chiến dịch | `D:\InterData\home\components\header\dealhosting.js` và `public\assets\promotions` | 2 artwork nguyên vẹn, layout mới. Không thêm giá, ngày hết hạn hoặc countdown. Banner có thông báo chờ duyệt trong review; public mode ẩn các banner pending. |
| Logo InterData | `D:\InterData-Project-News-Website-2026\public\images\logo.webp`, gốc `https://interdata.vn/assets/LogoNewSlogan-07.png` | Logo chính thức, không dùng các bản trang trí Tết trong hai dự án nguồn. Không biến đổi màu hoặc tỷ lệ. |
| Hero datacenter | `public/images/solutions/datacenter-aisle.webp` | Dùng trực tiếp tệp người dùng chỉ định ngày 09/10/2026; không gắn nhãn facility InterData. Ghi chú nguồn ảnh trên demo được điều khiển bằng `showEditorialNotes`. |
| Datacenter section hạ tầng | `C:\Users\interdigi 03\Downloads\KLVN\BlogPost\Viettel-IDC.jpg` | Tệp ảnh do người dùng cung cấp, sao chép nguyên bản tại `/images/viettel-idc.jpg` ngày 07/10/2026. Nền phủ toàn section, căn trái; gradient navy đậm dần sang phải, nội dung căn phải. Mobile căn ảnh tại 38% và phủ navy tối thiểu 88% để dễ đọc. Ghi chú nguồn vẫn ẩn trên demo. |
| Bài viết | `D:\InterData\thue-vps\components\post.js`, WordPress REST API chính thức | 3 bài VPS từ nguồn được chỉ định và 1 tin hợp tác VNPT. API cung cấp title, image, date, URL; snapshot tại `src/data/articles.json`. Không tuyên bố có dữ liệu popularity. |
| Contact/legal | https://interdata.vn/ và https://interdata.vn/contact | Đối chiếu công ty, MST, địa chỉ, hotline và các URL sản phẩm/chính sách. Email đối chiếu thêm footer dự án `home`. |

Chi tiết đường dẫn ảnh và kích thước: `asset-manifest.json`. Chỉ tái sử dụng nội dung và tài sản, không sao chép stylesheet hoặc layout nguồn.

## Kiểm tra đã thực hiện

- Carousel phản hồi ngày 07/10/2026: `test:testimonials` đạt tại 320, 390, 768, 1024, 1440, 1920px trên bản production cục bộ. Đối chiếu đủ 8 lời chia sẻ/tên/đơn vị với component nguồn và cả 8 logo khớp byte với file gốc. Nút trước/sau/chấm chọn, bàn phím, kéo chuột, vuốt cảm ứng tại 390px, giữ slide khi resize, nội dung khi tắt JavaScript và kiểm tra không tự chạy đều đạt. Không có tràn ngang, chữ bị cắt hoặc page errors. DOM homepage ngoài section phản hồi và heading của section giữ nguyên so với baseline trước thay đổi. Bằng chứng: `artifacts/testimonials-results.json`, `artifacts/testimonials-preservation.json`, `artifacts/testimonials-*.png`. `test:ui` chạy lại đạt 5 viewport, không axe violations hoặc control/link nhỏ hơn 24px; `test:parallax` chạy lại đạt. Các thay đổi carousel được kiểm tra cục bộ, chưa deploy.
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
6. **Đích giải pháp:** chưa có URL riêng được xác nhận cho Private Network, Proxmox / CEPH, Kubernetes, VMware, S3. Header/footer đến anchor thật trên homepage, CTA đến contact. Không tự tạo product page.
7. **Tích hợp:** CTA dùng trang contact chính thức và hotline/email đã đối chiếu. Không có form/backend/analytics mới; không kiểm thử việc gửi form trên trang contact bên ngoài.
8. **Tài khoản:** đã xác nhận hai trang đích qua Chrome. Chưa kiểm thử gửi form, đăng nhập thành công hoặc tạo tài khoản; đó là chức năng của hệ thống hỗ trợ hiện hữu, ngoài phạm vi homepage.

Danh sách 5 giải pháp được cập nhật theo yêu cầu demo ngày 08/10/2026. Mô tả Proxmox / CEPH tham chiếu [tài liệu Proxmox VE](https://pve.proxmox.com/pve-docs/pve-admin-guide.pdf); mô tả ảo hóa VMware tham chiếu [VMware vSphere](https://www.vmware.com/products/cloud-infrastructure/vsphere). Các mô tả không bổ sung cam kết hiệu năng, cấu hình, giá hoặc bản quyền đi kèm.

## Bản review và bản public

`NEXT_PUBLIC_CONTENT_MODE` mặc định review. `/content-review` và chú thích review chỉ hiện trong chế độ này. Bản review và cả metadata hiện để `noindex,nofollow`, chưa xuất bản.

Đặt `NEXT_PUBLIC_CONTENT_MODE=public` trước build để không trình bày pending claims/campaigns/infrastructure như dữ liệu đã duyệt. Public mode chưa build/test trong lượt này. Để giữ các section đầy đủ khi public, cần đưa content thật đã duyệt vào model; không đổi status chỉ để làm đầy giao diện. Việc deploy/indexing nằm ngoài phạm vi được yêu cầu.
