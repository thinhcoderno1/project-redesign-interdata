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
revalidate mỗi 60 giây. Trang chỉ tải năm nhóm: AMD `67`, Platinum `29`,
Platinum Viettel `101`, Gold `20`, Linux `3`; tab mặc định là `3`.

Mặc định chọn monthly nếu gói đầu tiên hỗ trợ, nếu không chọn quarterly hoặc
chu kỳ khả dụng đầu tiên. Giá hiển thị là tổng tiền của chu kỳ được chọn.
Gói Custom không xuất hiện trong bảng giá. Mỗi bảng hiển thị 4 gói trước khi
mở rộng. Hot Deals 2026 đã được bỏ khỏi trang theo yêu cầu ngày 15/10/2026.

URL đăng ký lấy từ `product_url` và thêm đúng `billingcycle` đã chọn.
Client tự thử tải các nhóm thiếu qua `/api/vps-pricing/?gid=...`, đồng thời có
nút thử lại khi lỗi. Không sử dụng giá mẫu để thay thế lỗi API.

## Bản thiết kế theo mẫu ngày 14/10/2026

- Hero nền navy với minh họa VPS; dải logo khách hàng đang tạm ẩn.
- Bố cục chính: Hero, lợi ích, 6 dòng VPS, 6 nhu cầu sử dụng,
  bảng giá thường, hạ tầng Việt Nam, quy trình, khách hàng/báo chí,
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

## Hero ảnh phong cách chụp trung tâm dữ liệu 15/10/2026

Hero dùng nền ảnh toàn chiều rộng tại
`public/images/vps/hero-datacenter-photo-v3.webp` (1672 × 941px, WebP khoảng
211 KiB). Ảnh tạo bằng imagegen built-in theo phong cách ảnh chụp dãy rack,
ánh sáng trắng và kim loại tự nhiên; đây là ảnh tạo mới về hạ tầng chung,
không phải ảnh chụp cơ sở của InterData. Prompt và nguồn được ghi tại
`docs/vps-hero-photo-v3.json`.

Lớp phủ navy giữ độ rõ cho chữ và CTA trên desktop/mobile. Bỏ bốn feature
CPU/Uptime/Support/nâng cấp cùng các thẻ nổi và nhãn VPS kiểu 3D quanh hình
cũ. Tiêu đề, badge, mô tả, CTA, breadcrumb và box bốn lợi ích bên dưới giữ
nguyên. Các section còn lại và dữ liệu/bảng giá không thay đổi. Ảnh cũ được
giữ trong public để có thể đối chiếu.

Kiểm tra ảnh, responsive, CTA, keyboard, accessibility và no-JavaScript
trên production preview local tại 320/390/768/1024/1440/1920px. Kết quả và
ảnh ở `artifacts/vps-hero-photo/`; regression toàn trang ở
`artifacts/vps-hero-photo/full-qa/`. Build, lint, typecheck và `test:vps`
đạt. Đây là kiểm chứng local; chưa triển khai lên tên miền chính thức.

## Hero Benefits Bar tại ranh giới hai section 15/10/2026

`VpsHeroBenefits` được tách khỏi `VpsHero` và đặt trực tiếp ở đầu
`VpsAdvantages`. Bỏ nền và khoảng đệm riêng dưới Hero. Thanh lợi ích chồng
72px lên Hero trên desktop, 56px trên tablet và 24px trên mobile; phần còn
lại nằm trên nền của section “Vì sao nên thuê VPS tại InterData?”. Thanh giữ
chiều cao tự nhiên trong luồng nội dung để tiêu đề bên dưới không bị che.
Phần nội dung/ảnh của section lợi thế giữ vùng clip riêng.

Bốn mục theo thứ tự: Hiệu năng mạnh mẽ, Uptime 99.9%, Dễ dàng quản trị,
Phù hợp nhiều nhu cầu. Mục uptime dùng icon nhịp hoạt động và mô tả SLA
99,9% dựa trên dữ liệu hiện có. Chữ tiêu đề 16px (15px trên mobile), mô tả
14px; tăng tương phản màu chữ mô tả. Lưới bốn cột trên desktop chuyển hai
cột dưới 1200px để giữ nội dung dễ đọc. Giữ nguyên ảnh nền, tiêu đề, mô tả
và CTA Hero cùng dữ liệu/bảng giá và nội dung các section khác.

