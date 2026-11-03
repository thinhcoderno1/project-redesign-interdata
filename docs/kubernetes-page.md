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

Bộ tám ảnh nền được tạo mới bằng imagegen tích hợp ngày 31/10/2026, tối ưu
WebP và lưu trong `public/images/kubernetes/`. Prompt và đường dẫn từng ảnh
được ghi tại `docs/kubernetes-background-prompts.md`:

- Hero `hero-kubernetes-v3.webp`: 1920×800, minh họa tầng control plane và các
  worker chạy Pod; khoảng trống bên trái dành cho nội dung. Open Graph dùng
  cùng ảnh với kích thước và alt được cập nhật. Hero dùng nền navy tối,
  phần cứng graphite và kết nối cyan theo ảnh Proxmox/Ceph đã chọn;
  prompt hiện tại tại `docs/solution-hero-navy-series-prompts.md`.
- Ba ảnh `architecture-*.webp`: Dev/Staging, Production và Production HA có
  topology riêng; nền navy `#06142d` để tách thẻ khỏi section xanh.
- Bốn ảnh `component-*.webp`: control plane/worker, kết nối dịch vụ, storage
  và bảo mật/vận hành. Nền xanh `#031677` đồng bộ với section thành phần.

Phần cứng trắng/bạc, panel cobalt `#0043ec`, xanh nhạt `#cbd5f7` và điểm nhấn
cyan theo bảng màu project. CSS riêng căn Hero, lớp phủ carousel, khung ảnh
thành phần và giữ trọn các node trong carousel trên mobile.

Ảnh trung tâm lợi ích giữ `advantages-containers-v1.webp`: 1000×1000, alpha,
khoảng 85 KiB, prompt tại `docs/kubernetes-image-prompts.md`. Các phần còn lại
tái sử dụng tài nguyên hiện có. Tất cả là minh họa, không được trình bày như
ảnh dự án thực tế hoặc bằng chứng cấu hình, khả năng HA cấp cho khách hàng.

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
Chưa deploy hoặc kiểm chứng trên website công khai.

Cập nhật ảnh ngày 31/10/2026: bộ kiểm tra Kubernetes đạt ở cả bảy viewport,
ảnh tải đủ, không tràn ngang, carousel bàn phím/vuốt và no-JS hoạt động,
không lỗi runtime và không phát hiện vi phạm axe WCAG A/AA. Đã thu gọn nhãn
phương án HA trên mobile để vừa thẻ ở 320px. Lint, TypeScript, Prettier và
build production đạt. Dev preview:
http://localhost:3000/trien-khai-Kubernetes-k8s/.
