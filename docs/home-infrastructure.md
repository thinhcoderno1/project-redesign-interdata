# Hạ tầng Homepage theo thiết kế trang Thuê VPS

Ngày 16/10/2026, `HomeInfrastructure` trong
`src/components/home/infrastructure-section.tsx` thay section `#ha-tang`
cũ của Homepage. Vị trí vẫn nằm sau Đối tác công nghệ, trước khối tư vấn.

Thiết kế dùng trực tiếp CSS module hạ tầng của `/thue-vps/`:
nền navy, các cung trang trí tĩnh, ảnh/panel xen kẽ, panel cắt góc,
số thứ tự nét viền, viền xanh/glow và mask làm mềm mép ảnh.
Từ 1000px, ảnh và panel giao nhau; dưới 1000px, ảnh ở trên panel;
dưới 640px, số thứ tự và nội dung xếp dọc. CSS riêng của Homepage chỉ
khai báo thang chữ và bố trí icon/CTA theo nội dung hiện có.

Giữ nguyên nhãn, H2, bốn tiêu đề/mô tả và thứ tự trong
`src/data/content.ts`, CTA “Trao đổi yêu cầu kỹ thuật” đến `/lien-he/`,
`id="ha-tang"`, bộ lọc review/approved và điều kiện hiển thị ghi chú.
Không đưa các thông số hoặc nhóm lợi ích riêng của VPS sang Homepage.

Ba ảnh datacenter/CPU/network dùng asset `infrastructure-v4` hiện có
của trang VPS. Đây là ảnh minh họa được tạo trước đó, không phải bằng chứng
về cơ sở hoặc thiết bị thực tế. Ban đầu hàng Bảo vệ & Giám sát dùng ảnh
`/images/viettel-idc.jpg` của Homepage cũ; ảnh này đã được thay trong lần
tinh chỉnh tiếp theo mô tả ở cuối tài liệu.

Section mới dùng hình tĩnh như bản nguồn. Hero vẫn giữ parallax.
`verify-parallax.mjs` tiếp tục kiểm tra chuyển động, reduced motion,
resize và fallback của Hero; xác nhận hạ tầng không còn lớp parallax cũ.
`verify-ui.mjs` được cập nhật để chấp nhận URL `/thue-vps/` đang dùng sẵn
trong tab tư vấn, bên cạnh `/lien-he/` và các URL InterData. Đây là sửa
kỳ vọng kiểm tra đã cũ; không đổi URL trên giao diện.

Kiểm chứng local:

- Build, gồm TypeScript; lint và formatting đạt.
- QA riêng tại 320/390/639/640/768/999/1000/1024/1199/1200/1440/1536/1920px:
  chữ/liên kết đúng trước/sau, ảnh tải đủ, không tràn/cắt chữ,
  đúng bố cục xen kẽ hoặc xếp dọc, màu/mask/viền đúng bản nguồn,
  focus CTA rõ và fallback không JavaScript.
- Axe trong section tại sáu chiều rộng chính không phát hiện vi phạm.
- `test:parallax` đạt ở sáu chiều rộng 320–1920px; `test:ui` đạt tại
  360/390/768/1024/1440px, không có lỗi accessibility hoặc mục tiêu bấm nhỏ.
- Nội dung và liên kết của phần Homepage ngoài `#ha-tang` khớp trước/sau.
- Production preview local cổng 3109 đạt QA tại 390/1000/1440px,
  gồm các kiểm tra trên và fallback không JavaScript.

Ảnh và báo cáo nằm tại `artifacts/home-infrastructure/`, bản production
trong thư mục con `production/`. Trang `/thue-vps/`, VPS AMD, dữ liệu,
asset và các section khác không chỉnh sửa. Chưa triển khai lên tên miền.

## Ảnh Bảo vệ & Giám sát đồng bộ 16/10/2026

Theo yêu cầu tiếp theo, tạo ảnh mới bằng built-in image_gen, mô tả thiết bị
bảo mật mạng và màn hình giám sát trong rack. Phong cách nhiếp ảnh phần cứng,
ánh sáng trắng trung tính/xanh tiết chế và nền navy đồng bộ với ba ảnh còn
lại. Asset WebP 1800×600, 92178 byte tại
`public/images/home/infrastructure/protection-monitoring.webp`;
prompt và nguồn PNG ở `docs/home-protection-image-prompt.json`.

Chỉ đổi ảnh thứ tư và alt, cập nhật nguồn ảnh trong ghi chú biên tập vốn
đang ẩn theo cờ hiện có. Nội dung, CTA, layout, mask, CSS và ba ảnh đầu
giữ nguyên. Đây là ảnh minh họa tạo mới, không xác nhận thiết bị triển khai.

Build (gồm TypeScript), ESLint cho component và formatting đạt.
QA sau thay ảnh tại 320/390/768/1024/1440/1920px xác nhận ảnh mới tải đúng,
không tràn/cắt chữ, mask/viền/bố cục giữ đúng, nội dung và liên kết trước/sau
khớp, focus và fallback không JavaScript đạt; không có lỗi JavaScript hoặc
vi phạm axe trong section. Ảnh/báo cáo lần này ở
`artifacts/home-protection-image/`. Chưa deploy.