Kiểm tra trên production preview local tại 13 chiều rộng 320–1920px:
đúng ranh giới section, không che CTA/heading và không tràn ngang. Kiểm tra
axe tại sáu chiều rộng chính và hiển thị không JavaScript. Build, lint,
typecheck và `test:vps` toàn trang đạt. Báo cáo và ảnh tại
`artifacts/vps-benefits-bar/`; chưa triển khai lên tên miền chính thức.

## Hero Benefits Bar chỉ giữ tiêu đề 15/10/2026

Bỏ toàn bộ mô tả dưới bốn mục trong `VpsHeroBenefits`; giữ nguyên icon,
tiêu đề và thứ tự. Tiêu đề dùng 18px/700 trên desktop, 16px/700 trên mobile.
Thanh desktop giảm chiều cao tối thiểu từ 144 xuống 112px, chồng 56px lên
Hero; tablet/mobile giữ độ chồng tương ứng 56px/24px. Tăng khoảng đệm cuối
Hero để khoảng cách thực tế giữa nút và thanh đạt ít nhất 56px. Mobile căn
giữa icon/tiêu đề, các icon cùng hàng thẳng nhau. Không chỉnh ảnh, nội dung,
kích thước hoặc liên kết nút Hero và các section khác.

Kiểm tra trên production preview local ở 13 chiều rộng 320–1920px: vị trí
giao thoa, khoảng cách nút, bốn tiêu đề, không còn mô tả, không tràn ngang.
Kiểm tra axe ở sáu chiều rộng chính, hiển thị không JavaScript, đối chiếu
phạm vi bằng hash. Build, lint, typecheck và `test:vps` đạt. Kết quả và ảnh
ở `artifacts/vps-benefits-compact/`; chưa triển khai lên tên miền chính thức.

## Minh họa Lợi thế và vòng nền chuyển động 15/10/2026

Giảm hình máy chủ trung tâm từ 125% chiều rộng cột xuống 102%, tối đa
410px; tablet dùng 300px, mobile tối đa 250px. Cập nhật `sizes` của Image
theo kích thước hiển thị mới; giữ nguyên asset, alt và nội dung section.

Hai vòng nền có nét xanh rõ hơn, một vòng nét đứt và một vòng nét liền,
kèm điểm nhấn nhỏ. Giới hạn đường kính desktop ở 400/456px, tablet
310/340px, mobile tối đa 250/280px để không chạm heading hoặc dải thông tin.
Hai vòng xoay tuyến tính ngược chiều bằng CSS transform, chu kỳ 36/52 giây;
hình máy chủ đứng yên. `prefers-reduced-motion: reduce` tắt cả hai animation.
Không thêm JavaScript hoặc thay đổi Hero Benefits Bar và các section khác.

Kiểm tra trên production preview local tại 12 chiều rộng 320–1920px:
kích thước ảnh, khoảng cách với heading/thẻ/dải thông tin, không tràn ngang,
hai vòng thực sự chuyển động và dừng khi giảm chuyển động, nội dung sáu
thẻ và hiển thị không JavaScript. Axe đạt tại sáu chiều rộng chính. Build,
lint, typecheck và `test:vps` toàn trang đạt. Kết quả và ảnh section nằm ở
`artifacts/vps-advantages-orbits/`; chưa triển khai lên tên miền chính thức.

## Card Lợi thế ôm theo vòng cung 15/10/2026

Trên desktop từ 1200px, bố cục dùng cột giữa rộng hơn để tạo khoảng thoáng
cho vòng tròn. Hai card trên và dưới mỗi bên dịch về tâm 12–44px tùy chiều
rộng; hai card giữa nằm ngoài hơn, tạo hai cung đối xứng quanh máy chủ.
Card giữ chiều ngang và hướng chữ bình thường, không xoay hoặc uốn chữ.
Giữ thứ tự DOM, nội dung, icon, kích thước ảnh đã duyệt và hiệu ứng vòng nền.
Dưới 1200px giữ bố cục trước đó để bảo đảm độ rộng đọc trên tablet/mobile.
Thay đổi giao diện chỉ trong `advantages.module.css`.

