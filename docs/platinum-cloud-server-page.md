# Platinum Cloud Server

Trang dịch vụ thay thế Intel Platinum Cloud Gen 2 tại `/platinum-cloud-server/`.
Clone phiên bản AMD Cloud Server hiện tại, gồm Hero, dải thông số, bảng giá,
nền tảng, sáu ứng dụng quanh hình trung tâm, One Click, năng lực, minh chứng
doanh nghiệp, đối tác, FAQ và CTA cuối. Đã bỏ hai section “Platinum Cloud phù hợp
với nhu cầu nào?” và “Chủ động quản trị và vận hành” theo yêu cầu tinh gọn trang.
Các card ứng dụng chỉ có icon, nội dung và liên kết, không có ảnh minh họa riêng.
CTA tái sử dụng `ConsultationCta` cùng ảnh tư vấn viên của trang Thuê VPS.

## Thay thế dịch vụ hiện có

- Giữ ID và tên của entry Intel Platinum Cloud Gen 2 trong `service-catalog.ts`
  và `cloud-server.ts`; chỉ đổi `href` về `/platinum-cloud-server/`.
- Navigation, danh mục và bảng so sánh dịch vụ dùng lại các entry đó, không thêm
  sản phẩm hoặc trang dịch vụ song song.
- `/intel-platinum-gen2-cloud/` chuyển hướng 308 về route mới.
- Canonical, Open Graph và Service JSON-LD dùng URL mới.
- Giữ chính sách noindex/nofollow của project. Chưa deploy lên website công khai.

## Nội dung và nguồn

Đối chiếu ngày 20/10/2026:

