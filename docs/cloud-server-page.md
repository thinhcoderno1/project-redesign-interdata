# Cloud Server `/cloud-server/`

Trang sử dụng layout website chung và thiết kế của `/thue-vps/`: hero nền ảnh tối,
thanh lợi ích, sáu thẻ lợi thế quanh ảnh trung tâm, hai card dòng dịch vụ, thẻ ứng dụng,
bảng giá theo chu kỳ, hạ tầng dạng hàng xen kẽ, so sánh, môi trường triển khai,
khách hàng/báo chí, đối tác công nghệ, FAQ và CTA cuối trang.

Các CSS module của Thuê VPS được tái sử dụng để giữ typography, màu sắc, khoảng cách,
card và responsive. Nội dung, dữ liệu và component của Thuê VPS không bị sửa.
Section “ĐA DẠNG LỰA CHỌN” hiển thị cố định hai card Cloud Server:
hai cột từ 900px, một cột bên dưới 900px. Không có tab menu, nút điều hướng,
trạng thái active/ẩn hoặc thao tác kéo/vuốt chuyển card. Nội dung, ảnh, liên kết
và phong cách card được giữ nguyên; hai card đọc được khi tắt JavaScript.
Các section năng lực, khách hàng, báo chí,
giáo dục và đối tác công nghệ dùng nguyên component của Thuê VPS theo yêu cầu đã duyệt.

## Nhịp khoảng cách giữa các section

Spacing được giới hạn trong `cloud-server.module.css`, không sửa CSS dùng chung
của trang Thuê VPS. Đệm trên/dưới của section: 64px từ 1200px, 48px ở
640–1199px, 40px dưới 640px. Khoảng cách từ cụm tiêu đề đến nội dung là 32px
trên desktop lớn và 24px ở các màn hình nhỏ hơn. Đồng bộ khoảng cách quanh
hai card dịch vụ, điều khiển giá, cụm lợi thế và bố cục FAQ trên mobile.

Hero và thanh lợi ích giữ bố cục chồng lớp đã duyệt; đệm phần nội dung bên dưới
thanh lợi ích là 40px trên desktop lớn, 32px ở các màn hình nhỏ hơn.
Nội dung, ảnh, thứ tự section, bảng giá và liên kết không thay đổi.
Đo đạc trước/sau và screenshot tại `artifacts/cloud-server/spacing/`.

## Bảng so sánh theo mẫu Thuê VPS

Section “CHỌN NỀN TẢNG PHÙ HỢP” dùng thiết kế và cấu trúc “So Sánh Các Dòng VPS”:
tiêu đề/CTA tư vấn, mô tả dịch vụ, hai hàng nút xem chi tiết, cột tiêu chí cố định,
màu nền xen kẽ, điều hướng trái/phải khi cần, kéo chuột, vuốt và phím
Arrow Left/Right, Home/End. Có hai cột Cloud thay cho bốn cột VPS; từ 640px
hiển thị cả hai cột, dưới 640px một cột cùng cột tiêu chí cố định.

Từ 640px, ẩn toàn bộ thanh hướng dẫn/đếm/điều hướng vì hai cột đã hiển thị đủ.
Dưới 640px, chỉ hiển thị hai nút icon trái/phải, giữ tên truy cập cho trình đọc
màn hình; không hiển thị câu hướng dẫn hoặc bộ đếm. Kéo/vuốt và bàn phím vẫn
hoạt động. Tắt JavaScript thì thanh điều hướng ẩn, bảng vẫn cuộn ngang tự nhiên.

Giữ đúng bảy tiêu chí và thứ tự của mẫu: ổ cứng, CPU, Ioping Latency, tốc độ
truyền tải, băng thông hàng tháng, IPv4 riêng, backup định kỳ. Giá trị lấy theo
hai dòng Cloud, không chuyển số liệu VPS sang Cloud. API nhóm 40/41 công bố
NVMe U.2, Network Port 10 Gbps và băng thông 1.000–22.000 GB theo gói.
Không tự thêm “Gen 4” cho lưu trữ, số đo latency hoặc lịch/số bản backup.
Gói Platinum HN thiếu trường IPv4 trong mô tả API được ghi chú cần kiểm tra riêng.