Kiểm tra trên production preview local tại 14 chiều rộng 320–1920px, gồm
1199/1200/1280/1344px: card đối xứng, không chồng nhau hoặc chạm ảnh,
không tràn ngang. Kiểm tra nguyên văn sáu card, giảm chuyển động,
hai vòng thực sự xoay và hiển thị không JavaScript. Axe tại sáu chiều rộng
chính, build, lint, typecheck và `test:vps` toàn trang đạt. Báo cáo/ảnh tại
`artifacts/vps-advantages-arc/`; chưa triển khai lên tên miền chính thức.

## Các dòng VPS dạng slider ảnh nền 15/10/2026

`service-range.tsx` thay lưới sáu card bằng slider nền navy theo mẫu được
duyệt: slide chính giữa, hé slide trước/sau, text overlay và CTA trên ảnh.
Tab menu gồm đủ sáu dịch vụ theo thứ tự AMD, Platinum, Gold, Linux, n8n,
Vibe Coding. Tab đang chọn và bộ đếm 01–06 cùng cập nhật; có nút trước/sau,
quay vòng ở đầu/cuối và vuốt ngang trên thiết bị cảm ứng. Không tự chạy.

Giữ nguyên `src/data/vps-service-range.ts`: tên, label, mô tả, ba đặc điểm,
thứ tự và URL từng dịch vụ. Giới hạn “Chỉ hỗ trợ mã nguồn EzyPlatform” vẫn
nằm ngay trên slide Vibe Coding. Không chỉnh bảng giá/API, Hero Benefits
Bar hoặc các section khác.

Sáu ảnh mới do imagegen built-in tạo theo phong cách nhiếp ảnh hạ tầng và
workstation doanh nghiệp, tối ưu WebP tại `public/images/vps/range-slider-v1/`
(1672 × 941px, khoảng 69–189 KiB mỗi ảnh). Đây là ảnh tạo mới về hạ tầng
chung, không phải ảnh chụp cơ sở InterData. Prompt và nguồn ảnh gốc nằm tại
`docs/vps-range-slider-images-v1.json`. Ảnh cũ `range-v3/` được giữ lại.

Tab có quan hệ `aria-controls`/`aria-labelledby` với panel; hỗ trợ phím
Left/Right/Home/End, focus và tabIndex cho tab đang chọn. Slide phụ dùng
`inert`/`aria-hidden` để chỉ CTA đang chọn nhận focus. CSS tắt chuyển động
khi `prefers-reduced-motion: reduce`. Trước hydration hoặc khi JavaScript
bị tắt, toàn bộ sáu dịch vụ và liên kết vẫn hiển thị theo lưới; điều khiển
tương tác được ẩn. Chiều cao slider ổn định khi đổi dịch vụ.

Kiểm tra bằng `npm run test:vps-range`: đủ sáu ảnh, nội dung/URL, tab/panel,
quay vòng, bàn phím/focus, không autoplay, vuốt cảm ứng bằng CDP và cuộn
dọc, giảm chuyển động, no-JavaScript, bố cục của cả sáu slide tại 12 chiều
rộng 320–1920px. Axe kiểm tra toàn trang ở sáu chiều rộng chính. Kết quả
production local tại `artifacts/vps-range-slider/qa/`, kiểm tra hồi quy toàn
trang tại `artifacts/vps-range-slider/full-qa/`. Build, lint, typecheck,
`test:vps-range` và `test:vps` đạt; chưa triển khai lên tên miền chính thức.

## Ảnh nền Các dòng VPS do người dùng cung cấp 15/10/2026

Slider hiện dùng sáu ảnh JPG do người dùng thiết kế và đặt trong
`public/images/vps/range-slider-v1/`, thay bộ WebP tạo trước đó:

- AMD: `vps-amd.jpg`.
- Platinum: `vps-platinum.jpg`.
- Gold: `vps-gold.jpg`.
- Linux: `vps-linux.jpg`.
- n8n: `vps-n8n.jpg`.
- Vibe Coding: `vps-vibe-coding.jpg`.

