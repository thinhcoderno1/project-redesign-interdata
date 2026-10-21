# Triển Khai VMware

Route: `/trien-khai-vmware/`. H1 in hoa: **TRIỂN KHAI VMWARE**.

Trang kế thừa bố cục và design system Thuê VPS: Hero, dải lợi ích, sáu thẻ quanh
ảnh 3D, carousel mô hình, sáu ứng dụng, ba thẻ phương án, bốn hàng hạ tầng xen kẽ,
bảng so sánh, quy trình nền xanh, năng lực doanh nghiệp, khách hàng,
giáo dục/đối tác, FAQ và CTA. Dùng CSS Thuê VPS hiện có; component, dữ liệu và
tài nguyên VMware tách riêng, không sửa source hay dữ liệu các trang cũ.

Mục `vmware` hiện có trong `solutions` được thêm href tới route mới và chuẩn hóa
cách viết VMware. Menu desktop/mobile, CTA trang chủ kế thừa liên kết;
không tạo mục trùng. Hash `/#vmware` trên trang chủ vẫn hoạt động.

## Ba phương án theo nhu cầu

- vSphere cơ bản: khởi đầu ảo hóa, host, mạng/datastore, máy ảo và backup.
- Cluster HA / vMotion: quản trị cụm, dự phòng tài nguyên, tương thích CPU,
  mạng và lưu trữ để thử failover, migration và bảo trì.
- HCI với vSAN: đối chiếu phần cứng, mạng, storage policy, miền lỗi,
  dung lượng thực dùng và khả năng phục hồi. Thẻ nhấn mạnh theo thiết kế,
  không gắn nhãn bán chạy hoặc số lượng khách hàng chưa được kiểm chứng.

Mỗi phương án có bốn đầu việc và nút **Liên hệ** tới `/lien-he/`.
Không đặt giá, phí khởi tạo, chu kỳ, checkout hoặc giới hạn tài nguyên khi chưa có
thông tin chính thức. Không hiển thị ghi chú demo, chờ duyệt hoặc thông tin nội bộ.
Không tự cam kết uptime, thời gian triển khai hoặc quản trị trọn gói.

Nội dung phân biệt vSphere, vCenter và vSAN; HA khởi động lại máy ảo khác với
vMotion dùng khi đáp ứng điều kiện di chuyển. HA, tính chịu lỗi của storage và
snapshot không thay thế backup. Phải kiểm tra topology, tương thích phần cứng,
firmware/driver, phiên bản và quyền sử dụng trước triển khai.

Không gán cố định tên edition, giá, metric cấp phép, mức dung lượng kèm theo,
thời hạn hỗ trợ hoặc khẳng định bản quyền đã bao gồm. Không tự nhận InterData
là đối tác được chứng nhận của VMware/Broadcom. Không dùng logo hãng tự tạo.

Nguồn chính thức đối chiếu ngày 21/10/2026:

- [HA failover và khởi động lại máy ảo](https://knowledge.broadcom.com/external/article/316525).
- [EVC và tương thích CPU](https://knowledge.broadcom.com/external/article/313545/vmware-evc-and-cpu-compatibility-faq.html).
- [Kiểm tra tương thích phần cứng vSAN](https://blogs.vmware.com/cloud-foundation/2024/11/20/verifying-compatibility-for-vmware-cloud-foundation-environments-powered-by-vsan/).
- [Broadcom Compatibility Guide](https://compatibilityguide.broadcom.com/).
- [So sánh dòng sản phẩm vSphere](https://www.vmware.com/docs/vmw-datasheet-vsphere-product-line-comparison).
- [Snapshot không thay thế backup](https://knowledge.broadcom.com/external/article/318825/best-practices-for-using-vmware-snapshots.html).

Tài liệu dùng kiểm chứng khái niệm và điều kiện áp dụng, không thay cho
phương án thương mại hoặc cam kết dịch vụ cụ thể của InterData.

## Tài nguyên và metadata

Ảnh tạo mới bằng imagegen tích hợp, tối ưu WebP;
prompt tại `docs/vmware-image-prompts.md`:

- `public/images/vmware/hero-vmware-v1.webp`: 2160×720, khoảng 115 KiB;
  datacenter với cụm máy chủ bên phải, nền tối bên trái cho nội dung.
- `public/images/vmware/advantages-virtualization-v1.webp`: 1000×1000, alpha,
  khoảng 95 KiB; cụm host và máy ảo 3D minimal trắng/xanh.

Các ảnh còn lại dùng tài nguyên minh họa hiện có, không được trình bày
như ảnh dự án đã triển khai hoặc bằng chứng cấu hình cấp cho khách hàng.

Canonical, Open Graph và Service JSON-LD dùng URL mới. FAQPage schema khớp
mười FAQ; năm câu sau mở bằng “Xem tất cả”. Giữ robots noindex/nofollow
của project. Không có API giá hoặc Offer/Product schema.

## Kiểm tra local

```powershell
npm run test:vmware
npm run lint
npm run typecheck
npm run build
```

Script kiểm tra route, metadata/schema, ba phương án không giá, CTA, anchor,
menu, liên kết trang chủ, carousel bàn phím/vuốt, FAQ, no-JS, hình tải thành công,
overflow và WCAG A/AA tại 320, 390, 768, 900, 1024, 1440, 1920px.
Bằng chứng tại `artifacts/vmware/`. Không gửi form liên hệ.
Chưa deploy hoặc kiểm chứng trên production.
