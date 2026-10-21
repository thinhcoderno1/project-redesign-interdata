# Triển Khai Kubernetes (K8s)

Route: `/trien-khai-Kubernetes-k8s/`, giữ cách viết URL theo yêu cầu.
H1 in hoa: **TRIỂN KHAI KUBERNETES (K8S)**.

Trang kế thừa bố cục và design system Thuê VPS: Hero, dải lợi ích, sáu thẻ quanh
ảnh 3D, carousel mô hình, sáu ứng dụng, ba thẻ phương án, bốn hàng hạ tầng xen kẽ,
bảng so sánh, quy trình nền xanh, năng lực doanh nghiệp, khách hàng,
giáo dục/đối tác, FAQ và CTA. Dùng CSS Thuê VPS hiện có, không thay source
hoặc dữ liệu các trang cũ. Component và dữ liệu Kubernetes được tách riêng.

Mục `kubernetes` hiện có trong `solutions` được thêm href tới route mới;
menu desktop/mobile và CTA trang chủ kế thừa liên kết này. Không thêm mục trùng.
Hash `/#kubernetes` trên trang chủ vẫn dùng cho carousel giải pháp.

## Ba phương án theo nhu cầu

- K8s Dev / Staging: chuẩn bị ứng dụng, manifest, namespace, RBAC và môi trường thử nghiệm.
- Production Cluster: thiết kế control plane/worker, CNI, truy cập, storage và backup.
- Production HA: thêm topology dự phòng, quorum etcd, API endpoint, phân bố workload
  và thử phục hồi. Thẻ được nhấn mạnh theo thiết kế, không gắn nhãn bán chạy.

Mỗi phương án có bốn đầu việc và nút **Liên hệ** tới `/lien-he/`.
Không đặt giá, phí khởi tạo, chu kỳ, checkout hoặc giới hạn tài nguyên khi chưa có
thông tin chính thức. Không hiển thị ghi chú demo hoặc chờ duyệt giá trên UI.
Không tự cam kết uptime, thời gian triển khai hoặc dịch vụ quản trị trọn gói.

Nội dung phân biệt HA của control plane với tính sẵn sàng của ứng dụng;
HPA với mở rộng node; namespace với cách ly đầy đủ; PersistentVolume với backup.
NetworkPolicy được nêu kèm điều kiện plugin hỗ trợ. Topology HA, storage,
observability và trách nhiệm vận hành phải được thống nhất theo hệ thống thực tế.

Đối chiếu tài liệu Kubernetes chính thức ngày 21/10/2026:

- [Môi trường production](https://kubernetes.io/docs/setup/production-environment/).
- [Thành phần cluster](https://kubernetes.io/docs/concepts/overview/components/).
- [Topology HA với kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/).
- [NetworkPolicy và điều kiện thực thi](https://kubernetes.io/docs/concepts/services-networking/network-policies/).
- [PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/).
- [Horizontal Pod Autoscaler](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).

Tài liệu dùng để kiểm chứng khái niệm, không thay cho cam kết dịch vụ của InterData.

## Tài nguyên và metadata

Tạo bằng imagegen tích hợp, tối ưu WebP; prompt tại `docs/kubernetes-image-prompts.md`:

- `public/images/kubernetes/hero-kubernetes-v1.webp`: 2160×720, khoảng 125 KiB;
  ảnh datacenter, cụm máy chủ bên phải, khoảng tối bên trái dành cho nội dung.
- `public/images/kubernetes/advantages-containers-v1.webp`: 1000×1000, alpha,
  khoảng 85 KiB; 3D minimal các node và container cùng tông trắng/xanh Thuê VPS.

Các ảnh còn lại tái sử dụng tài nguyên minh họa phù hợp hiện có, không được trình bày
như ảnh dự án đã triển khai hoặc bằng chứng cấu hình cấp cho khách hàng.

Canonical, Open Graph và Service JSON-LD dùng URL mới đúng chữ hoa.
FAQPage schema khớp mười FAQ; năm câu sau mở bằng “Xem tất cả”.
Giữ robots noindex/nofollow của project. Không có API giá hoặc Offer/Product schema.

## Kiểm tra local

```powershell
npm run test:kubernetes
npm run lint
npm run typecheck
npm run build
```

Script kiểm tra route, metadata/schema, ba phương án không giá, CTA, các anchor,
menu, liên kết trang chủ, carousel bàn phím/vuốt, FAQ, no-JS, ảnh tải thành công,
overflow và WCAG A/AA tại 320, 390, 768, 900, 1024, 1440, 1920px.
Bằng chứng tại `artifacts/kubernetes/`. Không gửi form liên hệ.
Chưa deploy hoặc kiểm chứng trên production.
