# Trang Thuê VPS

Route: `/thue-vps/`. Trang sử dụng layout website chung, font Be Vietnam Pro,
color tokens hiện tại và contact widget của project.

## Nguồn nội dung

Văn bản, danh sách, FAQ, ảnh, logo và benchmark được lấy từ working tree của
`D:/InterData/thue-vps`. Manifest tại `docs/vps-source-manifest.json` ghi hash
của các tệp nguồn và 49 ảnh/logo đã sao chép. Ảnh nằm tại `public/images/vps/`;
không sử dụng asset prefix của ứng dụng cũ.

Ngoại lệ đã được yêu cầu: Feedback và Báo chí dùng nội dung homepage qua
`src/components/shared/customer-proof.tsx`, chung với `/vps-amd/`. Hai nhóm
nội dung này không còn lấy từ landing page cũ; kiểm tra đồng nhất giữa ba
route bằng `npm run test:vps-amd`.

Nội dung Windows đang ẩn và nhóm Platinum Viettel đang hiển thị theo hai cờ
visibility trong project nguồn. Benchmark AMD Server và máy chủ ảo Intel giữ
nguyên các ghi chú về phạm vi đo. FAQ hiển thị và FAQPage dùng chung dữ liệu.

Đồng bộ lại nội dung từ nguồn khi có thay đổi đã được duyệt:

```powershell
node scripts/import-vps-content.mjs 'D:\InterData\thue-vps'
```

## Bảng giá

Server gọi `https://support.interdata.vn/packages.php?gid=...` song song và
revalidate mỗi 60 giây, giống project nguồn. Các gid: Hot Deals `100`, AMD `67`,
Platinum `29`, Platinum Viettel `101`, Gold `20`, Linux `3`; tab mặc định là `3`.

Giá thường lấy monthly nếu lớn hơn 0, nếu không lấy quarterly và hiển thị
`/ 3 tháng`. Gói Custom không xuất hiện trong bảng giá thường. Mỗi bảng hiển thị
4 gói trước khi mở rộng. Hot Deals giữ chu kỳ 1/2/3 năm, giá gốc được cung cấp
trong project nguồn và không hiển thị badge phần trăm giảm đang bị ẩn ở nguồn.

URL đăng ký lấy từ `product_url`; Hot Deals thêm đúng `billingcycle` đã chọn.
Client tự thử tải các nhóm thiếu qua `/api/vps-pricing/?gid=...`, đồng thời có
nút thử lại khi lỗi. Không sử dụng giá mẫu để thay thế lỗi API.

## Bản thiết kế theo mẫu ngày 14/10/2026

- Hero nền navy với minh họa VPS; dải logo khách hàng đang tạm ẩn.
- Bố cục chính: Hero, lợi ích, 6 dòng VPS, 6 nhu cầu sử dụng,
  bảng giá thường, Hot Deals, hạ tầng Việt Nam, quy trình, khách hàng/báo chí,
  FAQ và CTA. Header/footer và contact widget dùng bản chung của website.
- Bảng giá desktop hiển thị 4 gói đầu tiên theo từng dòng, mở thêm để xem tất
  cả; mobile có vùng cuộn và nút điều hướng. Giá, chu kỳ và checkout giữ luồng cũ.
- So sánh, định nghĩa VPS, hệ điều hành/1-Click Applications và benchmark được
  giữ trong phần mở rộng `#vps-technical-details`. Giữ nguyên ghi chú phạm vi đo.
- FAQ hiển thị 5 câu đầu, mở rộng để xem đủ 20 câu; FAQPage vẫn dùng toàn bộ
  dữ liệu gốc. Ví dụ terminal được giữ trong phần Tìm hiểu về VPS.
- Các thành phần nội dung dùng chung nằm trong `src/components/vps/showcase.tsx`;
  Hero và bộ chọn dòng VPS được tách riêng, sử dụng minh họa tạo theo mẫu.

### Hero theo mẫu hero-section.png

Hero được tách riêng trong `src/components/vps/hero.tsx` và `hero.module.css`.
Tiêu đề 3 dòng “Thuê VPS / Hiệu năng cao / cho mọi nhu cầu”, chữ gradient,
CTA dạng pill, 5 thẻ thông tin quanh máy chủ và dải 4 lợi ích trắng chồng nhẹ
lên mép dưới. Header chung, bảng giá và phần còn lại của trang giữ nguyên.
CTA thứ hai vẫn là kênh tư vấn hiện có; nội dung bảo vệ hạ tầng dùng thông tin
Firewall của InterData. Minh họa được tạo bằng công cụ imagegen built-in,
lưu tại `public/images/vps/hero-vps-cloud-v2.webp`; prompt và thông số trong
`docs/vps-hero-image-v2.json`. Đây là hình minh họa, không phải ảnh hạ tầng thực.
Trên tablet/mobile, minh họa nằm dưới tiêu đề và các thẻ nổi được ẩn để giữ
nội dung dễ đọc. Kiểm tra và ảnh tại `artifacts/vps-hero-v2/`.

