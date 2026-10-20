# AMD Cloud Server

Trang thay thế cho AMD Cloud tại `/amd-cloud-server/`, dùng layout website chung.
Thiết kế clone từ VPS Linux: Hero, dải thông số, bảng giá, nền tảng CPU,
sáu ứng dụng quanh hình trung tâm, One Click, bảng so sánh, hạ tầng và quy trình
ba bước, năng lực doanh nghiệp, khách hàng/báo chí/giáo dục, đối tác và FAQ.
CTA cuối dùng thiết kế của trang Thuê VPS qua component chung `ConsultationCta`.
CSS module riêng giữ nguyên màu sắc, typography và nhịp section của trang mẫu:
80px trên desktop, 64px trên tablet và 48px trên mobile.

## Thay thế trang dịch vụ

Trước thay đổi, checkout chưa có trang chi tiết AMD Cloud. Danh mục dịch vụ và
trang Cloud Server đang trỏ đến trang công khai `/amd-epyc-gen3-cloud/`.
Hai entry hiện có được cập nhật về `/amd-cloud-server/`, giữ nguyên ID, tên và
thông tin sản phẩm trong danh mục. Không thêm entry dịch vụ thứ hai.
URL cũ được chuyển hướng 308 về route được yêu cầu bằng `next.config.ts`.
Canonical, Open Graph và Service JSON-LD đều dùng URL mới.
Giữ noindex/nofollow hiện có của project.

## Nội dung và nguồn

Đối chiếu ngày 20/10/2026:

