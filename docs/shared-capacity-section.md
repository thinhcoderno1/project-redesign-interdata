# Section Năng lực InterData dùng chung

`src/components/shared/capacity-section.tsx` là component duy nhất cho section
`#nang-luc`. Các trang chỉ import và render `<CapacitySection />`, không truyền
cấu hình giao diện riêng.

- Nội dung và số liệu lấy từ `src/data/content.ts`, giữ quy tắc duyệt claims.
- Bố cục, typography và responsive: `capacity-section.module.css`.
- Bản đồ 3D trang trí, node và kết nối: `capacity-network-map.tsx` và CSS module.
  Các node mang tính minh họa, không biểu thị vị trí datacenter thực tế.
- Số đếm: `capacity-stats.tsx` và CSS module. Số liệu vẫn có trong HTML khi
  JavaScript chưa chạy. Số đếm và bản đồ tôn trọng `prefers-reduced-motion`.

Section được dùng tại homepage, Thuê VPS, Cloud Server, AMD Cloud Server,
Platinum Cloud Server, Máy chủ vật lý, Colocation, VPS Platinum, VPS Linux,
VPS Gold, VPS n8n, Private Network, Proxmox/CEPH, Kubernetes, VMware và S3 Storage.
Những trang chưa có section này không được thêm section mới.

Chỉnh giao diện tại các file dùng chung trên; tránh thêm override trong CSS
của từng trang. Kiểm tra bằng `npm run test:capacity` với server tại port 3100
hoặc đặt `TEST_BASE_URL`. Bài kiểm tra so sánh giao diện thực tế trên 16 trang,
4 kích thước viewport, kiểm tra số đếm, chế độ giảm chuyển động và accessibility
trên các trang đại diện. Ảnh kiểm tra lưu tại `artifacts/capacity/`.
