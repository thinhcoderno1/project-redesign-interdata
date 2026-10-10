# Trang Giới thiệu InterData

Route: `/gioi-thieu/`. Nội dung ở `src/components/about/about-page.tsx`, dữ liệu ảnh và hoạt động ở `src/data/about.ts`, CSS riêng ở `src/components/about/about.module.css`. Trang nhận header/footer từ layout website; không gọi component của homepage.

## Nội dung và nguồn

- Giới thiệu thương hiệu thuộc Công ty Cổ phần Inter Group, định hướng và ba giá trị được biên tập từ [About us hiện tại](https://interdata.vn/about-us).
- Các dịch vụ VPS, Cloud Server, thuê máy chủ và colocation dùng cùng URL với danh mục đã có trong project. Phần mô tả tập trung vào nhu cầu sử dụng.
- Ảnh văn phòng, workshop và giới thiệu cấu trúc máy chủ: [chương trình đón sinh viên FPT Polytechnic](https://interdata.vn/blog/interdata-chao-don-sinh-vien-truong-cao-dang-fpt-polytechnic-ho-chi-minh/), diễn ra **21/02/2025**, bài đăng 24/02/2025. Ảnh nhóm có cả sinh viên, không được giới thiệu là ảnh toàn bộ nhân viên.
- Ảnh nhân sự, tư vấn ứng viên và ký kết với UEF: [FIT Career Day 2026](https://interdata.vn/blog/fit-career-day-2026-ket-noi-nhan-tai-kien-tao-tuong-lai/), diễn ra **16/03/2026**, bài đăng 17/03/2026.
- Hợp tác và ảnh tại IDC Điện Biên Phủ: [bài chính thức về VNPT](https://interdata.vn/blog/interdata-hop-tac-chien-luoc-cung-vnpt/), sự kiện **27/05/2024**, bài đăng 03/07/2024. Không diễn đạt datacenter của đối tác là tài sản sở hữu của InterData.
- Hoạt động cùng Đại học Yersin: [bài chính thức](https://interdata.vn/blog/le-ky-ket-mou-interdata-va-dai-hoc-yersin/), sự kiện **26/04/2024**, bài đăng 06/05/2024.
- Tên pháp nhân và mã số thuế 0316918910 đối chiếu với About us. Hotline/email giữ thống nhất với footer hiện có. Không lặp địa chỉ văn phòng vào nội dung mới vì About us và footer blog đang có hai địa chỉ khác nhau; footer chung được giữ theo project hiện tại.

Không thêm số khách hàng, tuổi doanh nghiệp, đánh giá, chứng nhận, SLA hoặc cam kết kỹ thuật chưa được duyệt. Các cột mốc là một số hoạt động đã công bố, không phải lịch sử đầy đủ của doanh nghiệp.

## Ảnh

Chín ảnh thật được tải từ WordPress chính thức, giữ logo và nội dung ảnh. WebP có chiều rộng tối đa 1600px, không phóng lớn ảnh nguồn. `docs/about-assets.json` ghi URL ảnh gốc, bài nguồn, kích thước và dung lượng từng file. Bộ ảnh được lưu trong `public/images/about/`, nên trang không phụ thuộc tải ảnh từ WordPress khi render.

Hero dùng ảnh hoạt động và một ảnh nhỏ tại ngày hội việc làm. Các section tiếp theo xen kẽ thông tin doanh nghiệp, hạ tầng, cụm ảnh con người và ba card sự kiện có ngày, chú thích, link bài nguồn. Không dùng ảnh giả lập văn phòng hoặc đội ngũ.

## URL và metadata

- `links.about` đổi thành `/gioi-thieu/`, header/footer dùng liên kết nội bộ Next.js.
- `next.config.ts` bật `trailingSlash: true` để URL chính có dấu `/` cuối, phù hợp route yêu cầu. Các route trang khác cũng được chuẩn hóa có slash; homepage `/` và file tĩnh không đổi.
- `/about-us/` chuyển hướng vĩnh viễn 308 sang `/gioi-thieu/` trong ứng dụng này. `/about-us` được chuẩn hóa slash rồi chuyển hướng. Việc thay đổi website đang chạy tại interdata.vn cần triển khai source mới.
- Title, description, canonical và Open Graph được khai báo ở file route. Trang kế thừa `noindex,nofollow` của bản review hiện tại.

## Kiểm tra

```powershell
npm run lint
npm run build
npm run test:about
node scripts/verify-topbar.mjs
```

Kiểm tra browser cần server cục bộ đang chạy; có thể đặt `TEST_BASE_URL` để kiểm tra dev hoặc production. `verify-about` kiểm tra 320–1920px, ảnh, overflow, accessibility, anchor clearance, chuyển homepage/trang Giới thiệu, URL cũ và fallback không JavaScript.

### Kết quả ngày 10/10/2026

- Lint không có warning/error; production build thành công, `/gioi-thieu` được prerender.
- `test:about` đạt cả dev (3100) và production cục bộ (3101) ở 320, 390, 768, 1024, 1440 và 1920px. Chín ảnh tải đầy đủ, không tràn ngang, không có page error hoặc vi phạm axe; chuyển trang, anchor, redirect và bản không JavaScript đạt.
- `verify-topbar` đạt 320–1440px; `test:ui` homepage đạt 360–1440px.
- So sánh nội dung, ảnh và computed styles homepage ở 320, 768, 1440px đạt cả dev và production. Baseline giữ nguyên, chỉ bản sao dùng cho lần kiểm tra này cập nhật href Giới thiệu đã được yêu cầu.
- Đã xem trực tiếp ảnh chụp desktop/mobile của hero, cụm ảnh con người và card hoạt động. Ảnh chụp và kết quả máy kiểm tra lưu trong `artifacts/about/qa/` và `artifacts/about/production-qa/` (không commit).

Đây là xác nhận trên máy cục bộ; chưa triển khai website công khai. Server production thử nghiệm được dừng sau kiểm tra; dev server hiện có được giữ nguyên.