Nguồn đối chiếu:
[AMD Cloud](https://interdata.vn/amd-epyc-gen3-cloud/),
[Platinum Cloud](https://interdata.vn/intel-platinum-gen2-cloud/),
[API AMD](https://support.interdata.vn/packages.php?gid=40),
[API Platinum](https://support.interdata.vn/packages.php?gid=41).

Component và CSS được tách riêng trong `src/components/cloud-server/comparison*`;
dữ liệu tại `src/data/cloud-server-comparison.ts`. Không sửa section gốc của VPS.
Spacing 64/48/40px và icon trên badge được giữ lại.

Kiểm tra riêng: `npm run test:cloud-comparison`. Kết quả/screenshot tại
`artifacts/cloud-server/comparison/qa/`; production local tại
`artifacts/cloud-server/comparison/production-qa/`.

## Môi trường triển khai theo mẫu “Khởi tạo nhanh theo nhu cầu”

Section `#cloud-deployment` dùng nền xanh gradient, họa tiết cầu/lưới riêng,
tab gạch chân và thẻ trắng cắt góc, có lớp nền lệch như mẫu Thuê VPS.
Theo yêu cầu đã duyệt, dùng nguyên badge, heading, mô tả và nội dung của
section Thuê VPS, giữ icon trước badge. Tab “Linux OS” gồm Ubuntu, CentOS,
Debian, AlmaLinux, Fedora; tab “1-Click Applications” gồm n8n, OpenClaw,
EzyPlatform, WPTangToc, đúng thứ tự, nhãn và mô tả của mẫu.
Nội dung dùng chung nguồn `src/data/vps-environments.ts`; không sửa trang Thuê VPS.
Tab quy trình, ba bước và lưu ý cũ được thay bằng nội dung mẫu đã duyệt.

Logo giống mẫu, lưu riêng tại `public/images/cloud-server/operating-systems/`
và `public/images/cloud-server/one-click/`.
Họa tiết `public/images/cloud-server/environments-grid.svg` được vẽ riêng,
không dùng ảnh nền của VPS. Nguồn và hash: `docs/cloud-environments-assets.json`.

Component: `src/components/cloud-server/environments.tsx` và CSS module tương ứng;
nội dung: `src/data/cloud-environments.ts`. Có phím Arrow Left/Right, Home/End,
tên/quan hệ tab-panel rõ ràng và hai nhóm nội dung đều hiển thị khi tắt JavaScript.
Giữ spacing section 64/48/40px; các thẻ trong cùng nhóm có chiều cao đồng đều.

Kiểm tra: `npm run test:cloud-environments`, gồm 14 chiều rộng, hai tab,
đối chiếu nguyên nội dung và hash logo với mẫu Thuê VPS,
ảnh, clipping/overflow, keyboard, cảm ứng, no-JS và axe.
Screenshot/kết quả tại `artifacts/cloud-server/environments/qa/`;
production local tại `artifacts/cloud-server/environments/production-qa/`.

## Nội dung và nguồn

Ngay sau `#cloud-deployment`, thứ tự các section chung là:
`#nang-luc` (30.000+ Doanh Nghiệp Tin Tưởng InterData), `#khach-hang`
(Feedback), `#bao-chi`, `#doi-tac` (Kiến tạo tương lai), `#doi-tac-cong-nghe`.
Thay hai nhóm thẻ chữ và cụm đối tác Cloud cũ bằng `CapacitySection`,
`CustomerProof controlsOnCards centerHeadings`, `EducationSection` và
`TechnologyPartners`, đúng cách ghép của `/thue-vps/`.
Giữ nguyên copy, ảnh, logo, liên kết và hành vi carousel từ component chung;
bật `withBadgeIcons` và áp dụng spacing 64/48/40px riêng trên Cloud.
Hình địa cầu trong Đối tác công nghệ dùng bản gốc của component Thuê VPS.

Đối chiếu ngày 20/10/2026:

- [Cloud Server chính thức](https://interdata.vn/cloud-server/): nền tảng CPU,
  NVMe U.2, quyền quản trị, hỗ trợ, nâng cấp và phạm vi vận hành.
- `D:/InterData/cloud-server/app/menu.json`: hai nhóm giá `40`, `41` và URL dịch vụ.
- `D:/InterData/cloud-server/components/faq.js`: 16 FAQ gốc, giữ nguyên nội dung.
- [Nhóm AMD Cloud 40](https://support.interdata.vn/packages.php?gid=40):
  giá, mô tả cấu hình, chu kỳ và liên kết đặt hàng.
- [Nhóm Platinum Cloud 41](https://support.interdata.vn/packages.php?gid=41):
  cùng các trường dữ liệu và trạng thái tồn kho.
- `src/data/content.ts`: giữ nguyên lời nhận xét BALICO, UMIX và Jobkey;
  bài báo VTV, Thanh Niên và Dân Trí. Không gán nhận xét về dịch vụ khác thành
  nhận xét riêng cho Cloud Server.
- Logo đối tác, logo website, header, footer và widget liên hệ là nhận diện dùng
  chung của website. Khối minh chứng doanh nghiệp dùng ảnh/logo gốc đã duyệt trên Thuê VPS.

Không đưa thêm SLA, khả năng HA/failover, tự động backup, nâng cấp không downtime,
license miễn phí hoặc ưu đãi chưa được xác nhận. Network Port 10 Gbps được phân biệt
với tốc độ truyền thực tế. Phạm vi cài đặt, di chuyển dữ liệu, phiên bản Linux và
tùy chọn backup cần xác nhận theo gói.

## Giá và đặt hàng

- Server fetch giá trực tiếp, timeout 15 giây, revalidate 60 giây; mỗi nhóm lỗi độc lập.
- API riêng `/api/cloud-server-pricing/?gid=40` hoặc `gid=41`, từ chối các nhóm khác.
- Hiển thị sáu chu kỳ; giá là tổng tiền của chu kỳ đang chọn, không tự quy đổi ra tháng.
- Giữ `product_url`, bổ sung `billingcycle` đang chọn khi đặt hàng.
- Bỏ các gói có tên `custom` khỏi danh sách thông thường, như mẫu Thuê VPS.
- Giữ các gói Hà Nội trong dữ liệu nhóm 41; không đổi tên hoặc gộp với gói khác.
- Gói được hệ thống đánh dấu hết tài nguyên dẫn đến liên hệ kiểm tra tình trạng.
  Không suy diễn trạng thái từ `quantity_available=0` nếu không bật `stockcontrol`.
- Tải lỗi: thông báo rõ, tự thử tải ở client và có nút thử lại, không dùng giá giả.
- Tắt JavaScript: nội dung chính, bốn gói đầu, FAQ và hai dòng dịch vụ vẫn đọc được;
  liên kết trong `noscript` dẫn đến trang chính thức của cả hai dòng để xem thêm giá.

## Hình ảnh riêng

Hai card “ĐA DẠNG LỰA CHỌN” dùng ảnh mới theo phong cách giải pháp doanh nghiệp:
`amd-business-solutions.webp` (đội ngũ triển khai ứng dụng) và
`intel-business-operations.webp` (quản trị vận hành). Ảnh được tạo riêng bằng
built-in `image_gen`, tối ưu WebP; giữ nội dung, liên kết và bố cục card.
Đặt ảnh theo mép trên để giữ gương mặt trong khung desktop và mobile.
Prompt, nguồn, kích thước và SHA-256:
[`cloud-service-business-images.json`](./cloud-service-business-images.json).
Hai ảnh phần cứng `amd.webp` và `intel.webp` cũ được giữ trong bộ tài sản gốc,
không còn dùng ở hai card này.

9 ảnh được tạo bằng built-in `image_gen`, tối ưu WebP và lưu tại
`public/images/cloud-server/`: `hero`, `cluster`, `amd`, `intel`, `web`, `api`,
`data`, `network`, `advisor`. `cluster` và `advisor` có alpha transparency.

Đây là ảnh minh họa được tạo bằng AI, không phải bằng chứng chụp trung tâm dữ liệu
hoặc nhân viên thực tế của InterData. Các ảnh này riêng cho phần dịch vụ Cloud;
các section minh chứng doanh nghiệp được clone cả ảnh/logo của Thuê VPS theo yêu cầu.
Prompt đầy đủ, đường dẫn nguồn, kích thước và SHA-256:
[`cloud-server-images.json`](./cloud-server-images.json).

## Các file chính

- `src/app/(website)/cloud-server/page.tsx`: route, metadata/canonical/Open Graph.
- `src/components/cloud-server/`: giao diện, pricing client và hai card dịch vụ.
- `src/data/cloud-server.ts`, `cloud-server-faq.ts`: nội dung Cloud Server.
- `src/lib/cloud-server-pricing.ts`: kiểm tra/chuẩn hóa dữ liệu upstream.
- `src/data/content.ts`: chuyển duy nhất `links.cloud` sang `/cloud-server/`
  để điều hướng dùng trang vừa tạo trong cùng website.

## Kiểm tra local

Chạy preview trước, sau đó ở terminal khác:

```powershell
$env:TEST_BASE_URL='http://localhost:3100'
npm run test:cloud-server
npm run typecheck
npm run lint
npm run build
```

Kết quả kỳ vọng của browser QA bắt đầu bằng `PASS Cloud Server: 6 widths`.
Script đối chiếu API với upstream, toàn bộ chu kỳ, thông số, tổng tiền, checkout,
trạng thái gói, mở rộng danh sách, hai card dịch vụ, bàn phím/cảm ứng carousel
khách hàng và báo chí, FAQ,
schema, ảnh, hash ảnh không trùng VPS, overflow, axe và fallback không JavaScript.
Kích thước kiểm tra: 320, 390, 768, 1024, 1440, 1920px.

Kết quả và screenshot: `artifacts/cloud-server/qa/` (dev),
`artifacts/cloud-server/production-qa/` (production preview).
Kiểm chứng local không đồng nghĩa trang đã được triển khai lên tên miền chính thức.

### Kết quả và giới hạn hồi quy

Build production (kèm TypeScript) và lint đạt. Bộ Cloud Server QA đạt ở cả dev
và production local trên sáu chiều rộng đã nêu; không có lỗi axe trong `main`,
lỗi JavaScript hoặc ảnh không tải được. Kết quả production local nằm trong
thư mục riêng nêu trên.

`npm run test:vps` hiện dừng ở so sánh dữ liệu trước khi chạy browser: ba URL
trong nguồn legacy vẫn là `/platinum/`, `/vps-gold-enterprise-1gbps`, `/vps-linux`,
trong khi JSON của project đã trỏ đến `/vps-platinum/`, `/vps-gold/`, `/vps-linux/`.
Đã kiểm tra dữ liệu và verifier VPS không có thay đổi so với HEAD.
Không sửa hợp đồng dữ liệu hoặc test VPS ngoài phạm vi để vượt qua kiểm tra này.
Kiểm tra trực tiếp production `/thue-vps/` tại 320/1440px đạt: HTTP 200, bảng giá
AMD hiển thị, không tràn ngang, không có lỗi JavaScript. Báo cáo:
`artifacts/cloud-server/vps-regression.json`.
