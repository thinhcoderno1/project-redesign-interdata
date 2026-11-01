# Triển Khai Ảo Hóa Proxmox / Ceph

Route: `/trien-khai-proxmox-ceph/`. Kế thừa design system và bố cục Thuê VPS:
Hero, dải lợi ích, sáu thẻ quanh ảnh 3D, carousel mô hình, sáu ứng dụng,
thẻ phương án, bốn hàng hạ tầng xen kẽ, bảng so sánh, quy trình nền xanh,
năng lực doanh nghiệp, khách hàng, giáo dục/đối tác, FAQ và CTA.

Tái sử dụng CSS Thuê VPS, không thay đổi source hoặc dữ liệu của trang tham chiếu.
Mục Proxmox hiện có trên menu và trang chủ dùng URL mới qua `solutions[].href`;
không thêm mục trùng lặp. Hash `/#proxmox` trên trang chủ vẫn hoạt động.

## Nội dung và phương án

- Proxmox VE độc lập: một host, VM/LXC, local storage, backup và restore.
- Proxmox Cluster HA: cluster/quorum, lưu trữ, tài nguyên dự phòng, thử failover.
- Proxmox + Ceph HCI: compute và storage theo cụm, OSD/pool/failure domain,
  mạng lưu trữ và kiểm thử phục hồi. Thẻ nhấn mạnh theo thiết kế, không khẳng định
  bán chạy hoặc được nhiều khách hàng chọn.

Mỗi phương án có bốn đầu việc và nút **Liên hệ** tới `/lien-he/`.
Chưa có giá chính thức: không đặt giá tiền, phí khởi tạo, giới hạn CPU/RAM,
chu kỳ thanh toán, checkout, cam kết uptime hoặc thời gian triển khai.
Không đưa ghi chú demo, chờ duyệt giá hay thông tin nội bộ lên giao diện.

Nội dung phân biệt cluster quản trị, HA và Ceph; HA có thể cần khởi động lại
workload, không đồng nghĩa không gián đoạn. Nhân bản Ceph không thay backup.
Số node, quorum, mạng, phần cứng và tài nguyên dự phòng phải được đánh giá
theo tải, không xem ba node là bảo đảm về hiệu năng hoặc khả năng chịu lỗi.
Không mặc định Ceph, subscription, phần cứng hoặc quản trị đã bao gồm.

Tài liệu chính thức đối chiếu ngày 21/10/2026:

- [Proxmox VE: nền tảng và công nghệ ảo hóa](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview).
- [Yêu cầu phần cứng](https://www.proxmox.com/en/products/proxmox-virtual-environment/requirements).
- [Hướng dẫn HCI Ceph của Proxmox](https://github.com/proxmox/pve-docs/blob/master/pveceph.adoc).
- [HA Manager](https://github.com/proxmox/pve-docs/blob/master/ha-manager.adoc).
- [Backup và Restore](https://github.com/proxmox/pve-docs/blob/master/vzdump.adoc).

Đây là nguồn kiểm chứng khái niệm, không phải bằng chứng InterData cung cấp
mọi khả năng của nền tảng hoặc có quan hệ đối tác với hãng.

## Tài nguyên và metadata

Hero dùng ảnh `public/images/proxmox-ceph/hero-proxmox-ceph-v2.webp`
(1920×800), tạo bằng imagegen tích hợp: cụm ảo hóa với máy ảo và lưu trữ
phân tán trên từng node. Cụm nằm bên phải, khoảng trống bên trái dành cho
tiêu đề và CTA. Open Graph dùng cùng ảnh mới, đúng kích thước và mô tả.

Section “Đa dạng lựa chọn” dùng ba ảnh riêng cho Proxmox độc lập, Cluster HA
và Proxmox + Ceph HCI, dùng bộ `architecture-*-dark-v2.webp` với nền navy tối
`#06142d` để tách rõ thẻ khỏi section xanh. Lớp phủ và nền thẻ dùng cùng navy;
ảnh được căn trên để tránh cắt khối máy ảo. Bộ prompt carousel hiện tại nằm tại
`docs/proxmox-ceph-carousel-dark-prompts.md` (ba ảnh, tổng khoảng 250 KiB).
Bốn hàng “Nền tảng cho cụm ảo hóa của bạn” dùng ảnh
riêng cho compute, lưu trữ Ceph, mạng cụm và phục hồi. Bộ tám ảnh nền dùng
color system của project: xanh `#0043ec`, nền `#031677`, thẻ `#102681`,
xanh nhạt `#cbd5f7` và trắng. Tất cả được tối ưu WebP và lưu tại
`public/images/proxmox-ceph/`. Prompt đầy đủ tại
`docs/proxmox-ceph-background-prompts.md`. CSS riêng điều chỉnh lớp phủ,
cách căn Hero, khung ảnh thành phần và giữ trọn mô hình carousel trên mobile.

Hai section có pattern SVG/CSS riêng: “Đa dạng lựa chọn” dùng sóng chấm theo
ảnh tham chiếu, các hàng chấm uốn cong và lớn dần về phía gần để tạo chiều sâu.
Gradient xanh lam–cyan được đặt ở hai bên và phía dưới, mờ dần quanh tiêu đề.
“Nền tảng cho
cụm ảo hóa của bạn” dùng các đường mạch điện song song, góc gấp 45° và chân
tiếp xúc tối giản quanh các hàng nội dung. Tài nguyên hiện tại là
`pattern-dotted-wave-v1.svg` và `pattern-circuit-traces-v1.svg` trong cùng
thư mục ảnh Proxmox / Ceph. Sóng dùng `--brand-primary`, cyan `#35c3ff` hiện có
ở Hero và `--text-on-dark-secondary`; CSS opacity 32%/24% ở hai góc desktop,
22%/18% trên mobile, kết hợp độ mờ theo chiều sâu trong SVG. Đường mạch dùng
`--text-on-dark-secondary`, độ đậm 6%/4,5%. Pattern tĩnh, không bắt sự kiện trỏ,
không thêm nội dung vào cây accessibility và chỉ áp dụng cho trang Proxmox / Ceph.

Các section khác dùng ảnh minh họa hiện có. Ảnh trung tâm lợi ích:
`public/images/proxmox-ceph/advantages-cluster-v1.webp`, 1000×1000, alpha,
khoảng 110 KiB, tạo bằng imagegen tích hợp. Prompt tại
`docs/proxmox-ceph-image-prompt.md`. Không ghi chữ VPS hoặc số liệu trên ảnh.

Canonical, Open Graph và Service JSON-LD dùng route mới. FAQPage khớp mười FAQ;
năm mục sau mở bằng “Xem tất cả”. Giữ robots noindex/nofollow của project.
Không tạo Offer/Product schema hoặc API giá.

## Kiểm tra local

```powershell
npm run test:proxmox-ceph
npm run lint
npm run typecheck
npm run build
```

Script kiểm tra phương án không có giá, CTA, metadata/schema, anchor, menu,
liên kết trang chủ, carousel bàn phím/vuốt, FAQ, no-JS, hình tải thành công,
overflow và WCAG A/AA ở 320, 390, 768, 900, 1024, 1440, 1920px.
Bằng chứng local tại `artifacts/proxmox-ceph/`. Không gửi form liên hệ.
Chưa deploy hoặc kiểm chứng trên website công khai.

Cập nhật ảnh ngày 31/10/2026: bộ tám ảnh được tạo bằng imagegen tích hợp và
tối ưu WebP. Ba ảnh carousel được thay tiếp bằng bản navy tối v2, đồng bộ nền
thẻ và lớp phủ navy để tạo độ tương phản với section. Bộ kiểm tra Proxmox / Ceph đạt
ở bảy viewport, ảnh tải đủ, không tràn ngang, không lỗi runtime và không phát hiện
vi phạm axe WCAG A/AA. Carousel bàn phím/vuốt, FAQ và no-JS đều đạt. Lint,
TypeScript, Prettier và build production đạt. Đối chiếu production local ở
390/1440px đạt HTTP 200, ảnh, Open Graph, carousel và không lỗi runtime.
Sau thay pattern, bộ kiểm tra bảy viewport và kiểm tra production local vẫn đạt;
hai SVG tải đúng MIME, CSS mask áp dụng đúng cho từng section. Đối chiếu trang
Private Network xác nhận pattern sóng và vòng nền hiện có vẫn được giữ nguyên.
Dev preview: http://localhost:3000/trien-khai-proxmox-ceph/.