Tham chiếu ảnh được ánh xạ theo id dịch vụ trong `service-range.tsx`.
Giữ nguyên file JPG gốc, tên file, bố cục/CSS, nội dung, thứ tự, liên kết
và tương tác. Hồ sơ imagegen ở trên là lịch sử của bộ ảnh cũ, không phải
nguồn ảnh đang hiển thị. Kiểm tra hash để bảo đảm ảnh người dùng nguyên vẹn.
`test:vps-range` kiểm tra cả URL nguồn ảnh của từng panel theo tên JPG mới.
Ảnh chụp và kiểm chứng nằm tại `artifacts/vps-range-user-images/`.

## Card Các dòng VPS chỉ giới thiệu và điều hướng 15/10/2026

Bỏ danh sách ba thông số/tính năng và các icon tương ứng trên cả sáu
slide. Card chỉ hiển thị nhãn, tiêu đề, một mô tả ngắn và CTA “Xem chi tiết”.
Giảm chiều cao tối thiểu từ 540 xuống 480px, bỏ CSS dành cho danh sách;
giữ vị trí nội dung ở đáy ảnh để cân đối phần ảnh và phần chữ.

Mô tả Vibe Coding giữ câu giới hạn “Chỉ hỗ trợ mã nguồn EzyPlatform.”;
năm mô tả còn lại giữ nguyên. Dữ liệu feature gốc vẫn nằm trong file data
và không được render tại section giới thiệu. Giữ nguyên ảnh JPG người dùng,
nhãn, tiêu đề, thứ tự, URL, tab, nút trước/sau, vuốt và fallback no-JavaScript.

`test:vps-range` đối chiếu mỗi slide có một mô tả và không có danh sách,
kiểm tra giới hạn EzyPlatform cả khi JavaScript bật/tắt, cùng các kiểm tra
chuyển slide, bàn phím, cảm ứng, giảm chuyển động và bố cục đã có. Báo cáo
và ảnh tại `artifacts/vps-range-short-cards/`. Kiểm chứng local, chưa triển
khai lên tên miền chính thức.

## Bỏ badge trên card Các dòng VPS 15/10/2026

Bỏ toàn bộ nhãn nền tảng phía trên tiêu đề trên sáu slide và CSS `.label`
không còn dùng. Đặt margin đầu tiêu đề về 0; mỗi card chỉ còn ảnh nền,
tiêu đề, mô tả ngắn và CTA. Giữ nguyên ảnh JPG người dùng, dữ liệu dịch vụ,
mô tả EzyPlatform, thứ tự, URL và cơ chế chuyển slide. Badge của tiêu đề
section “Đa dạng lựa chọn” vẫn giữ nguyên. Ảnh và kiểm tra local tại
`artifacts/vps-range-no-badges/`.

## Bỏ bộ đếm dưới slider Các dòng VPS 15/10/2026

Bỏ dòng “01 / 06 · VPS AMD” và tên dịch vụ tương ứng dưới slider, cùng
markup và CSS dành riêng cho dòng này. Không giữ khoảng cách 22px của
dòng đã bỏ. Tab menu, nút trước/sau, vuốt, ảnh và nội dung card không thay
đổi. Tab đang chọn và quan hệ tab/panel vẫn thể hiện dịch vụ đang xem.
Ảnh chụp và kiểm tra local tại `artifacts/vps-range-no-counter/`.

## Nền Các dòng VPS màu #031677 và data wave 15/10/2026

Đặt màu nền section chính xác `#031677`, bỏ lớp radial gradient cũ. Hai
lớp trang trí data wave ở góc trên trái/dưới phải dùng SVG vector mảnh
`public/images/vps/range-data-wave.svg`, có gradient độ mờ và điểm dữ liệu
nhỏ. Họa tiết đứng yên, nằm phía sau nội dung, không nhận pointer events;
được thu xếp lại ở mobile và clip trong section để không tràn ngang.
Giữ nguyên component, ảnh, card, tab, CTA và tương tác. Kiểm tra màu CSS,
hiển thị desktop/mobile, accessibility và slider tại
`artifacts/vps-range-data-wave/`. Chưa triển khai lên tên miền chính thức.

## Bỏ section Hot Deals 2026 15/10/2026

Gỡ hoàn toàn section `#hot-deals`, bộ chọn chu kỳ, card ưu đãi và trạng thái
đang tải/thử lại dành riêng cho Hot Deals khỏi `Pricing`. Dọn state, nhánh
render và CSS không còn dùng; giữ nguyên giao diện/logic của năm bảng giá
thường. Section hạ tầng nối trực tiếp sau `#pricing`, không có khoảng trống.

