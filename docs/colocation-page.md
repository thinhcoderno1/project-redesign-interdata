# Thuê Chỗ Đặt Máy Chủ

`/vietnam-colocation/` thay thế `/vietnam-co-location/` bằng chuyển hướng 308,
giữ query string. Chỉ đổi `links.colocation`, không thêm dịch vụ song song.
Menu, trang chủ và trang giới thiệu dùng lại entry Colocation hiện có.
Canonical, Open Graph và Service JSON-LD dùng URL mới. Giữ chính sách robots
noindex/nofollow của project.

## Thiết kế và nội dung

Tái sử dụng CSS của Platinum Cloud Server cho Hero, dải thông tin, bảng giá,
sáu ứng dụng quanh ảnh trung tâm, FAQ, năng lực doanh nghiệp, minh chứng,
đối tác và CTA cuối. Bốn hàng hạ tầng dùng cùng bố cục xen kẽ của trang mẫu.
Phần nền xanh/card cắt góc của One Click được dùng cho bốn bước chuẩn bị và
bàn giao thiết bị; không chuyển tính năng Cloud sang Colocation.

Ảnh dùng tài nguyên hiện có: hero datacenter, tủ máy chủ, mạng, datacenter và
minh họa 3D Colocation. Ảnh chỉ minh họa; không chứng minh vị trí, phần cứng hay
công suất cụ thể. Source của trang Platinum và các component dùng chung không đổi.

Nội dung tập trung vào máy chủ do khách hàng sở hữu, không gian rack, nguồn điện,
làm mát, kết nối, địa điểm Hà Nội/TP.HCM và thủ tục bàn giao. Giải thích trách nhiệm
phần cứng, backup, quyền quản trị, hỗ trợ kỹ thuật, điện và tốc độ thực tế trong
16 FAQ. Không đưa đoạn quảng bá Dedicated Server đang lẫn trong trang cũ sang.
Không tự áp dụng CPU, RAM, NVMe, One Click, backup mặc định hoặc SLA của Cloud.

## Hợp đồng bảng giá

Đối chiếu ngày 21/10/2026 với [trang dịch vụ cũ](https://interdata.vn/vietnam-co-location).
Trang nguồn dùng bảng giá tĩnh theo tháng, không dùng API giá hoặc chu kỳ dài hạn:

| Tên gói         | Rack | Power | Giá/tháng   |
| --------------- | ---- | ----- | ----------- |
| Single Server   | 1U   | 750W  | 1.600.000đ  |
| Single Server   | 2U   | 750W  | 2.200.000đ  |
| Single Server   | 3U   | 750W  | 2.800.000đ  |
| Locking Cabinet | 42U  | 7200W | 36.000.000đ |

Giữ thứ tự, mô tả cấu hình, không giới hạn băng thông và Up to 40Gbps từ nguồn.
Giữ gói 2U được nhấn mạnh. Không suy ra phí khởi tạo, tổng kỳ đầu, giá gốc hoặc
giảm giá khi nguồn không công bố. Giá và nội dung lưu tại `src/data/colocation.ts`.

Bốn nút Liên hệ giữ `#support`, trỏ tới CTA tư vấn trên trang mới. Giữ hotline
`tel:+841900636822` của section hỗ trợ nguồn; thêm đường dẫn tư vấn `/lien-he/`
theo project hiện tại. Không tạo URL checkout hoặc tự thêm tham số billingcycle.

Power và Up to 40Gbps cần được đối chiếu với phương án và báo giá thực tế;
không trình bày như mức tiêu thụ miễn phí hoặc tốc độ cam kết mặc định. Không
biến thông tin uptime/Tier của trang nguồn thành chứng nhận hoặc cam kết mới.

## Kiểm tra

```powershell
npm run test:colocation
npm run lint
npm run typecheck
npm run build
```

Dev preview: http://localhost:3100/vietnam-colocation/
Biến `TEST_BASE_URL` chọn server QA khác. Script đối chiếu giá/cấu hình/CTA với
nguồn, metadata, Service schema, redirect, anchor, FAQ và không JavaScript.
Responsive 320/390/768/1024/1200/1440/1920px kiểm tra ảnh, nút Hero, giá, overflow và
axe WCAG A/AA. Bằng chứng lưu tại `artifacts/colocation/` (Git ignored).
Chưa deploy hoặc thực hiện đăng ký/thanh toán.

Kết quả local ngày 21/10/2026: kiểm tra Colocation, lint toàn project,
TypeScript, Prettier và build production đạt (38 route). Bảy viewport không tràn
ngang, ảnh tải đủ và không có vi phạm axe WCAG A/AA. Bảng giá, cấu hình và CTA
được đối chiếu trực tiếp với trang nguồn; FAQ và liên kết tư vấn dùng được khi
tắt JavaScript. Production local đạt HTTP 200, chuyển hướng 308, metadata, menu,
bảng giá và anchor liên hệ ở 390/1440px, không có lỗi runtime. Server production
tạm đã dừng; dev preview cổng 3100 vẫn hoạt động. Snapshot xác nhận giữ nguyên
trang Platinum, Thuê Máy Chủ và công việc có sẵn trước thay đổi này.
