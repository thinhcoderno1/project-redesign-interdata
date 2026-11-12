# Đồng bộ ba section công ty từ trang Thuê VPS

## Section câu chuyện thành công dùng chung

Tất cả 19 trang có phản hồi khách hàng, gồm Canhme và VPS Vibe Coding, dùng
`src/components/shared/success-stories.tsx` và CSS cùng tên. Sửa tiêu đề, mô tả,
bố cục tại đây; sửa nội dung, logo và thứ tự tại `src/data/testimonials.ts`.
`CustomerProof` gọi section này và giữ riêng phần báo chí. Các bản feedback
riêng của Canhme/Vibe Coding được thay bằng cùng component và carousel.

Thứ tự: Đồng Hồ Hải Triều → SEO Việt → UMIX Việt Nam → RealDev → WPTANGTOC OLS →
BALICO → Trường Phong → Digizone Việt Nam → Jobkey. Giữ nguyên lời nhận xét và logo.
`src/data/content.ts` tái xuất dữ liệu để các nơi đang sử dụng tiếp tục nhận
cùng thứ tự. Dữ liệu trong `vps-content.json` là snapshot nguồn nhập ban đầu,
không được dùng để hiển thị feedback.

Feedback Gia Tuấn — WPTANGTOC OLS được bổ sung ngày 12/11/2026 theo nội dung
người dùng cung cấp. Logo tải nguyên bản từ
`https://wptangtoc.com/wp-content/uploads/2021/06/logo-wp-tang-toc.png`, được dùng
trên trang chính thức `https://wptangtoc.com/wptangtoc-ols/`; lưu tại
`public/images/testimonials/logo-wptangtoc.png` (600 × 600).
Feedback này có `showFullQuote: true` để hiển thị toàn bộ ngay từ đầu, không có
nút “Xem đầy đủ / Thu gọn”; các feedback khác giữ cách hiển thị rút gọn.

Chạy `npm run test:success-stories` để kiểm tra nội dung SSR trên 19 trang,
giao diện desktop/mobile và tương tác trên trang chủ, Thuê VPS, Canhme, Vibe Coding.
`npm run test:testimonials` kiểm tra sâu carousel và đối chiếu lời nhận xét/logo
với nguồn theo từng khách hàng, cho phép thứ tự hiển thị mới.

Phần dưới ghi lại lịch sử đồng bộ trước đây.

Ngày 16/10/2026, Homepage và `/vps-amd/` dùng
`src/components/shared/company-proof-sections.tsx` để hiển thị lần lượt:

1. Câu Chuyện Thành Công Cùng InterData.
2. Báo Chí Nói Gì Về InterData?
3. Kiến tạo tương lai.

Component tái sử dụng `CustomerProof` với `controlsOnCards` và
`centerHeadings`, cùng `EducationSection` có tiêu đề như `/thue-vps/`.
CSS riêng sao chép thang chữ, màu, kiểu tiêu đề và giãn dòng của ba section
trên trang nguồn, chỉ áp dụng trong wrapper này. Bỏ các ghi đè kiểu chữ cũ
cho phản hồi/báo chí trong `amd.module.css`.

Homepage thay ba section tại vị trí cũ, sau Năng lực và trước Đối tác công
nghệ. VPS AMD thay hai section phản hồi/báo chí, thêm khối giáo dục còn thiếu
ngay sau Báo chí và trước FAQ. Nội dung tám phản hồi, 14 bài báo, bảy logo
giáo dục và thứ tự/URL lấy nguyên từ các component/dữ liệu dùng chung.
Trang `/thue-vps/`, dữ liệu, asset, giá và các section khác không chỉnh sửa.

Kiểm tra local:

- Build, gồm TypeScript; lint và formatting.
- Đối chiếu ba section với `/thue-vps/` tại
  320/390/768/1024/1440/1920px: chữ, logo, URL, font, màu, khoảng cách,
  căn giữa, thứ tự, một bản mỗi section và không tràn ngang.
- Đối chiếu nội dung/liên kết bên ngoài ba section trước/sau.
  Bộ so sánh loại số đếm slide và phạm vi carousel phụ thuộc hydration;
  kiểm tra carousel sau khi số slide đúng breakpoint.
- `test:testimonials` và `test:press` chạy riêng trên Homepage và VPS AMD:
  nội dung nguồn, nút/chấm/bàn phím, kéo/vuốt, resize, mở/thu gọn,
  tải ảnh, accessibility và fallback không JavaScript.
- `node scripts/verify-vps-proof-controls.mjs` kiểm tra trang nguồn và xác
  nhận Homepage/VPS AMD cũng đặt nút giữa cạnh card, giấu số slide trực quan.
  `verify-press.mjs` dùng màu CTA/viền như trang nguồn `#0066ed`, giữ
  token focus `#0043ec`.

Báo cáo và ảnh desktop/mobile tại `artifacts/shared-company-proof/`.
Production preview local cổng 3108 cũng đạt đối chiếu nội dung/kiểu hiển thị,
carousel, accessibility và fallback không JavaScript trên hai trang;
kiểm tra responsive production tại 390px và 1440px, báo cáo
`production-results.json` cùng thư mục.
Đây là kiểm chứng local, chưa triển khai lên tên miền chính thức.

## H2 Câu chuyện thành công hiển thị một dòng 16/10/2026

Thêm class riêng cho `#customer-proof-title` trong `CustomerProof` và đặt
`max-width: 100%` trong `customer-proof.module.css`. Quy tắc chỉ áp dụng
H2 phản hồi, gỡ giới hạn 790px từ `.section-heading h2`; ba trang Homepage,
`/thue-vps/`, `/vps-amd/` tự nhận cùng thay đổi. Giữ cỡ chữ, nội dung,
kiểu viết hoa, màu, mô tả và các heading khác.

Desktop/tablet 768–1920px hiển thị một dòng. Mobile vẫn xuống dòng tự nhiên
để giữ cỡ chữ 28px; ép một dòng ở 320px sẽ cần chữ khoảng 12px. Người dùng
đã xác nhận phương án desktop/tablet một dòng, mobile tự xuống dòng để dễ
đọc. Không ép `white-space: nowrap` trên mobile.

Build (gồm TypeScript), ESLint cho component và formatting đạt. QA local
tại 320/390/768/1024/1440/1920px trên cả ba route xác nhận một dòng từ
768px, không tràn ngang, nội dung/liên kết và kiểu chữ của toàn bộ H2
khớp trước/sau, nút chuyển carousel vẫn hoạt động. Ảnh và kết quả ở
`artifacts/customer-proof-title/`. Chưa deploy.