`standardPricingGids` dùng cho tải server và khôi phục giá phía client, chỉ
gồm `67/29/101/20/3`. Bản build/RSC đã đối chiếu không truyền nhóm `100` vào
`initialPrices`. `pricingGids` vẫn là whitelist API cũ để giữ tương thích;
JSON nguồn và dữ liệu Hot Deals gốc không bị xóa hoặc chỉnh sửa. Các route
khác và toàn bộ ảnh/nội dung ngoài phạm vi giữ nguyên.

`test:vps` bỏ yêu cầu nội dung và tương tác Hot Deals, thay bằng đối chiếu
section/control Hot Deals không tồn tại cả khi JavaScript bật/tắt. Các
kiểm tra giá, thông số, thứ tự, chu kỳ, checkout, mở thêm/thu gọn và keyboard
của năm dòng thường vẫn chạy đầy đủ. API tương thích gid `100` vẫn được
kiểm tra riêng. Kết quả và ảnh local ở `artifacts/vps-remove-hot-deals/`;
chưa triển khai lên tên miền chính thức.

## Phần cứng và kết nối dạng zic zac 15/10/2026

Tách `Infrastructure` thành component và CSS module riêng, giữ export tại
`showcase.tsx`. Bốn hàng CPU / NVMe U.2 Gen 4 / kết nối đến 1 Gbps /
Datacenter Việt Nam dùng nền navy dark, chữ và ảnh xen kẽ trái/phải từ
900px. Dưới 900px, mỗi hàng hiển thị chữ trước ảnh. Giữ nguyên tiêu đề,
mô tả kỹ thuật từ JSON nguồn và CTA `/gioi-thieu/`.

Bốn ảnh mới dùng công cụ imagegen tích hợp, theo phong cách nhiếp ảnh
phần cứng doanh nghiệp, xuất WebP tại `public/images/vps/infrastructure-v1/`.
Đây là ảnh minh họa được tạo mới, không phải ảnh xác thực cơ sở hoặc thiết
bị InterData. Prompt, nguồn PNG và đường dẫn asset được lưu tại
`docs/vps-infrastructure-images-v1.json`; ảnh được ghi chú minh họa ở cuối
section và có alt mô tả.

Build, lint, typecheck và `test:vps` đạt trên production preview local
cổng 3101. Kiểm tra riêng bố cục tại 320/390/639/640/768/899/900/1024/1199/
1200/1440/1920px đạt: nội dung nguồn, thứ tự xen kẽ, ảnh tải đủ, focus CTA,
không tràn ngang và không có lỗi JavaScript. No-JavaScript vẫn hiển thị đủ
bốn hàng và ảnh. Bộ QA toàn trang kiểm tra API, giá, checkout, tương tác
và axe tại sáu viewport chính. Báo cáo và ảnh tại
`artifacts/vps-infrastructure-zigzag/`; ảnh section ẩn tạm header/widget
nổi chỉ trong lúc chụp. Chưa triển khai lên tên miền chính thức.

## Hạ tầng theo mẫu panel cắt góc 15/10/2026

Thiết kế lại riêng `infrastructure.tsx` và `infrastructure.module.css` theo
ảnh “Hạ tầng VPS hiện đại tại Việt Nam.png” do người dùng cung cấp. Nền navy
có ánh sáng xanh, badge viền mảnh, tiêu đề trắng/cyan; bốn hàng ảnh và nội
dung xen kẽ, panel SVG cắt góc với số outline 01–04 và đường nối trang trí.
Ba nhãn icon mỗi hàng chỉ nhắc lại nội dung kỹ thuật đang có; không lấy
claim chứng nhận Tier III hoặc hiệu năng chưa xác nhận từ mẫu. Giữ nguyên
toàn bộ tiêu đề/mô tả nguồn, CTA và URL hiện có.