- [Trang AMD EPYC Gen 3 hiện tại](https://interdata.vn/amd-epyc-gen3-cloud/).
- [API AMD Cloud, gid 40](https://support.interdata.vn/packages.php?gid=40&module).
- [AMD EPYC 7003](https://www.amd.com/en/products/processors/server/epyc/7003-series.html).

Nội dung riêng tập trung vào AMD EPYC Gen 3, NVMe U.2, vCPU, RAM, lưu lượng theo
gói và Network Port 10 Gbps. Phân biệt tốc độ cổng mạng với tốc độ truyền thực tế.
Không đưa model CPU cụ thể cho mọi gói, kết quả benchmark, HA/failover, nâng cấp
không downtime hoặc ưu đãi chưa được xác nhận vào nội dung.
FAQ giải thích quan hệ giữa nền tảng AMD Cloud và hệ điều hành Linux, điều kiện
chọn OS, tổng tiền theo chu kỳ, nâng cấp, sao lưu và cấu hình riêng.

## Giá và đặt hàng

`src/lib/amd-cloud-server-pricing.ts` chỉ lấy nhóm 40, timeout 15 giây và
revalidate 60 giây. API retry riêng: `/api/amd-cloud-server-pricing/`.
Khi nguồn giá lỗi, nội dung chính vẫn hiển thị; bảng giá có thông báo và nút thử lại.

Giữ toàn bộ 13 sản phẩm của storefront AMD: 12 gói tiêu chuẩn và Customize,
đúng thứ tự, pid, tên, description, giá và `product_url`. Chỉ hiển thị bốn gói đầu
khi thu gọn; gói 3 giữ vị trí nhấn mạnh. Không dùng bộ lọc slug của Linux vì AMD
có nhiều quy tắc slug khác nhau, bao gồm `plan-6-hcm` và `plan-7-hcm`.

Sáu chu kỳ 1/3/6/12/24/36 tháng hiển thị tổng tiền của kỳ, không quy đổi ra giá
tháng. Giá âm hoặc không hợp lệ được loại khỏi các chu kỳ có thể đăng ký.
Giữ checkout gốc, bổ sung `billingcycle` tương ứng. Kiểm tra checkout HTTPS,
domain `support.interdata.vn` và không có user/password trong URL.

Tôn trọng `stockcontrol` và `stocklevel`: gói hết tài nguyên chuyển sang liên hệ
thay vì đặt hàng. Không coi `quantity_available=0` là hết hàng nếu không bật
kiểm soát tồn kho. Tại thời điểm kiểm tra, Customize chỉ có giá tháng và đang
hết tài nguyên; thẻ vẫn hiển thị để giữ thông tin dịch vụ hiện có.

Không JavaScript vẫn đọc được bốn gói đầu, FAQ, nội dung dịch vụ và liên kết đến
danh mục AMD Cloud trên cổng đăng ký.

## Hình ảnh và phạm vi thay đổi

Dùng ảnh Hero riêng cho AMD Cloud, ảnh nền tảng AMD EPYC và ảnh VPS chung phù hợp:

- Hero: `/images/amd-cloud-server/hero-epyc-cloud-v1.webp`, chip AMD EPYC trước cụm máy chủ Cloud; ảnh riêng, không trùng VPS AMD. Prompt và nguồn tạo ảnh bằng built-in `image_gen` ở [amd-cloud-server-hero-image.json](./amd-cloud-server-hero-image.json).
- Nền tảng: `/images/vps-amd/platform-epyc-7003-amd.webp`.
- Trung tâm ứng dụng: `/images/vps-amd/usecase-amd-center-v5.webp`, cùng ảnh với section tương ứng của VPS AMD. Các card ứng dụng giữ icon, tiêu đề, mô tả và liên kết; bỏ hình minh họa riêng, dùng một cột nội dung để không giữ khoảng trống của ảnh ở desktop/mobile.
- Hạ tầng: bộ ảnh VPS chung hiện có.
- CTA cuối: tái sử dụng `ConsultationCta` và ảnh `/images/cta/consultation-woman-upper-body.webp` của trang Thuê VPS. Giữ thiết kế khung xanh, icon trang trí, kiểu chữ và bố cục responsive của trang mẫu; nội dung dành cho AMD Cloud Server. Nút “Xem bảng giá” dẫn tới `#bang-gia`, nút “Liên hệ tư vấn” giữ `/lien-he/`. CTA có padding 80px từ tablet trở lên và 52px trên mobile như trang Thuê VPS; các section khác giữ nhịp riêng của AMD Cloud.

Các hình ảnh là minh họa, không được mô tả là ảnh xác thực datacenter InterData.
Không sửa trang VPS Linux hoặc component One Click chung. Thông tin doanh nghiệp
tái sử dụng component chung. Với phần Cloud Server đang có thay đổi dở dang,
chỉ sửa `cloudServices[0].href` để cập nhật điểm đến AMD Cloud.

## Kiểm tra local

```powershell
node --dns-result-order=ipv4first scripts/verify-amd-cloud-server.mjs
npm run lint
npm run typecheck
npm run build
```

Dev server mặc định ở `http://localhost:3100`; có thể truyền `TEST_BASE_URL`.
Test tạo route fixture tạm để kiểm tra lỗi/retry và xóa trong `finally`;
chạy build sau khi fixture được dọn. Với production preview, đặt
`SKIP_RETRY_FIXTURE=1` vì production server không nạp route mới tạo.

Test đối chiếu dữ liệu API thật cho mọi gói và chu kỳ, checkout, tồn kho,
metadata, schema, chuyển hướng, mở rộng/thu gọn, bàn phím, FAQ, One Click,
CTA, anchor, không JavaScript và lỗi/phục hồi. Responsive tại
320/390/768/1024/1440/1920px kiểm tra ảnh, tràn ngang, kích thước hai nút Hero,
nhịp padding và axe WCAG A/AA. Bằng chứng lưu ở `artifacts/amd-cloud-server/`.

Đây là thay đổi và xác thực local. Chưa deploy hoặc thực hiện đặt hàng/thanh toán.

Kết quả 20/10/2026: bộ kiểm tra AMD Cloud, Prettier, ESLint, TypeScript và build
production đều đạt. Sáu viewport không tràn ngang, ảnh tải đầy đủ, padding theo
nhịp trang Linux và axe WCAG A/AA không phát hiện lỗi. Đã kiểm tra thêm bảng giá
mở rộng ở chu kỳ 36 tháng, vị trí hàng giá và thông số nền tảng sau tinh chỉnh.
Ảnh, dữ liệu API và kết quả nằm trong `results.json`, `final-layout.json` và
`production.json` trong thư mục bằng chứng.

Production preview local đạt HTTP 200, API 13 sản phẩm, checkout chu kỳ năm,
redirect 308, không JavaScript, 390/1440px và không có lỗi runtime. Server preview
tạm đã dừng; dev server hiện có vẫn ở cổng 3100. Đối chiếu hash 56 tệp ban đầu
xác nhận giữ nguyên công việc đã có và trang Linux; hai file danh mục chỉ đổi
điểm đến AMD Cloud như mô tả ở trên. `next-env.d.ts` do build sinh ra đã được
khôi phục về cấu hình dev ban đầu.

CTA cuối đã đối chiếu computed style với Thuê VPS tại
320/390/768/1024/1440/1920px: ảnh, gradient, bo góc, padding và typography khớp;
không tràn ngang, axe WCAG A/AA không phát hiện lỗi. Hai liên kết hoạt động với
bàn phím; nút bảng giá cuộn tới đúng section. Snapshot xác nhận các nội dung,
ảnh và liên kết ngoài CTA không thay đổi; component CTA chung và trang Thuê VPS
giữ nguyên. Bằng chứng ở `artifacts/amd-cloud-server/cta-refinement/`.
