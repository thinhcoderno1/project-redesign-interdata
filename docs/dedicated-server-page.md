# Thuê Máy Chủ

Trang `/thue-may-chu-vat-ly/` thay thế dịch vụ tại `/vietnam-dedicated-server/`.
URL cũ chuyển hướng 308 và giữ query string. `links.dedicated` cập nhật menu,
homepage và trang giới thiệu về cùng URL mới, không thêm entry dịch vụ song song.
Canonical, Open Graph và Service JSON-LD dùng URL mới. Chính sách robots của
project được giữ nguyên.

## Thiết kế

Tái sử dụng CSS của Platinum Cloud Server, không sửa source hoặc giao diện trang
mẫu. Giữ Hero, dải thông số, bảng giá, bốn hàng hạ tầng xen kẽ, sáu ứng dụng quanh
ảnh máy chủ trung tâm, năng lực, minh chứng doanh nghiệp, đối tác, FAQ và CTA.
Hệ điều hành có section riêng cho Dedicated Server; không đưa tính năng One Click
của Cloud sang khi chưa có căn cứ. CSS bổ sung được giới hạn trong component mới.

Ảnh dùng tài nguyên sẵn có: hero datacenter, máy chủ 3D Dedicated, tủ máy chủ,
SSD, mạng và datacenter. Các ảnh minh họa không chứng minh thiết bị cụ thể được
bàn giao. Không tạo hoặc thay ảnh của trang Platinum.

## Nội dung và giá

Đối chiếu ngày 21/10/2026:

- Trang nguồn: https://interdata.vn/vietnam-dedicated-server
- API Dedicated: https://support.interdata.vn/packages.php?gid=96&module
- Cổng đăng ký: https://support.interdata.vn/index.php?rp=/store/inter-dedi-power-series

Giữ pid, tên, thứ tự, mô tả, URL đăng ký và sáu chu kỳ 1/3/6/12/24/36 tháng.
API có bốn gói BASE, ULTRA, PRO, PLUS; ULTRA bật kiểm soát tồn kho và hiện còn 0.
Mặc định hiển thị ba gói còn hàng như trang cũ, chọn chu kỳ 24 tháng và nhấn mạnh
PRO. Có thể mở thêm gói hết hàng để xem cấu hình; CTA gói này dẫn tới liên hệ.
Khi tất cả hết hàng, vẫn hiển thị cấu hình và CTA tư vấn.

Giá chính được quy đổi theo tháng, làm tròn đến đồng, kèm `/tháng`; giá gốc
gạch ngang phía trên cũng quy đổi theo cùng số tháng. Tham khảo cách hiển thị của
INTER DEDI POWER SERIES 2026 trong `D:/InterData/canhme/app/components/HotDeals.tsx`;
giữ nguyên màu xanh, typography, kiểu card và vị trí khối giá của project hiện tại.
Giá gốc từng chu kỳ/pid lấy đúng bảng `ORIGINAL_PRICE_BY_PID` của project tham khảo
và lưu riêng trong `dedicatedOriginalPrices`, không suy ra từ phần trăm giảm giá.
Chỉ hiển thị giá gốc khi lớn hơn giá bán cùng kỳ. Giá bán, phí khởi tạo và checkout
vẫn lấy từ API nhóm 96. Theo yêu cầu tinh gọn, card không hiển thị các dòng
"Thanh toán", "Phí khởi tạo" và "Tổng kỳ đầu"; dữ liệu chu kỳ và phí trong API
vẫn được giữ nguyên. Không thêm lại dòng note tổng quát đã được yêu cầu xóa. Giá mô tả
"Giá chỉ ... khi đăng ký từ 2 Năm" được thay bằng giá động theo chu kỳ để tránh
hiểu nhầm khi đổi kỳ. Giữ nội dung tặng server 36 tháng với điều kiện xác nhận
chương trình. Thuế và tùy chọn đối chiếu ở bước đăng ký.

Nguồn fetch timeout 15 giây, revalidate 60 giây; lỗi có CTA thử lại qua
`/api/dedicated-server-pricing/`. Giá âm/không hợp lệ không được dùng để bán.
Checkout chỉ chấp nhận HTTPS ở `support.interdata.vn`, không có credentials,
giữ URL nguồn và bổ sung `billingcycle`. Không đặt hàng hoặc thanh toán khi QA.

Giữ 16 FAQ từ trang cũ, gồm hỗ trợ, bàn giao, RAID, nâng cấp, hoàn tiền, trách nhiệm
quản trị và mục đích sử dụng. Không chuyển thông số Cloud như vCPU, NVMe U.2 mặc
định hoặc cổng mạng 10 Gbps sang Dedicated. Đường truyền gói là 500 Mbps; mở rộng
tới 40 Gbps cần xác nhận. RAID không thay thế backup. Phạm vi hỗ trợ ứng dụng và
thời gian bảo trì khi nâng cấp cần thống nhất theo nhu cầu.

## Kiểm tra

```powershell
npm run test:dedicated-server
npm run lint
npm run typecheck
npm run build
```

Dev preview: http://localhost:3100/thue-may-chu-vat-ly/
`TEST_BASE_URL` cho phép chọn server khác. `SKIP_RETRY_FIXTURE=1` khi kiểm tra
production vì server production không nhận route fixture được tạo mới.

Script kiểm tra nguồn giá, phí khởi tạo, tồn kho, sáu chu kỳ, checkout, redirect,
metadata, FAQ, anchors, keyboard, không JavaScript, lỗi/phục hồi và responsive
320/390/768/1024/1440/1920px với axe WCAG A/AA. Fixture lỗi tạm được xóa trong
`finally`; chạy build sau khi script kết thúc. Bằng chứng và ảnh chụp lưu trong
`artifacts/dedicated-server/` (Git ignored). Đây là thay đổi local, chưa triển khai
lên website công khai.

Kết quả local ngày 21/10/2026: bộ kiểm tra Dedicated, lint toàn project,
typecheck, Prettier và build production đạt (37 route). Sáu viewport không tràn
ngang, ảnh hiển thị tải đủ và axe WCAG A/AA không phát hiện vi phạm. Không có
lỗi runtime; chế độ không JavaScript và thử lại sau lỗi kết nối đạt. Production
preview tạm đạt HTTP 200, API nhóm 96, chuyển hướng 308, menu đúng URL mới và
checkout chu kỳ năm ở 390/1440px; preview tạm đã dừng sau kiểm tra. Dev preview
3100 được giữ nguyên. Không deploy hoặc thực hiện đăng ký/thanh toán.
