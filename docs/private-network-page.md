# Triển Khai Private Network

Trang `/trien-khai-private-network/` kế thừa thiết kế Thuê VPS: Hero, dải lợi ích,
sáu thẻ quanh hình trung tâm, carousel mô hình, sáu ứng dụng, thẻ phương án,
bốn hàng thành phần xen kẽ, bảng so sánh, quy trình nền xanh, năng lực doanh nghiệp,
khách hàng, giáo dục/đối tác, FAQ và CTA. Tái sử dụng CSS hiện có, không sửa source
hoặc dữ liệu Thuê VPS.

## Phương án và nội dung

Ba phương án phục vụ các nhu cầu phổ biến:

- Mạng nội bộ ứng dụng: giao tiếp giữa app, database và dịch vụ nền.
- Phân vùng hệ thống: tách vùng hoặc môi trường, lập ma trận truy cập; thẻ được
  nhấn mạnh theo thiết kế, không gắn nhãn bán chạy hay số khách hàng sử dụng.
- Kết nối đa điểm: khảo sát hai đầu, định tuyến và phương án VPN/IPsec khi phù hợp.

Chưa có bảng giá chính thức. Các phương án dùng để trình bày hướng giải quyết
và phạm vi có thể trao đổi; không đặt giới hạn số máy chủ, subnet, tốc độ, SLA,
thời gian triển khai hay ưu đãi chưa được xác nhận. Không tạo giá tiền, phí khởi
tạo, chu kỳ, checkout hoặc Offer/Product schema. Các nút **Liên hệ** dẫn đến
`/lien-he/`. Không đưa ghi chú demo, chờ phê duyệt hoặc thông tin nội bộ lên UI.

Nội dung giải thích subnet, IP plan, firewall/ACL, routing, kiểm thử và bàn giao.
Phân biệt phân tách mạng với mã hóa; không mặc định Private Network có mã hóa
đầu cuối, HA, Anti DDoS, kết nối liên datacenter hoặc khả năng áp dụng cho mọi
gói VPS. Cần đối chiếu nền tảng, vị trí và phạm vi trước khi triển khai.

Đối chiếu khái niệm kỹ thuật ngày 21/10/2026:

- [RFC 1918: địa chỉ IPv4 private](https://www.rfc-editor.org/info/rfc1918/).
- [RFC 4301: kiến trúc IPsec](https://www.rfc-editor.org/rfc/rfc4301.html).
- [AWS VPC: subnet, routing, gateway và kết nối](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html).
- [Azure Virtual Network: tình huống phân vùng và kết nối](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview).

Tài liệu hãng được dùng để kiểm chứng khái niệm và nhóm nhu cầu, không làm căn cứ
khẳng định InterData có cùng tính năng, giới hạn hoặc mức giá với các hãng đó.

## Tích hợp và tài nguyên

Thêm `href` cho entry `private-network` hiện có trong `src/data/content.ts`.
Menu desktop/mobile và CTA của thẻ Private Network trên trang chủ dẫn về trang
mới. Các giải pháp khác giữ liên kết và hành vi hiện tại. Hash `/#private-network`
trên trang chủ vẫn tồn tại cho carousel, không thêm mục giải pháp trùng lặp.

Hero dùng ảnh thiết bị mạng `home/infrastructure/protection-monitoring.webp`.
Hình trung tâm lợi ích dùng ảnh 3D minimal nền trong suốt
`public/images/private-network/advantages-network-v1.webp` (1000×1000, khoảng
103 KiB), cùng phong cách ảnh Thuê VPS. Ba máy chủ kết nối qua switch trung tâm
và biểu tượng kiểm soát truy cập; không có chữ VPS. Giữ CSS vòng trang trí và
sáu thẻ nội dung của section. Ảnh được tạo bằng công cụ imagegen tích hợp;
prompt lưu tại `docs/private-network-image-prompt.md`.
Ảnh các phần còn lại tái sử dụng tài nguyên phù hợp hiện có; đều là minh họa,
không được trình bày như bằng chứng về dự án hoặc thiết bị cấp cho khách hàng.

Canonical, Open Graph và Service JSON-LD dùng URL mới. FAQPage schema khớp mười
FAQ hiển thị; năm mục sau mở bằng “Xem tất cả”. Giữ noindex/nofollow của project.
Không có API giá hoặc yêu cầu mạng ngoài để tải phương án.

## Kiểm tra

```powershell
npm run test:private-network
npm run lint
npm run typecheck
npm run build
```

Dev preview: http://localhost:3100/trien-khai-private-network/
Biến `TEST_BASE_URL` hỗ trợ server QA khác. Bằng chứng lưu trong
`artifacts/private-network/` (Git ignored). Kiểm tra phương án/CTA không có giá,
metadata/schema, carousel/bàn phím/swipe, FAQ, anchor, menu/trang chủ, responsive,
ảnh, accessibility, không JavaScript và bảo toàn các công việc trước đó.
Chưa deploy lên website công khai hoặc gửi yêu cầu liên hệ.

Kết quả local ngày 21/10/2026: bộ kiểm tra Private Network, lint toàn project,
TypeScript, Prettier và build production đạt (39 route). Bảy viewport
320/390/768/900/1024/1440/1920px không tràn ngang, ảnh tải đủ và không phát hiện
vi phạm axe WCAG A/AA. Carousel đạt kiểm tra bàn phím, mũi tên và vuốt cảm ứng;
FAQ, bảng so sánh cuộn ngang và liên kết nội bộ hoạt động. Ba phương án không có
giá, Offer schema hoặc ghi chú nội bộ. Không JavaScript vẫn đọc được ba mô hình,
ba phương án và toàn bộ FAQ. Production local ở 390/1440px đạt HTTP 200, metadata,
CTA, carousel và liên kết trang chủ, không có lỗi runtime. Server production tạm
đã dừng; dev preview cổng 3100 được giữ lại. Snapshot xác nhận các trang và dữ liệu
có sẵn được giữ nguyên ngoài thay đổi tích hợp Private Network đã nêu.
