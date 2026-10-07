# InterData homepage — bản review

Homepage tiếng Việt được triển khai bằng Next.js App Router, React và TypeScript. Thư mục đích ban đầu trống và không phải Git repository. Không thay đổi hai dự án dùng làm nguồn.

```powershell
npm install
npm run dev
```

Preview: http://localhost:3100. Báo cáo nội dung: http://localhost:3100/content-review.

```powershell
npm run lint
npm run typecheck
npm run build
npm run start
npm run test:ui
npm run test:links
node scripts/contrast-check.mjs
```

`test:ui` và `test:links` cần server cục bộ đang chạy. Nếu thiếu browser của Playwright, chạy `npx playwright install chromium`. Không chạy `dev` và `start` cùng port. Lệnh `start` phục vụ bản production cục bộ sau khi build; chưa deploy.

- `src/data/content.ts`: dịch vụ, giải pháp, phản hồi, báo chí, trường học, CTA và trạng thái duyệt.
- `src/data/articles.json`: tiêu đề, ảnh, URL và ngày xuất bản lấy từ WordPress API chính thức; trang không gọi API khi tải.
- `src/components`: điều hướng, selector tư vấn, icon và bản đồ trang trí.
- `src/app/globals.css`: semantic color tokens, layout và responsive states.
- `docs/asset-manifest.json`: nguồn từng tài sản và kích thước ảnh đã nén.
- `docs/IMPLEMENTATION-HANDOFF.md`: kết quả kiểm tra và các mục cần xác nhận.

Mặc định là bản review, `noindex,nofollow`. `NEXT_PUBLIC_CONTENT_MODE=public` ở thời điểm build ẩn claims/chiến dịch/hạ tầng chưa duyệt và trang báo cáo. Chỉ đổi trạng thái `approved` sau khi có xác nhận thật. Chế độ public chưa được kiểm tra trong lần này; cấu hình indexing cần được quyết định riêng trước khi xuất bản.

Hai tài liệu gốc tìm thấy tại `C:\Users\interdigi 03\Downloads\KLVN\BlogPost` và được sao chép nguyên văn vào `docs/`. Các tài sản đã được đóng gói trong `public`, nên build không phụ thuộc hai dự án nguồn. `scripts/prepare-assets.mjs` chỉ dùng khi cần tái tạo asset từ đúng các đường dẫn nguồn, đồng thời cập nhật snapshot bài viết và font; không chạy trong build thường.
