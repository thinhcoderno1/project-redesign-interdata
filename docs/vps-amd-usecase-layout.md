# Section Phù hợp với nhiều nhu cầu

Cập nhật 13/10/2026 theo ảnh người dùng cung cấp, chỉ áp dụng `#ung-dung`.

- Desktop từ 1200px: ba card bên trái, ba card bên phải, hình AMD/máy chủ
  ở giữa. Tiêu đề căn giữa, nền sáng, bo góc nhẹ, icon màu theo nhu cầu.
- Màn hình nhỏ hơn: hình AMD trên đầu danh sách, card tự sắp xếp để chữ dễ đọc.
  Mobile dùng chiều rộng đầy đủ cho mô tả, ảnh và nút ở hàng riêng bên dưới.
- Sáu nhóm: Website & Landing Page; Lập trình & Phát triển; Streaming & Media;
  Ứng dụng & Cơ sở dữ liệu; AI Agent; Lưu trữ & Sao lưu dữ liệu.
- Không có Game Server, voice server, controller hoặc nội dung gaming.
  AI Agent mô tả việc chạy agent/workflow, công cụ và kết nối mô hình qua API.
  Không hứa hẹn GPU hoặc khả năng huấn luyện mô hình từ cấu hình CPU.
- Mỗi nút mũi tên có nhãn truy cập theo nhu cầu, đích `#bang-gia` thực tế.
  Giữ link tư vấn ở cuối section. Không thay nội dung các section khác.
- Hover/focus phóng ảnh nhẹ trong khung, giữ bố cục; reduced motion tắt chuyển động.

Bộ ảnh minh họa tạo bằng công cụ tích hợp `image_gen`, không phải ảnh hạ tầng
thực tế InterData. WebP giữ nền trong suốt; sáu ảnh card 480 × 480, ảnh giữa
1000 × 1000. Prompt đầy đủ: `docs/vps-amd-usecase-image-prompts.json`.

Asset trong `public/images/vps-amd/`:

- `usecase-website-v4.webp`
- `usecase-development-v4.webp`
- `usecase-media-v4.webp`
- `usecase-database-v4.webp`
- `usecase-agent-v4.webp`
- `usecase-backup-v4.webp`
- `usecase-amd-center-v5.webp`

Các asset v2/v3 được giữ trên đĩa. Ghi chú này thay mô tả bộ năm card cũ trong
`docs/vps-amd-application-images.md`, riêng cho section Phù hợp với nhiều nhu cầu.

Hình AMD ở giữa được tạo lại bằng `image_gen` với ảnh mẫu người dùng làm
reference trực tiếp: chip dẹt, máy chủ ba tầng gọn, viền xanh, bệ kính trong
suốt và panel mờ phía sau. Prompt mới: `docs/vps-amd-center-v5-prompt.json`.
Ảnh v4 giữ trên đĩa; bản v5 cũng là minh họa, không phải ảnh phần cứng thực tế.
Desktop hiển thị vùng ảnh 480px, nằm dưới lớp card để ánh sáng nền không
che chữ; kích thước và vị trí card giữ nguyên. Tablet 300px, mobile 260px.

QA local: lint, typecheck, build và `test:vps-amd` đạt. Kiểm tra riêng section
tại 320/390/768/1024/1440/1920px: sáu card, bảy ảnh tải đủ, không tràn ngang,
nút 44px, link/keyboard/hover/reduced motion/no-JavaScript và axe WCAG A/AA đạt.
Source ngoài section và dữ liệu applications giữ nguyên phạm vi: chỉ cập nhật
nhóm nhu cầu và markup liên quan; nội dung các section khác không thay đổi.
Ảnh và kết quả: `artifacts/amd-usecases-layout/`. Chưa triển khai production.
