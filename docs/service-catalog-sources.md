# Nguồn nội dung và giá cho danh mục dịch vụ

Đối chiếu ngày **08/10/2026**. Giá được lưu tĩnh tại `src/data/service-catalog.ts`, không tự đồng bộ với hệ thống thanh toán. Khi cập nhật, kiểm tra lại trang dịch vụ, gói và kỳ thanh toán, rồi sửa cả ngày đối chiếu.

| Dịch vụ | Giá hiển thị | Gói được đối chiếu | Nguồn chính thức |
| --- | --- | --- | --- |
| VPS AMD | 150.000đ/tháng | VPS AMD Plan 1 | https://interdata.vn/vps-amd/ |
| VPS Platinum | 174.000đ/tháng | Tab VPS PLATINUM FPT, Plan 1: 1C-2G-20G-Platinum | https://interdata.vn/platinum/ |
| VPS Linux | 95.000đ/tháng | Linux Plan 1, IPv4 Private | https://interdata.vn/vps-linux/ |
| VPS Gold | 332.000đ/3 tháng | VPS GOLD PLAN 1: 1C-1G-20G | https://interdata.vn/vps-gold-nvme-u2/ |
| VPS n8n | 150.000đ/tháng | Gói tham khảo: tab VPS AMD, Plan 1 | https://interdata.vn/vps-n8n/ |
| VPS Vibe Coding | 277.000đ/tháng | Vibe Basic, chỉ hỗ trợ mã nguồn EzyPlatform | https://interdata.vn/vps-vibe-coding/ |
| AMD Cloud Gen 3 | 165.000đ/tháng | AMD G3 Cloud Plan 1 | https://interdata.vn/amd-epyc-gen3-cloud/ |
| Intel Platinum Cloud Gen 2 | 150.000đ/tháng | Platinum G2 Cloud Plan 1 | https://interdata.vn/intel-platinum-gen2-cloud/ |

## Cách trình bày giá

- Dùng giá gói theo kỳ thanh toán công bố. Không quy đổi giá năm hoặc quý thành giá tháng.
- Platinum dùng gói FPT thanh toán tháng; không dùng giá hero 83.000đ/tháng quy đổi từ ưu đãi thanh toán năm.
- n8n có nhiều dòng VPS nền. Giá 150.000đ là gói AMD Plan 1 được chọn làm ví dụ và được ghi rõ là **gói tham khảo**, không phải giá thấp nhất của mọi dòng VPS n8n.
- Linux ghi rõ IPv4 Private. Vibe Coding ghi rõ phạm vi EzyPlatform. Gold hiển thị kỳ 3 tháng ngay cạnh giá.
- Không suy luận giá đã/chưa bao gồm VAT hoặc thêm cam kết kỹ thuật từ thông tin không được xác nhận.
- Mỗi card dẫn đến trang dịch vụ tương ứng để khách kiểm tra cấu hình, kỳ thanh toán và ưu đãi hiện hành.

## Bằng chứng cục bộ

Các file `artifacts/pricing-source-*.html` lưu HTML của 8 nguồn; `artifacts/live-price-platinum.txt`, `artifacts/live-price-vps-gold-nvme-u2.txt` và `artifacts/n8n-live-pricing.txt` ghi lại bảng giá sau khi JavaScript tải dữ liệu. `artifacts/` không nằm trong Git.

Thuê Máy Chủ và Colocation giữ nguồn nội dung, tính năng và CTA trong `src/data/content.ts`; không tự thêm giá.