### Các dòng VPS theo mẫu “Đa dạng VPS InterData hiện đại.png”

Section `#vps-range-title` được tách vào `service-range.tsx` và
`service-range.module.css`, re-export qua `showcase.tsx`. Desktop dùng lưới
3 cột × 2 hàng, tablet 2 cột, mobile 1 cột. Sáu dòng theo thứ tự AMD, Platinum,
Gold, Linux, n8n, Vibe Coding; mỗi thẻ có màu riêng, hình ở góc trên bên phải,
3 đặc điểm và CTA bo góc nhẹ. Không có dải lợi ích của mẫu 5 thẻ trước đó.

`src/data/vps-service-range.ts` chứa danh sách được biên soạn cho section này.
URL của 4 dòng VPS truyền thống lấy từ dữ liệu gốc; URL n8n/Vibe Coding lấy
từ nhóm automation trong `src/data/content.ts`. Không thay đổi các nhóm hay
dữ liệu bảng giá, bao gồm nhóm Platinum Viettel.

Nội dung n8n và Vibe Coding được đối chiếu với trang sản phẩm chính thức:

- [VPS n8n](https://interdata.vn/vps-n8n/): template tích hợp n8n, quyền root,
  nâng cấp tài nguyên.
- [VPS Vibe Coding](https://interdata.vn/vps-vibe-coding/): chọn template
  EzyPlatform; gói chỉ hỗ trợ mã nguồn EzyPlatform. Giới hạn này được hiển thị
  ngay trên thẻ, không quảng bá như môi trường dành cho mọi mã nguồn.

Nhãn mô tả nền tảng được dùng thay cho xếp hạng chưa xác thực. Sáu minh họa
được tạo riêng bằng imagegen built-in, lưu trong `public/images/vps/range-v3/`;
prompt và thông số tại `docs/vps-range-v3-images.json`.

Đã kiểm tra build, lint, typecheck, ảnh, kích thước CTA, 6 liên kết, keyboard,
no-JavaScript và accessibility tại 320/390/768/1024/1440/1536/1920px.
Kết quả tại `artifacts/vps-range-v3/results.json`; ảnh section tại
`artifacts/vps-range-v3/section-1536.png`. Các bản chụp section chỉ ẩn header
và contact widget trong lúc chụp để không che nội dung.
Hash của Hero, dữ liệu/bảng giá, API, trang chính và các file AMD đang chỉnh
được đối chiếu nguyên vẹn. `showcase.tsx` giữ nguyên; dải logo khách hàng vẫn
chưa được render.

## Section ứng dụng VPS theo mẫu 14/10/2026

`UseCases` được tách thành `src/components/vps/use-cases.tsx` và CSS module
riêng. Thay carousel bằng lưới sáu thẻ: website, phát triển phần mềm, database,
hệ thống doanh nghiệp, quản trị từ xa và các công cụ khác. Desktop có 3 cột,
700–1099px có 2 cột, màn hình nhỏ có 1 cột. Mỗi thẻ có minh họa, nội dung và
liên kết “Tìm hiểu thêm” với tên truy cập riêng.

Dữ liệu trình bày nằm ở `src/data/vps-use-cases.ts`. Giữ nguyên JSON nguồn,
Hero, các dòng VPS, bảng giá và những section còn lại. Thẻ quản trị từ xa dùng
SSH/Linux; phần mềm doanh nghiệp cần tương thích với môi trường được chọn.
Nút trên thẻ doanh nghiệp dẫn tới `/lien-he/` để trao đổi nhu cầu triển khai.
Các thẻ còn lại dẫn tới hướng dẫn InterData đã đối chiếu:

- Website: https://interdata.vn/blog/cai-dat-wordpress-vps-ubuntu-lamp-stack/
- Phát triển: https://interdata.vn/blog/huong-dan-deploy-nodejs-tren-vps/
- Database: https://interdata.vn/blog/cai-dat-nginx-php-mysql-tren-ubuntu-vps/
- Quản trị: https://interdata.vn/blog/huong-dan-su-dung-vps/
- Công cụ: https://interdata.vn/blog/huong-dan-cai-dat-docker-tren-vps/

Sáu ảnh minh họa được tạo bằng imagegen built-in, tối ưu WebP và giữ alpha tại
`public/images/vps/use-cases-v2/`. Prompt và đường dẫn ảnh gốc được lưu trong
`docs/vps-use-cases-v2-images.json`.

Kiểm tra section tại 320/390/768/1024/1440/1536/1920px: ảnh tải đúng, không
tràn ngang, CTA cao ít nhất 44px, các hàng thẻ và CTA thẳng hàng, tab bàn phím,
hiển thị không JavaScript và không có lỗi axe được phát hiện. Ảnh chụp và
kết quả ở `artifacts/vps-use-cases-v2/`. Các file ngoài phạm vi và hai section
còn lại trong `showcase.tsx` được đối chiếu nguyên vẹn bằng snapshot/hash.
Build, lint và typecheck đạt. Bộ `test:vps` toàn trang chạy với dev preview
cổng 3100 cũng đạt; báo cáo tại `artifacts/vps-use-cases-v2/full-qa/results.json`.
Đây là kiểm chứng local, chưa triển khai lên tên miền chính thức.

## Cân đối kích thước ba section 14/10/2026

Hero, các dòng VPS và ứng dụng VPS dùng chung khung tối đa 1248px, thẳng
hàng với `.container` của trang. Lề ngang dùng 48px trên desktop, 32px dưới
1200px và 20px dưới 640px. Dải lợi ích Hero cũng theo cùng khung.

Hero giới hạn H1 ở 56px; hai tiêu đề section giới hạn 40px. Giảm kích thước
minh họa, icon, thẻ và khoảng trống; bỏ quy tắc tự phóng lớn trên 1600px.
Giữ CTA cao tối thiểu 44px và giữ nguyên nội dung, hình ảnh, thứ tự, URL,
dữ liệu giá, xử lý tương tác và các section còn lại. Chỉnh giao diện chỉ
trong ba CSS module tương ứng.

Đối chiếu hash các component, dữ liệu và file ngoài phạm vi. Kiểm tra trên
production preview local ở 14 chiều rộng từ 320 đến 1920px: khung nội dung
thẳng hàng, không tràn ngang, không cắt tiêu đề, thẻ chuyển cột đúng và không
có lỗi axe được phát hiện tại sáu chiều rộng chính. Build, lint, typecheck và
bộ `test:vps` toàn trang đạt. Kết quả và ảnh ở `artifacts/vps-balance/`;
regression toàn trang trên dev preview ở `artifacts/vps-balance/full-qa/`.

## Section lợi thế InterData theo mẫu 14/10/2026

`src/components/vps/advantages.tsx` và CSS module riêng thay phần lợi ích
trước nhóm các dòng VPS. Khung tối đa 1248px đồng bộ với các section đã
cân đối. Tiêu đề căn giữa với nhãn “Lợi thế vượt trội”, sáu thẻ trắng chia
hai bên minh họa máy chủ/cloud xanh trắng. Trên tablet, minh họa nằm trên
lưới hai cột; dưới 640px, các thẻ xếp một cột. Dải thông tin có bốn mục,
chuyển thành hai cột trên màn hình nhỏ.

Giữ nguyên tiêu đề, mô tả và sáu lợi ích từ
`vps-content.json > landing.headers.WhyInterData / landing.reasons`.
Dải thông tin dùng dữ liệu hiện có:

- NVMe U.2 Gen 4: `landing.infrastructure`.
- SLA uptime 99,9%: `landing.reasons[0]`.
- Khởi tạo 1–3 phút sau thanh toán thành công: nội dung FAQ về auto-provisioning
  và gửi thông tin đăng nhập (`faq.items`).
- Hỗ trợ kỹ thuật 24/7: `landing.reasons[3]` và FAQ hỗ trợ.

Không lấy số lượng khách hàng, SLA 99,99%, thời gian dưới 30 phút, Tier III
hoặc bảo vệ DDoS toàn diện từ ảnh tham khảo để thay cam kết hiện có.
Ảnh được tạo riêng bằng imagegen built-in, giữ alpha và tối ưu WebP tại
`public/images/vps/advantages-server-v1.webp`; prompt và nguồn ảnh tại
`docs/vps-advantages-image-v1.json`.

Kiểm tra khung, sáu thẻ, nội dung nguồn, ảnh tải, không tràn ngang, hiển thị
không JavaScript và axe ở 320/390/640/768/899/900/1024/1199/1200/1440/1536/1920px.
Snapshot/hash đối chiếu các file ngoài phạm vi và toàn bộ phần còn lại của
`vps-page.tsx`. Kết quả và ảnh section ở `artifacts/vps-advantages/`;
kiểm tra toàn trang ở `artifacts/vps-advantages/full-qa/`.
Build, lint, typecheck và `test:vps` đạt. Section được đối chiếu trên cả dev
và production preview local; chưa triển khai lên tên miền chính thức.

## Bảng giá theo giao diện VPS AMD 14/10/2026

`pricing.tsx` sử dụng CSS module riêng `pricing.module.css` với thiết kế từ
`vps-amd/amd-pricing.tsx` và `amd.module.css`: nền xanh trắng, bộ chọn pill,
thẻ bo góc 16px, gói phổ biến nền xanh với badge đỏ, icon theo loại cấu hình,
nút đăng ký pill và nút mở thêm gói. Không chỉnh các file của trang VPS AMD.

Giữ năm dòng VPS (gồm Platinum Viettel), thứ tự và bộ lọc gói Custom, 4 gói
ban đầu, mở thêm/thu gọn, Hot Deals và giá gốc/ghi chú gia hạn. Nguồn dữ liệu,
API, thông số, product URL và tham số đăng ký gốc không thay đổi.

Bộ chọn chu kỳ được thêm vào từng dòng VPS, sử dụng sáu khóa/nhãn từ
`amdBillingCycles`. Mặc định chọn tháng nếu gói đầu tiên hỗ trợ, nếu không
thì chọn quý hoặc chu kỳ khả dụng đầu tiên. Giá là tổng tiền của chu kỳ được
chọn, lấy trực tiếp từ `product.pricing.VND[cycle]`; không tự quy đổi theo
tháng hay tính chiết khấu. Link đăng ký dùng URL sản phẩm gốc cộng đúng
`billingcycle`. Chỉ hiển thị chu kỳ có ít nhất một gói giá dương; gói không
cung cấp chu kỳ đang chọn hiển thị liên hệ tư vấn thay vì link mua.

Hot Deals giữ danh sách chu kỳ và dữ liệu ưu đãi gốc. Hai bảng giá dùng lưới
4 cột trên desktop (Hot Deals 3 gói dùng 3 cột), 2 cột dưới 1200px,
1 cột dưới 640px như trang VPS AMD,
thay cho rail cuộn ngang cũ trên mobile. Keyboard Arrow/Home/End cho tab,
quan hệ tab/panel và nội dung mặc định không JavaScript được giữ lại.

`test:vps` đối chiếu giá/checkout ở mọi chu kỳ khả dụng của năm dòng VPS và
Hot Deals, cấu hình, thứ tự và lọc gói, mở thêm/thu gọn cùng các tương tác
khác của trang. QA riêng tại `artifacts/vps-pricing-amd/` đối chiếu hash các
file ngoài phạm vi, kích thước chữ/padding/bo góc/CTA với trang VPS AMD,
keyboard, lưới, tràn ngang và axe tại 320/390/640/768/1024/1199/1200/1440/1536/1920px.
Ảnh desktop/mobile và kết quả nằm cùng thư mục; regression toàn trang tại
`artifacts/vps-pricing-amd/full-qa/`.
Build, lint, typecheck và bộ `test:vps` đạt. Kiểm tra giao diện và đối chiếu
style với VPS AMD được chạy trên production preview local; chưa triển khai
lên tên miền chính thức.

## Kiểm tra bản thiết kế

```powershell
npm run build
npm run lint
npm run test:vps -- 'D:\InterData\thue-vps'
```

`TEST_BASE_URL` mặc định là `http://localhost:3101`. QA đối chiếu nguồn, hash
ảnh, API trực tiếp, giá/chu kỳ/checkout, tương tác, keyboard, no-JavaScript,
responsive và accessibility. Kết quả nằm tại `artifacts/vps/qa/`.

Bản thiết kế 14/10/2026 đã kiểm tra trên production preview local cổng 3101:
build, lint, typecheck và `test:vps` đạt. Đối chiếu đủ 6 nhóm API; responsive
320/390/768/1024/1440/1920px không tràn ngang, không có lỗi axe được phát hiện.
Đã kiểm tra keyboard, carousel mobile, mở thêm gói, chu kỳ Hot Deals, FAQ mở
rộng và nội dung không JavaScript. Báo cáo tại `artifacts/vps-redesign/qa/results.json`,
ảnh toàn trang tại `artifacts/vps-redesign/desktop.png`.

Kiểm chứng local không thay thế triển khai và kiểm chứng trên tên miền chính thức.
