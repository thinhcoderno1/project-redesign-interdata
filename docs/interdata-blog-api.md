# Kiến thức & Tin tức — API blog InterData

Section `#tai-nguyen` dùng WordPress REST API công khai tại `https://interdata.vn/blog/wp-json/wp/v2/`. Không cần API key và không gọi API WordPress từ trình duyệt.

## Các tab

| Tab               | Bộ lọc nguồn                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Tin Tức - Sự Kiện | Category slug `su-kien` và các chuyên mục con                                                       |
| Blog              | Bài kiến thức/hướng dẫn, loại trừ ba nhóm tin tức, khuyến mãi và tuyển dụng cùng các chuyên mục con |
| Khuyến Mãi        | Category slug `khuyen-mai` và các chuyên mục con                                                    |
| Tuyển Dụng        | Category slug `tuyen-dung` và các chuyên mục con                                                    |

ID chuyên mục được tìm từ API, không gắn cố định trong code. Mỗi tab lấy tối đa 4 bài đã xuất bản (`status=publish`), sắp xếp theo ngày đăng từ mới đến cũ (`orderby=date&order=desc`). Chuyên mục có ít bài sẽ hiển thị đúng số bài nguồn cung cấp; tại thời điểm kiểm tra ngày 10/10/2026, Tuyển Dụng có 2 bài.

API cung cấp title, excerpt, permalink, ngày xuất bản và featured media. HTML được chuyển thành văn bản và giải mã HTML entities bằng `entities`; React hiển thị văn bản thông thường. Ngày hiển thị theo múi giờ Việt Nam. Ảnh lấy từ `large`, `medium_large` hoặc ảnh gốc và được Next Image tối ưu; chỉ cho phép ảnh HTTPS thuộc `interdata.vn/blog/wp-content/uploads/`. Ảnh khuyến mãi hiển thị trọn vẹn để tránh cắt nội dung banner.

## Tự động cập nhật

`fetch(..., { next: { revalidate: 300 } })` lưu dữ liệu 5 phút; trang chủ cũng đặt `revalidate = 300`. Trong production, lượt truy cập sau khi hết hạn cache kích hoạt làm mới ở nền, lượt đó có thể vẫn thấy dữ liệu cache trước. Lượt truy cập tiếp theo nhận bản cập nhật sau khi làm mới thành công. Không cần cập nhật `src/data/articles.json` hoặc build/deploy lại cho bài mới. Tab đang mở nhận dữ liệu mới khi trang được tải lại; không polling liên tục.

Triển khai cần Next.js server có kết nối HTTPS đến InterData; cơ chế này không dành cho static export hoặc bản HTML được tải lên riêng lẻ. Trang chủ hiện vẫn được prerender, với thời gian revalidate 5 phút.

## Trạng thái lỗi và tương tác

- Timeout mỗi request là 8 giây. Một chuyên mục lỗi không làm mất các chuyên mục khác; nếu không lấy được danh sách chuyên mục thì hiển thị trạng thái chưa tải được bài cùng liên kết đến blog gốc. Không dựng bài giả hoặc trộn bài từ chuyên mục khác vào mục đang lỗi.
- Chuyên mục rỗng có thông báo riêng. Ảnh thiếu/tải lỗi dùng minh họa InterData, tiêu đề và liên kết bài vẫn hoạt động.
- Tabs hỗ trợ bàn phím trái/phải, Home/End, `aria-selected` và `aria-controls`. Khi JavaScript bị tắt, cả bốn nhóm bài và liên kết nguồn vẫn hiển thị.
- Grid 4 cột trên desktop, 2 cột trên tablet và 1 cột trên mobile; nhóm có 2 bài dùng 2 cột trên desktop.

## Kiểm tra

- `npm run test:resources:data`: bộ lọc/danh mục con, phân trang chuyên mục, ngày/HTML entities, dữ liệu lỗi, cache, lỗi API độc lập và UI rỗng/lỗi/thiếu ảnh.
- `npm run test:resources`: so sánh thẻ bài với API trực tiếp, 320–1920px, keyboard, accessibility, no-JavaScript và lỗi ảnh. Dùng `QA_BASE_URL` để kiểm tra production preview trên cổng khác.
- `npm run build`, `npm run lint`.
- Ảnh chụp/kết quả lưu tại `artifacts/resources/` (Git ignore).

Nguồn kiểm tra: [API categories](https://interdata.vn/blog/wp-json/wp/v2/categories?per_page=100), [WordPress Posts REST API](https://developer.wordpress.org/rest-api/reference/posts/) và tài liệu Next.js `fetch`/caching đi kèm phiên bản đang cài trong `node_modules/next/dist/docs/`.