Bốn hình mới dùng imagegen tích hợp, lấy ảnh người dùng làm tham chiếu
phong cách và xuất vào `public/images/vps/infrastructure-v2/`. Đây là hình
minh họa hạ tầng, không phải ảnh thật của InterData. Prompt, nguồn PNG và
asset cuối cùng ở `docs/vps-infrastructure-images-v2.json`. Bộ ảnh v1 vẫn
được giữ lại. Từ 1000px, panel và ảnh giao nhau để tạo hàng liền mạch;
dưới 1000px, mỗi card dùng ảnh phía trên và chữ phía dưới, không cắt góc
vào vùng chữ. Chữ, icon và số thứ tự vẫn được render bằng HTML/SVG/CSS.

Build, lint, typecheck và `test:vps` đạt. Kiểm tra riêng tại 13 viewport
320/390/639/640/768/999/1000/1024/1199/1200/1440/1536/1920px đạt về nội dung
nguồn, ảnh, nhãn icon, bố cục, focus CTA, no-JavaScript và không tràn ngang.
QA toàn trang không phát hiện lỗi axe tại sáu viewport chính; giá, API,
checkout và tương tác vẫn đạt. Đối chiếu hash xác nhận chỉ hai file hạ tầng
và tài liệu này thay đổi trong 393 file đã có trước task; bốn asset v2 và
metadata là file mới. Báo cáo và ảnh ở `artifacts/vps-infrastructure-reference/`.
Ảnh section ẩn tạm header/widget nổi chỉ khi chụp. Preview local không phải
triển khai lên tên miền chính thức.

## Đồng bộ màu InterData và ảnh chụp thật cho hạ tầng 15/10/2026

Giữ bố cục zic zac/panel cắt góc, tiêu đề, mô tả kỹ thuật, nhóm lợi ích và
CTA. Thay màu tự thêm bằng token của `docs/InterData-Color-System.md`:
nền `brand-strong`, panel `brand-card`, chữ `text-on-brand` /
`text-on-dark-secondary`, viền `border-on-dark`, icon/CTA `brand-primary`,
hover `brand-hover` và focus `focus-dark`. Riêng `brand-primary` được phục
hồi về giá trị canonical `#0043EC` ngay tại section vì `.page` của VPS đang
ghi đè token này thành `#0066ED`; không thay đổi các section khác. Bỏ
gradient cyan và gradient nền/panel ngoài palette.

Thay cả bốn asset AI bằng ảnh chụp có nguồn: AMD EPYC (Raysonho, CC0),
SSD U.2 (Dmitry Nosachev, CC BY-SA 4.0), switch/cáp mạng (ubayrak, CC0),
và ảnh Viettel IDC do người dùng cung cấp đã có trong project. Bản WebP
tại `public/images/vps/infrastructure-photo-v3/`; nguồn, license, hash và
giới hạn sử dụng được ghi trong `docs/vps-infrastructure-photos-v3.json`.
Ảnh phần cứng là ảnh tham khảo thiết bị, không xác nhận đúng model triển
khai hoặc đo hiệu năng. Attribution/license của ảnh U.2 nằm gọn trên ảnh;
bản crop/WebP vẫn giữ CC BY-SA 4.0. Không dùng imagegen hoặc chỉnh sửa
sinh ảnh ở lần này.

Xóa note “Hình ảnh minh họa hạ tầng.” và CSS riêng cho note, căn CTA cuối
section về bên phải trên desktop. Báo cáo, ảnh desktop/mobile và đối chiếu
phạm vi nằm ở `artifacts/vps-infrastructure-brand-photo/`. Kiểm chứng local
không phải triển khai lên tên miền chính thức.

Build (gồm TypeScript), lint và `test:vps` đạt. Kiểm tra riêng 13 viewport
320–1920px xác nhận màu computed đúng token, ảnh tải đủ, nội dung nguồn,
thứ tự bố cục, focus CTA, no-JavaScript, không tràn ngang và không có lỗi
JavaScript. QA toàn trang đạt nội dung, API, giá, checkout, tương tác và
axe tại sáu viewport chính. Đối chiếu hash bốn ảnh đạt; trong 398 file đã
có trước task, chỉ component/CSS hạ tầng và tài liệu này thay đổi.

## Ảnh nhiếp ảnh đồng bộ, mép mờ và chiều sâu hạ tầng 15/10/2026

