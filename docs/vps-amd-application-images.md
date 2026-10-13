# Ảnh section Phù hợp với nhiều nhu cầu

Cập nhật 13/10/2026, chỉ áp dụng cho `#ung-dung` trên `/vps-amd/`.

Bộ năm ảnh được tạo riêng bằng công cụ tích hợp `image_gen`, phong cách
ảnh doanh nghiệp với ánh sáng tự nhiên và màu trung tính. Đây là các cảnh
minh họa được tạo, không phải ảnh hạ tầng, nhân viên hoặc khách hàng thực tế
của InterData. Giao diện trên màn hình chỉ dùng để minh họa ứng dụng.

| Card | Asset trong public/images/vps-amd/ | Bối cảnh |
| --- | --- | --- |
| Website & App | application-web-v3.webp | Laptop và điện thoại hiển thị website |
| Lập trình & DevOps | application-devops-v3.webp | Màn hình code trong văn phòng |
| Cơ sở dữ liệu | application-database-v3.webp | Thiết bị lưu trữ trong rack |
| Tác vụ tự động | application-automation-v3.webp | Màn hình quy trình tác vụ |
| Hệ thống nội bộ | application-business-v3.webp | Laptop CRM trong phòng họp |

Prompt đầy đủ: `docs/vps-amd-application-image-prompts.json`.
Các ảnh v2 và prompt cũ được giữ trên đĩa nhưng không còn dùng trong section.

Hover phóng ảnh 4,5% trong 350ms, giới hạn trong khung ảnh. Card, nội dung
và bố cục không di chuyển. Chỉ kích hoạt với thiết bị có hover và con trỏ
chính xác; tắt hiệu ứng khi bật `prefers-reduced-motion: reduce`.