- [Trang Intel Platinum Gen 2 hiện tại](https://interdata.vn/intel-platinum-gen2-cloud/).
- [API nhóm Platinum, gid 41](https://support.interdata.vn/packages.php?gid=41&module).
- [Intel Xeon Scalable thế hệ 2](https://www.intel.com/content/www/us/en/ark/products/series/192283/2nd-gen-intel-xeon-scalable-processors.html).

Nội dung riêng tập trung vào Intel Xeon Platinum thế hệ 2, NVMe U.2, vCPU, RAM,
lưu lượng hàng tháng và Network Port 10 Gbps. Không chuyển tên AMD EPYC, model CPU,
benchmark hoặc số liệu thương mại của AMD sang trang Platinum. Không hứa HA,
backup mặc định, giấy phép miễn phí hoặc nâng cấp không downtime khi chưa xác nhận.
Tốc độ cổng mạng được phân biệt với tốc độ truyền thực tế.

FAQ giải thích nền tảng Platinum, quan hệ với hệ điều hành Linux, mạng, chọn OS,
tổng tiền chu kỳ, nâng cấp, sao lưu và các gói Hà Nội.

## Giá, chu kỳ và địa điểm

`src/lib/platinum-cloud-server-pricing.ts` chỉ lấy nhóm 41, timeout 15 giây và
revalidate 60 giây. API retry riêng: `/api/platinum-cloud-server-pricing/`.
Không dùng nhóm VPS Platinum 29/101 hoặc AMD Cloud 40.

API hiện có 24 sản phẩm: 12 gói tiêu chuẩn và 12 gói có hậu tố HN. Giữ tất cả
sản phẩm, thứ tự, pid, tên kể cả khoảng trắng gốc, description, giá từng chu kỳ
và `product_url`. Không bỏ các gói HN hoặc suy diễn giá địa điểm này từ địa điểm khác.
Gói `plan-3-hcm` được nhấn mạnh như cấu hình gợi ý; bốn gói đầu hiển thị khi thu gọn.

Sáu chu kỳ 1/3/6/12/24/36 tháng hiển thị tổng tiền của kỳ. Không quy đổi giá năm
ra tháng. Giá âm/không hợp lệ không được xem là giá bán. Checkout giữ URL nguồn
và bổ sung `billingcycle` tương ứng; kiểm tra HTTPS, domain cổng khách hàng và
không có user/password trong URL.

Tôn trọng `stockcontrol` và `stocklevel`. Tại thời điểm kiểm tra, 12 gói HN
đang hết tài nguyên nên dẫn tới liên hệ thay vì đặt hàng. Không dùng
`quantity_available=0` làm chỉ báo hết hàng nếu không bật kiểm soát tồn kho.
Mô tả HN không công bố cùng thông tin IPv4 như các gói tiêu chuẩn: hiển thị
đúng description, không tự thêm IPv4; hướng người dùng xác nhận tùy chọn IP.

Khi nguồn giá lỗi, nội dung chính vẫn hiển thị và bảng giá có nút thử lại.
Không JavaScript vẫn có bốn gói đầu, FAQ và liên kết đến danh mục Platinum Cloud
trên cổng đăng ký. Không tạo giá tĩnh dự phòng hoặc thực hiện đặt hàng/thanh toán.

## Hình ảnh và CSS

- Hero riêng: `/images/platinum-cloud-server/hero-xeon-cloud-v1.webp`, chip
  Intel Xeon Platinum trước cụm máy chủ, 1930×815, khoảng 94 KiB.
- Trung tâm ứng dụng: `/images/platinum-cloud-server/usecase-platinum-center-v1.webp`,
  minh họa 3D máy chủ và chip Intel, 1254×1254, khoảng 224 KiB, giữ nền trong suốt.
- Nền tảng `#nen-tang`: thiết kế “Phần cứng và kết nối” của Thuê VPS, tái sử dụng CSS `vps/infrastructure.module.css` với bốn hàng ảnh/nội dung xen kẽ và số 01–04. Nội dung riêng cho Intel Xeon Platinum Gen 2, NVMe U.2, Network Port 10 Gbps và địa điểm triển khai tại Việt Nam; giữ lưu ý về tốc độ thực tế, backup và IPv4 theo gói. Ảnh CPU dùng `/images/vps-platinum/platform.webp`; ba ảnh còn lại dùng bộ `vps/infrastructure-v4/` về storage, network và datacenter. Không dùng thông số NVMe Gen 4 hoặc giới hạn 1 Gbps của VPS. Section có padding 24px/32px trên desktop từ 1000px và 40px/32px ở màn hình nhỏ hơn, đúng section mẫu. Không sửa component hoặc CSS Thuê VPS.
- CTA dùng ảnh chung hiện có; không sửa ảnh hoặc source của trang mẫu.

Hai ảnh mới tạo bằng built-in `image_gen`, tối ưu Sharp WebP quality 85.
Prompt, nguồn và đường dẫn cuối ở [platinum-cloud-server-images.json](./platinum-cloud-server-images.json).
Đây là hình minh họa, không phải ảnh xác thực datacenter InterData hoặc bằng chứng
cho model CPU cụ thể được cấp ở từng gói.

CSS riêng clone AMD Cloud, đổi namespace biến và ID sang Platinum Cloud.
Heading Hero “Platinum Cloud Server” nằm trên một dòng ở desktop từ 960px;
ở màn hình nhỏ hơn vẫn được xuống hàng và giữ cụm “Cloud Server” liền nhau.
Nhịp section là 80px desktop, 64px tablet và 48px mobile; CTA dùng 80/52px
theo component Thuê VPS. Các trang AMD Cloud, Thuê VPS, VPS Platinum và component
chung được giữ nguyên.

## Kiểm tra local

```powershell
node --dns-result-order=ipv4first scripts/verify-platinum-cloud-server.mjs
npm run lint
npm run typecheck
npm run build
```

Dev server mặc định `http://localhost:3100`; có thể truyền `TEST_BASE_URL`.
Script tạo fixture tạm để kiểm tra lỗi/phục hồi và xóa trong `finally`, vì vậy
chỉ build sau khi script đã kết thúc. Đặt `SKIP_RETRY_FIXTURE=1` khi chạy với
production server vì server này không nạp route mới tạo.

Kiểm tra đối chiếu API thật cho 24 sản phẩm qua sáu chu kỳ, tên, description,
thứ tự, checkout, tồn kho và dữ liệu không hợp lệ; metadata, schema, redirect,
mở rộng/thu gọn, bàn phím, One Click, FAQ, CTA, anchor, không JavaScript và retry.
Responsive tại 320/390/768/1024/1440/1920px kiểm tra ảnh, nút Hero, tràn ngang,
padding và axe WCAG A/AA. Bằng chứng lưu tại `artifacts/platinum-cloud-server/`.

Kết quả 20/10/2026: bộ kiểm tra Platinum Cloud, ESLint toàn project, TypeScript,
Prettier và build production đều đạt. Cả sáu viewport đạt kiểm tra ảnh, overflow,
padding và accessibility; bảng giá mở rộng đủ 24 gói ở chu kỳ 36 tháng không tràn
hoặc cắt giá. Production local đạt HTTP 200, API gid 41, checkout chu kỳ năm,
stock control, redirect 308, 390/1440px, không JavaScript và không có lỗi runtime.

Build có một cảnh báo timeout nguồn blog bên ngoài, vẫn hoàn tất đủ 35 route.
Snapshot xác nhận giữ nguyên công việc trước đó; hai file danh mục chỉ thay URL
Platinum, không sửa trang AMD Cloud hoặc component chung. Server production
preview tạm đã dừng; dev preview ở `http://localhost:3100/platinum-cloud-server/`.
Chưa deploy hoặc thực hiện đặt hàng/thanh toán.

Section nền tảng mới được đối chiếu trực tiếp với “Phần cứng và kết nối” của
Thuê VPS ở 320/390/768/999/1000/1024/1200/1440/1920px. Bố cục, màu, typography,
padding và thứ tự ảnh responsive khớp section mẫu; ảnh tải đủ, không tràn ngang
hoặc cắt chữ, axe WCAG A/AA không phát hiện lỗi. Snapshot xác nhận nội dung,
ảnh và liên kết ngoài `#nen-tang` không đổi, note bảng giá vẫn được loại bỏ,
component Thuê VPS không thay đổi. Bằng chứng:
`artifacts/platinum-cloud-server/hardware-redesign/`.