Thay bốn ảnh nguồn ở lần trước bằng bộ ảnh mới do imagegen tích hợp tạo
theo phong cách nhiếp ảnh phần cứng doanh nghiệp: máy chủ mở nắp, SSD U.2
trong khay hot-swap, switch/cáp Ethernet và lối đi datacenter. Đây là ảnh
minh họa được tạo mới, không phải ảnh xác thực cơ sở hay model thiết bị
InterData. Cả bốn dùng cùng ánh sáng trung tính, nền tối và phản chiếu xanh
tiết chế; không có chữ, logo hoặc đồ họa neon. Bản WebP và prompt ở
`public/images/vps/infrastructure-v4/` và
`docs/vps-infrastructure-images-v4.json`. Không đưa lại note đã bỏ. Credit
của ảnh U.2 cũ được gỡ cùng ảnh đó; asset và metadata nguồn cũ vẫn được giữ.

Mask CSS theo hai trục làm mềm mép ảnh, đảo hướng cho hàng chẵn. Viền
panel dùng `brand-primary` 1.5px, bóng sáng nhẹ cùng token; mobile dùng
viền/bóng trên panel chữ riêng để ảnh vẫn hòa nền. Nền `brand-strong` giữ
nguyên, thêm lưới/chấm và các cung đường dữ liệu bằng CSS pseudo-element,
độ mờ thấp, không animation, không nhận pointer events. Tất cả màu hiển
thị dùng token InterData; không thêm palette mới. Nội dung, icon lợi ích,
thứ tự zic zac, CTA và các section khác giữ nguyên.

Báo cáo và ảnh kiểm chứng local tại `artifacts/vps-infrastructure-depth/`.
Chưa triển khai lên tên miền chính thức.

Build (gồm TypeScript), lint, formatting và `test:vps` đạt. QA riêng tại
13 viewport 320–1920px xác nhận mask ảnh, viền/glow panel, họa tiết không
nhận pointer events, màu token, nội dung nguồn, ảnh, focus CTA, no-JavaScript
và không tràn ngang/lỗi JavaScript. Bộ QA toàn trang đạt nội dung, API,
giá, checkout, tương tác và axe ở sáu viewport chính. Đối chiếu hash bốn
asset mới đạt; chỉ hai file component/CSS và tài liệu này thay đổi trong
403 file đã có trước task. Ảnh section ẩn tạm header/widget nổi khi chụp.

## Bỏ section Quy trình rõ ràng 15/10/2026

Gỡ toàn bộ section `GettingStarted` gồm tiêu đề, bốn bước và CTA riêng khỏi
`vps-page.tsx`. Bỏ CSS `.process` dành riêng cho section. Sau phần hạ tầng
là khối mở rộng “Cấu hình, hiệu năng và môi trường triển khai”, không thêm
khoảng trống thay thế. Nội dung JSON nguồn vẫn giữ để không ảnh hưởng hợp
đồng đối chiếu; các bảng giá, ảnh, section khác và CTA còn lại không đổi.

`test:vps` loại nội dung section đã bỏ khỏi yêu cầu hiển thị, đồng thời
kiểm tra heading của section không tồn tại khi JavaScript bật hoặc tắt.
Ảnh và kiểm chứng local ở `artifacts/vps-remove-process/`.

Build (gồm TypeScript), lint, formatting và `test:vps` đạt. Đã đối chiếu
section không còn khi bật/tắt JavaScript; khoảng nối hạ tầng/khối kỹ thuật
bằng 0 ở sáu viewport 320/390/768/1024/1440/1920px, không tràn ngang hoặc lỗi
JavaScript. QA toàn trang đạt nội dung còn lại, API, giá, checkout, tương
tác và axe. Chỉ component trang, CSS, script QA và tài liệu này thay đổi;
dữ liệu JSON và toàn bộ asset giữ nguyên. Chưa triển khai lên tên miền.

## Bỏ họa tiết lưới nền hạ tầng 15/10/2026

Gỡ lớp `::before` chứa các đường lưới và chấm xếp lưới khỏi section hạ tầng.
Giữ nguyên nền navy, cung đường dữ liệu `::after`, ảnh, mép mờ và viền panel.
Formatting và kiểm tra hiển thị local ở sáu viewport 320–1920px đạt; lớp
lưới không còn render và không tràn ngang. Ảnh/báo cáo tại
`artifacts/vps-infrastructure-no-grid/`. Chưa deploy.

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
