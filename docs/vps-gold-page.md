# Trang VPS Gold

Trang chuẩn mới tại `/vps-gold/`, dùng để thay thế các URL Gold hiện có khi deploy project. Không tạo thêm một phiên bản Gold song song. Hai URL đang được dùng trong project, `/vps-gold-nvme-u2/` và `/vps-gold-enterprise-1gbps/`, chuyển hướng vĩnh viễn HTTP 308 về `/vps-gold/`, giữ query string.

## Thiết kế

Clone thiết kế hiện tại của `src/components/vps-platinum/` vào component/CSS riêng tại `src/components/vps-gold/`: Hero, dải thông số, bảng giá, nền tảng phần cứng, sáu ứng dụng quanh hình trung tâm, so sánh VPS/Shared Hosting, hạ tầng và quy trình ba bước, năng lực, khách hàng/báo chí/giáo dục, đối tác công nghệ, FAQ và CTA cuối.

Nội dung sản phẩm dùng Intel Xeon Gold, NVMe, cổng mạng và lưu lượng theo gói, quyền quản trị và hai vị trí HCM/Hà Nội. Không sao chép model CPU, nhóm FPT/Viettel/Hot Deals, KVM hoặc thông số Gen 4 của Platinum khi chưa có bằng chứng riêng cho Gold. Không đưa các tinh chỉnh riêng của Linux sang. Section One Click được bổ sung theo yêu cầu riêng bên dưới. Thông tin công ty dùng component chung; các badge của trang có icon trang trí. Hero giữ badge ẩn theo thiết kế Platinum.

## Nguồn và dữ liệu giá

Đối chiếu ngày 19/10/2026:

- <https://interdata.vn/vps-gold-nvme-u2/>
- <https://interdata.vn/vps-gold-enterprise-1gbps/>
- API <https://support.interdata.vn/packages.php?gid=20&module>

Hai trang cũ dùng cùng danh sách 18 sản phẩm trong `__NEXT_DATA__.props.pageProps.products`: 9 gói HCM, sau đó 9 gói Hà Nội. Giữ nguyên pid, tên, thứ tự, description, tổng tiền từng chu kỳ và `product_url`. Không áp quy tắc ẩn HN của Platinum. Cấu hình lưu trữ giữa các Plan HCM/HN có thể khác nhau nên không gộp theo số Plan.

API hiện không cung cấp kỳ tháng (`monthly = -1`). Kỳ mặc định là 3 tháng, giá Plan 1 HCM là 332.000đ/3 tháng. Hiện có năm kỳ 3/6/12/24/36 tháng. Không hiển thị giá âm, không chia tiền chu kỳ dài thành giá tháng, không suy ra phần trăm giảm giá. Chỉ các kỳ có giá hợp lệ mới xuất hiện. Các trường giá được hỗ trợ vẫn gồm đủ sáu khóa chuẩn để tương thích khi upstream bổ sung kỳ mới.

`src/lib/vps-gold-pricing.ts` kiểm tra gid 20, pid nguyên, các trường bắt buộc, checkout HTTPS tại `support.interdata.vn` không có user/password, giá hữu hạn không âm; timeout 15 giây, revalidate 60 giây. Khi upstream lỗi, trang vẫn có nội dung cùng trạng thái bảng giá lỗi và nút thử lại qua `/api/vps-gold-pricing/` (trả 502 khi nguồn giá lỗi).

Mặc định hiện bốn gói đầu, mở rộng được đủ 18 gói, đổi chu kỳ bằng chuột hoặc bàn phím. Checkout giữ URL sản phẩm và thêm `billingcycle` đúng kỳ đã chọn. Không JavaScript vẫn có bốn gói và link tới cổng đăng ký. Giá, thuế, tùy chọn, khả năng cung cấp và giá gia hạn cần được kiểm tra ở trang đặt hàng; không tuyên bố tồn kho hay tự thực hiện giao dịch.

Danh mục dùng `/vps-gold/` tại `src/data/service-catalog.ts` và `src/data/vps-content.json`, áp dụng cho navigation, homepage và bộ chọn dịch vụ Thuê VPS. Metadata, Open Graph và Service JSON-LD dùng URL mới. Giữ nguyên noindex/nofollow của toàn project.

## Hình ảnh

Ba ảnh mới tạo bằng built-in `image_gen`, tối ưu WebP tại `public/images/vps-gold/`:

- `hero.webp`: chip Intel Xeon Gold bên phải, khoảng tối cho nội dung bên trái.
- `platform.webp`: phần cứng máy chủ và CPU Xeon Gold, không gắn model cụ thể.
- `center.webp`: máy chủ và CPU Gold, giữ nền trong suốt.

Prompt, phương pháp và file nguồn tại [vps-gold-image-prompts.json](./vps-gold-image-prompts.json). Đây là ảnh minh họa, không phải bằng chứng về một cơ sở hoặc model phần cứng cụ thể. Các hình ứng dụng, hạ tầng và CTA dùng asset VPS chung phù hợp với web, lập trình, dữ liệu, automation, mạng và sao lưu; không dùng ảnh sản phẩm Platinum/AMD.

## Kiểm tra

```powershell
npm run test:vps-gold
npm run lint
npm run typecheck
npm run build
```

`TEST_BASE_URL` mặc định `http://localhost:3100`; `GOLD_QA_DEV_BASE_URL` chọn dev server cho fixture lỗi/thử lại. Fixture tạm tự xóa sau kiểm tra; chạy build sau khi kiểm thử đã hoàn tất.

Bộ kiểm tra đối chiếu API thật: đủ gói HCM/HN, thứ tự, mô tả, mọi giá và checkout của các kỳ hiện có, loại giá âm và dữ liệu sai, API outage/retry; canonical/Service JSON-LD/noindex, hai redirect giữ query, mở rộng, phím điều hướng chu kỳ, FAQ, CTA cuộn tới giá và không JavaScript. Responsive tại 320/390/768/1024/1440/1920px gồm ảnh tải đúng, không dùng ảnh AMD/Platinum, icon badge, hai nút Hero cùng kích thước, không tràn ngang và axe WCAG A/AA. Bằng chứng lưu tại `artifacts/vps-gold/`.

Đây là công việc local; chưa deploy lên website công khai và không thực hiện đặt hàng/thanh toán.

Kết quả 19/10/2026: `test:vps-gold`, build production, ESLint, TypeScript, Prettier và `git diff --check` đạt. Đối chiếu đủ 18 sản phẩm HCM/Hà Nội qua 5 chu kỳ hiện có; sáu viewport đạt kiểm tra ảnh, badge, kích thước hai nút Hero, tràn ngang và axe WCAG A/AA. Không JavaScript và lỗi/thử lại đạt. Production preview local xác nhận HTTP 200, mặc định kỳ 3 tháng, checkout đúng kỳ năm và cả hai redirect 308 giữ query string; 320px không tràn ngang hoặc lỗi runtime. Dev preview: `http://localhost:3100/vps-gold/`. Homepage, Linux và Platinum tiếp tục trả HTTP 200; spacing Linux giữ nguyên, không sửa source của Platinum/Linux trong tác vụ Gold.

## Section triển khai trong 1 Click

Tái sử dụng nguyên component `src/components/vps/environments.tsx` của trang Thuê VPS, đặt ngay sau `#ung-dung` có badge “PHÙ HỢP VỚI NHIỀU NHU CẦU” và trước `#so-sanh`. Giữ tiêu đề, mô tả, năm hệ điều hành, bốn ứng dụng, logo và hai tab với thao tác Arrow/Home/End. Không sao chép component hoặc dữ liệu thành một bản riêng.

Class `environments` trên Gold cung cấp các biến typography giống trang nguồn. Nền gradient, padding, thẻ, logo, text và tương tác của section chung giữ nguyên. Phần so sánh phía sau có padding trên 72px desktop, 56px tablet và 44px mobile để không sát mép nền xanh. Không sửa component chung hay spacing trang Linux.

`test:vps-gold` bổ sung kiểm tra vị trí, số thẻ và điều hướng bàn phím của hai tab. Snapshot trước sửa và bằng chứng đối chiếu source/responsive nằm trong `artifacts/vps-gold/one-click/`.

Kiểm tra bổ sung đạt cho cả hai tab tại 320/390/768/1024/1440/1920px: text, logo, typography, màu và padding khớp trang Thuê VPS; ảnh tải đầy đủ, không tràn ngang và axe WCAG A/AA không phát hiện lỗi. Vị trí section và khoảng đệm trước phần so sánh đạt. `test:vps-gold`, build, ESLint và Prettier đạt; snapshot xác nhận nội dung và CSS cũ của Gold giữ nguyên ngoài phần tích hợp và padding trên của so sánh.
