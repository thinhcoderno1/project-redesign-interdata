# Trang VPS n8n

Route chính: `/vps-n8n/`. Đây là trang thay thế tại đúng URL hiện có. Link trong catalog và nhóm nhu cầu dẫn tới route nội bộ.

## Thiết kế và nội dung

Kế thừa bố cục VPS Linux: Hero, thông tin nhanh, bảng giá, nền tảng, sáu ứng dụng, quy trình bốn bước, so sánh, hạ tầng và ba bước bắt đầu, các section chứng thực chung, FAQ và CTA. Khoảng đệm section giữ 80px desktop, 64px tablet, 48px mobile. Hai CTA Hero giữ cùng kích thước theo breakpoint.

Nội dung giải thích n8n là template hệ điều hành cài sẵn, được hỗ trợ trên tất cả dịch vụ VPS InterData theo brief chủ dịch vụ. Không tạo sản phẩm, cấu hình hoặc giá n8n riêng. Template hỗ trợ khởi tạo; người dùng quản lý workflow, tài khoản, HTTPS, cập nhật và sao lưu. Không gắn phiên bản Ubuntu/n8n cố định do trang cũ nêu phiên bản không nhất quán. Người dùng chọn template n8n tại bước cấu hình đơn hàng; không thêm tham số hệ điều hành chưa được xác minh vào checkout.

