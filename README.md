# InterData homepage — bản review

Homepage tiếng Việt được triển khai bằng Next.js App Router, React và TypeScript. Thư mục đích ban đầu trống và không phải Git repository. Không thay đổi hai dự án dùng làm nguồn.

```powershell
npm install
npm run dev
```

Preview: http://localhost:3100. Trang Giới thiệu: http://localhost:3100/gioi-thieu/. Trang Liên hệ: http://localhost:3100/lien-he/. Báo cáo nội dung: http://localhost:3100/content-review/.

```powershell
npm run lint
npm run typecheck
npm run build
npm run start
npm run test:ui
npm run test:about
npm run test:contact
npm run test:parallax
npm run test:testimonials
npm run test:links
node scripts/contrast-check.mjs
```

`test:ui`, `test:parallax`, `test:testimonials` và `test:links` cần server cục bộ đang chạy. Nếu thiếu browser của Playwright, chạy `npx playwright install chromium`. Không chạy `dev` và `start` cùng port. Lệnh `start` phục vụ bản production cục bộ sau khi build; chưa deploy.

Section phản hồi có 8 feedback từ `D:\InterData\thue-vps\components\testimonials-2.jsx`, sử dụng logo và nguyên văn lời chia sẻ. Carousel chuyển bằng nút, chấm chọn, bàn phím, kéo chuột hoặc vuốt; không tự chạy. `test:testimonials` kiểm tra thêm bản nguồn nếu checkout này có sẵn, hoặc đường dẫn đặt trong `TESTIMONIAL_SOURCE_ROOT`.

- `src/data/content.ts`: dịch vụ, giải pháp, phản hồi, báo chí, trường học, CTA và trạng thái duyệt.
- `src/data/articles.json`: tiêu đề, ảnh, URL và ngày xuất bản lấy từ WordPress API chính thức; trang không gọi API khi tải.
- `src/app/(website)/(home)/page.tsx`: route homepage `/`, metadata và thời gian cập nhật.
- `src/app/(website)/layout.tsx`: header/footer chung cho homepage và các trang con.
- `src/components/home`: nội dung, section và CSS riêng của homepage.
- `src/components/about`: nội dung và CSS riêng của trang Giới thiệu.
- `docs/about-page.md`: nội dung, nguồn ảnh và kiểm tra trang Giới thiệu.
- `src/components/contact`: trang Liên hệ, bản đồ văn phòng và công cụ soạn email.
- `docs/contact-page.md`: nguồn thông tin, hành vi Google Maps và phạm vi tiếp nhận yêu cầu.
- `src/components/layout`: điều hướng, footer và widget liên hệ nổi.
- `src/components/ui`: icon và thành phần tái sử dụng.
- `src/app/globals.css`: semantic color tokens, UI nền tảng và style dùng chung.
- `docs/project-structure.md`: cấu trúc thư mục và cách thêm trang con.
- `docs/asset-manifest.json`: nguồn từng tài sản và kích thước ảnh đã nén.
- `docs/IMPLEMENTATION-HANDOFF.md`: kết quả kiểm tra và các mục cần xác nhận.

Mặc định là bản review, `noindex,nofollow`. `NEXT_PUBLIC_CONTENT_MODE=public` ở thời điểm build ẩn claims/chiến dịch/hạ tầng chưa duyệt và trang báo cáo. Chỉ đổi trạng thái `approved` sau khi có xác nhận thật. Chế độ public chưa được kiểm tra trong lần này; cấu hình indexing cần được quyết định riêng trước khi xuất bản.

Hai tài liệu gốc tìm thấy tại `C:\Users\interdigi 03\Downloads\KLVN\BlogPost` và được sao chép nguyên văn vào `docs/`. Các tài sản đã được đóng gói trong `public`, nên build không phụ thuộc hai dự án nguồn. `scripts/prepare-assets.mjs` chỉ dùng khi cần tái tạo asset từ đúng các đường dẫn nguồn, đồng thời cập nhật snapshot bài viết và font; không chạy trong build thường.
