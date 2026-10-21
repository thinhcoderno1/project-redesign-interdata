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

Hero dùng ảnh mới `public/images/proxmox-ceph/hero-proxmox-ceph-v1.webp`
(2160×720), tạo bằng imagegen tích hợp theo phong cách ảnh datacenter thực tế.
Cụm máy chủ nằm bên phải, khoảng tối bên trái dành cho tiêu đề và CTA.
Prompt tại `docs/proxmox-ceph-hero-prompt.md`. Giữ CSS Hero và nội dung hiện có;
Open Graph dùng cùng ảnh mới. Các section còn lại
dùng ảnh minh họa phù hợp hiện có. Ảnh trung tâm mới:
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
Chưa deploy hoặc kiểm chứng trên production.