Tài liệu đối chiếu kỹ thuật: [n8n self-hosting](https://docs.n8n.io/hosting/). Các ví dụ ứng dụng chỉ mô tả khả năng kết nối workflow; không cam kết GPU, số tác vụ, quyền sử dụng mọi tính năng hoặc dịch vụ quản trị workflow.

## Giá và tương tác

Tái sử dụng các loader hiện có, revalidate 60 giây, timeout 15 giây, kiểm tra gid, URL checkout và loại bỏ giá âm:

| Tab                | gid | Nguồn/điều kiện                                     |
| ------------------ | --- | --------------------------------------------------- |
| VPS GOLD           | 20  | Tất cả gói hiện có, mặc định chu kỳ 3 tháng         |
| VPS AMD            | 67  | Cấu hình và thứ tự nguồn AMD                        |
| VPS PLATINUM       | 29  | Các gói chuẩn HCM như trang Platinum                |
| PLATINUM · VIETTEL | 101 | Các gói chuẩn như trang Platinum                    |
| VPS LINUX          | 3   | Các gói chuẩn, bỏ custom và sản phẩm thử thanh toán |

VPS Linux mặc định được chọn ở chu kỳ tháng, có tag đỏ “Phổ biến nhất” theo yêu cầu chủ dịch vụ. Đây là tag của dịch vụ, không phải nhãn của một cấu hình n8n. Chu kỳ không có giá hợp lệ được ẩn; giá là tổng tiền theo chu kỳ. Giữ tên, thông số, thứ tự và URL đăng ký nguồn, chỉ thêm billingcycle. Không thực hiện mua hàng hoặc thanh toán khi QA.

`getN8nPrices` dùng `Promise.allSettled`: lỗi một nhóm không làm mất các nhóm còn lại. Endpoint `/api/vps-n8n-pricing/?gid=…` chỉ nhận các gid trong bảng trên. UI có trạng thái lỗi/thử lại riêng, hủy request khi đổi tab và không để kết quả cũ ghi đè tab mới. Các tab hỗ trợ Arrow/Home/End và ARIA; bảng giá có bốn thẻ ban đầu, nút mở rộng, chọn chu kỳ. Không JavaScript vẫn đọc được bốn gói Linux, liên kết các storefront và FAQ native.

## Hình ảnh

Ba ảnh minh họa mới được tạo bằng skill imagegen và công cụ image_gen tích hợp, sau đó tối ưu WebP bằng sharp. Đây là ảnh minh họa, không phải ảnh chụp hạ tầng thực tế. Các ảnh chứng thực/hạ tầng dùng chung được giữ theo source Linux.

- `public/images/vps-n8n/hero-v2.webp`: 1672×941.
- `public/images/vps-n8n/platform-v2.webp`: 1672×941.
- `public/images/vps-n8n/center.webp`: 960×960, nền trong suốt.
- Prompt: `docs/vps-n8n-image-prompts.json`.

## Kiểm tra

Chạy `npm run test:vps-n8n`, `npm run lint`, `npm run typecheck`, `npm run build` và kiểm tra Prettier/diff. Test đối chiếu trực tiếp từng nhóm giá, tất cả chu kỳ hợp lệ và URL đăng ký; kiểm tra mặc định Linux/tháng, tag đỏ, tab bàn phím, mở rộng, FAQ, quy trình bốn bước, ảnh, CTA, khoảng cách section và tràn ngang tại 320/390/768/1024/1440/1920px. Kiểm tra axe WCAG A/AA trên main, không JavaScript và lỗi/thử lại/hủy request khi chuyển dịch vụ. Test tạo rồi gỡ route fixture `n8n-pricing-qa`; không chạy build đồng thời lúc fixture tồn tại.

Bằng chứng và ảnh kiểm tra nằm tại `artifacts/vps-n8n/` (Git ignored). Preview local: `http://localhost:3100/vps-n8n/`. Chưa triển khai lên website công khai.

Kết quả ban đầu 19/10/2026 (trước khi đổi mặc định sang Linux): đối chiếu đủ 63 sản phẩm trong 5 nhóm, 29 lựa chọn chu kỳ theo nhóm và 360 cặp giá/checkout; `test:vps-n8n`, build, lint, typecheck, Prettier và diff check đạt. Sáu viewport không tràn ngang, CTA Hero đồng kích thước, ảnh tải đúng, spacing đúng và axe không phát hiện lỗi WCAG A/AA trên main. Không JavaScript, lỗi một nhóm, thử lại thành công và hủy request cũ khi đổi tab đều đạt. Sau rà soát hình ảnh, tăng vùng ba thông tin nền tảng để các chữ Template/n8n/Self-host không chạm nhau; đo lại nội dung tại cả sáu viewport đều vừa cột. Production preview local xác nhận HTTP 200 cho trang n8n và các trang đang có, mặc định GOLD/3 tháng, checkout đúng chu kỳ trên cả năm tab, 320px không tràn, axe đạt và không có lỗi runtime. Preview production tạm được dừng sau kiểm tra; dev server 3100 được giữ nguyên.

## Cập nhật hai ảnh nền n8n

Tạo mới hoàn toàn Hero và nền section “Một template n8n nhiều lựa chọn VPS” bằng image_gen tích hợp, sử dụng [asset logo từ repository chính thức n8n](https://github.com/n8n-io/n8n/blob/master/assets/n8n-logo.png) làm tham chiếu; đối chiếu [brand guidelines](https://n8n.io/brandguidelines/). Hai ảnh dùng biểu tượng n8n bốn vòng tròn và wordmark, thay các workflow và node minh họa trước đó. Giữ center.webp và các section khác.

Prompt mới và nguồn tham chiếu: `docs/vps-n8n-background-v2-prompts.json`; prompt ban đầu được giữ làm lịch sử trong `docs/vps-n8n-image-prompts.json`. Ảnh mới được tối ưu WebP (quality 88), 1672×941; bản gốc được giữ trong thư mục generated_images. Cập nhật cả ảnh OG của cùng route để đồng nhất. Chỉ điều chỉnh vị trí crop ảnh nền và độ phóng của ảnh nền tảng dưới 960px để thấy trọn logo; không đổi cấu trúc, chữ, CTA, spacing hoặc bảng giá. Snapshot đối chiếu nằm trong `artifacts/vps-n8n/background-refresh/`.

Kiểm tra ảnh v2: build, lint, typecheck và Prettier đạt. Production local tại sáu viewport 320/390/768/1024/1440/1920px xác nhận ảnh mới tải đúng, không tràn ngang, nội dung và liên kết không đổi, kích thước CTA và hình học hai section giữ nguyên; padding các section giữ nguyên. Axe trên hai section không có lỗi WCAG A/AA; không có lỗi runtime hoặc console. Đối chiếu source xác nhận chỉ thay đường dẫn ảnh trong component/OG và cách crop/zoom trong CSS; các file bảng giá, dữ liệu và API giữ nguyên hash. Cả hai file ảnh trả HTTP 200 và OG dùng Hero v2. Preview production tạm được dừng sau kiểm tra; chưa deploy.

## Quy trình triển khai n8n

Section `#quy-trinh` thay section One Click trên riêng trang n8n, vẫn ở sau `#ung-dung` và trước `#so-sanh`. Component server `src/components/vps-n8n/deployment-process.tsx` tái sử dụng module CSS của Environments cho nền gradient xanh, họa tiết globe và thẻ trắng cắt góc hai lớp. Thêm typography/card layout trong module CSS riêng n8n. Không sửa component Environments chung.

Bốn bước: chọn dịch vụ VPS/cấu hình/chu kỳ → chọn template n8n → kiểm tra đơn hàng, thanh toán và nhận bàn giao → truy cập n8n, thiết lập và thử workflow. Dùng danh sách có thứ tự, số bước và Lucide icon; không cần tab hay JavaScript để đọc nội dung. Desktop bốn cột, 640–1099px hai cột, mobile một cột. Giữ padding 80/64/48px như các section liền kề. Quy trình ba bước trong section hạ tầng được giữ theo phạm vi đã duyệt.

`test:vps-n8n` cập nhật kiểm tra bốn bước đúng thứ tự, số cột, độ vừa nội dung, vị trí và khoảng đệm, cùng khả năng đọc không JavaScript. Bằng chứng riêng trong `artifacts/vps-n8n/process/`; hash và kiểm tra trình duyệt xác nhận các section One Click ở Thuê VPS/Linux/GOLD cùng bảng giá n8n giữ nguyên.

Kết quả: `test:vps-n8n`, build production, lint, typecheck, Prettier và diff check đạt. Sáu viewport đều đạt kiểm tra số cột 4/2/1, nội dung thẻ không tràn, padding 80/64/48px, vị trí sau ứng dụng/trước so sánh, axe WCAG A/AA và không JavaScript. Kiểm tra giá/chu kỳ/checkout, bàn phím và lỗi/thử lại vẫn đạt. Không sửa các ảnh nền n8n v2 hoặc dữ liệu giá; chưa deploy.

## Tab dịch vụ đồng bộ tab chu kỳ

Hai nhóm tab dùng chung CSS khung/nút bo tròn, nền trắng, viền, padding, khoảng cách, trạng thái hover/selected và focus. Nhóm dịch vụ có năm cột trên desktop; tablet ba cột, mobile hai cột và tab Linux chiếm hai cột. Điều chỉnh nhãn xuống dòng và góc khung ở nhóm nhiều hàng để tránh tràn. Tag “Phổ biến nhất” chuyển từ GOLD sang Linux, nền đỏ #dc2626, chữ trắng; tag nằm phía trên tab trên desktop và trong tab trên màn hình nhỏ. Thứ tự dịch vụ giữ nguyên.

`n8nDefaultGid = 3` trong `src/data/vps-n8n.ts` được dùng cho lựa chọn ban đầu, tag và liên kết fallback không JavaScript. VPS Linux mặc định chu kỳ tháng; khi chuyển sang GOLD, vẫn chọn kỳ 3 tháng vì nguồn không có kỳ tháng. Giữ cấu hình, số tiền, API, chu kỳ có sẵn và URL checkout nguồn. Snapshot, ảnh và đo layout tại `artifacts/vps-n8n/service-tabs/`.

Kết quả: `test:vps-n8n`, build production, lint, typecheck, Prettier và diff check đạt. Cả sáu viewport xác nhận nền/viền/padding nhóm tab và màu/nét bo nút đang chọn đồng bộ, nhãn và tag không tràn, axe WCAG A/AA đạt. Đối chiếu đủ 63 sản phẩm/29 lựa chọn chu kỳ/360 cặp giá-checkout; kiểm tra không JavaScript, bàn phím, lỗi/thử lại và hủy request đều đạt với mặc định Linux mới. Production local tại 320/1440px xác nhận Linux/tháng, tag đỏ, đổi chu kỳ và URL checkout đúng, GOLD vẫn bắt đầu từ 3 tháng, không tràn hoặc lỗi runtime; không JavaScript vẫn hiển thị Linux. API và toàn bộ dữ liệu dịch vụ giữ nguyên; chỉ thêm cấu hình mặc định. Chưa deploy.

## Plan 3 nổi bật – Mua nhiều

Plan 3 ở mọi nhóm dịch vụ được nhận diện bằng slug `^plan-3(?:-|$)`, không dựa vào vị trí thẻ. Áp dụng cả các biến thể HCM/Hà Nội khi chúng xuất hiện trong danh sách mở rộng; không nhầm Plan 30 với Plan 3. Gắn `data-featured` để kiểm tra trạng thái và hiển thị tag đỏ “Mua nhiều” cùng icon Crown.

Thiết kế theo `src/components/vps/pricing.tsx` và `pricing.module.css` của Thuê VPS: nền xanh chuyển sắc #093a9e → #0046ce, viền #477dff, chữ/thông số/icon trắng, tag đỏ #dc2626 và CTA nền trắng/chữ xanh. Các gói thường dùng CTA viền xanh theo mẫu nguồn. Khoảng cách hàng 30px dành chỗ cho tag nhô lên; focus bàn phím của CTA gói nổi bật có viền trắng. Không đổi tên, thứ tự, thông số, giá, chu kỳ, API hoặc liên kết đăng ký. Nguồn Thuê VPS được giữ nguyên.

`test:vps-n8n` kiểm tra đúng gói Plan 3 và nhãn qua mọi tab/chu kỳ sau khi mở rộng, cùng một Plan 3 ở bốn thẻ ban đầu và khi không JavaScript. Bằng chứng riêng tại `artifacts/vps-n8n/featured-plan/`.

Kết quả: `test:vps-n8n`, build production, lint, typecheck, Prettier và diff check đạt. Kiểm tra đủ 63 sản phẩm qua 29 lựa chọn chu kỳ: sáu biến thể Plan 3 được gắn đúng “Mua nhiều”, gồm cả hai khu vực của GOLD khi mở rộng; các gói khác không có tag. Sáu viewport không tràn và axe WCAG A/AA đạt. Đối chiếu computed style của gói nổi bật ở cả năm tab với Thuê VPS khớp nền, màu/viền/bóng, chữ/thông số, CTA và tag; viền focus trắng qua Tab/Shift+Tab và axe bảng giá của từng tab đạt. Các file nguồn Thuê VPS, dữ liệu/API n8n giữ nguyên. Chưa deploy.
