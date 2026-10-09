# Dải slide giải pháp triển khai

- Cả 5 giải pháp nằm trong cùng một hàng trượt; giữ nguyên thứ tự, tiêu đề, mô tả, đường dẫn liên hệ và ID anchor.
- Một card ảnh nền rõ ở giữa; hai card liền kề được thu nhỏ, giảm độ rõ và hiển thị một phần ở hai bên. Chữ và CTA nằm trên lớp phủ tối; màu CTA theo InterData.
- Menu 5 tab nằm phía trên, đồng bộ với card đang chọn. Desktop hiển thị trên một hàng; mobile sắp xếp thành các ô để nhìn thấy đủ 5 giải pháp.
- Chuyển vòng bằng nút trước/sau, tab, bàn phím (mũi tên/Home/End), kéo chuột hoặc vuốt cảm ứng. Không tự chạy. Hai bản xem trước ở đầu/cuối không có ID trùng, không có link và không nhận focus.
- Chỉ panel đang chọn nhận focus và được đọc bởi trình đọc màn hình. Tab hỗ trợ phím trái/phải/Home/End, Enter và Space.
- Link menu/footer đến từng giải pháp mở đúng thẻ. Khi chưa có JavaScript, 5 thẻ vẫn truy cập được bằng cuộn ngang và link tab; các nút điều khiển và bản xem trước được ẩn.

## Ảnh nền minh họa

Sử dụng 5 ảnh 1050 × 525px do người dùng bổ sung trong `public/images/solutions`. Các ảnh được dùng làm nền minh họa; giữ nguyên nội dung và cấu trúc slide.

| Giải pháp | Asset | Vị trí ảnh |
| --- | --- | --- |
| Private Network | `/images/solutions/giai-phap-private-cloud.jpg` | 50% 50% |
| Proxmox / CEPH | `/images/solutions/giai-phap-proxmox-ceph.jpg` | 50% 50% |
| Kubernetes | `/images/solutions/giai-phap-kubernetes.jpg` | 50% 50% |
| VMware | `/images/solutions/giai-phap-vmware.jpg` | 70% 50%, ưu tiên cụm máy ảo bên phải trên mobile |
| S3 Storage | `/images/solutions/giai-phap-s3-storage.jpg` | 55% 50% |

## Kiểm tra cục bộ

- Build, lint và TypeScript đạt.
- Kiểm tra 320, 390, 639, 640, 768, 1023, 1024, 1200, 1440 và 1920px: đủ 5 thẻ, card chính luôn giữa viewport, hai bản xem trước ở hai bên, không tràn trang, chuyển slide bằng tab/nút/bàn phím/kéo chuột, giữ thẻ đang chọn khi đổi kích thước.
- Vuốt cảm ứng, 5 anchor truy cập trực tiếp, link menu/footer và fallback khi tắt JavaScript hoạt động.
- So sánh snapshot trước/sau: nội dung/URL giải pháp và các section khác được giữ nguyên.
- `test:ui` đạt tại 360, 390, 768, 1024 và 1440px, không có lỗi accessibility hoặc target nhỏ trong kết quả kiểm tra.
- Kiểm tra nền ảnh thực tế của cả 5 thẻ tại 320, 390 và 1440px. Ảnh render và kết quả bố cục/tương phản nằm trong `artifacts/solutions-centered/`.

Các kết quả trên là kiểm tra bản chạy cục bộ, không xác nhận triển khai công khai.

Sau khi thay 5 ảnh mới: build và lint đạt; kiểm tra ảnh render trên cả 5 slide tại 320, 390 và 1440px. Ảnh tải thành công khi chuyển tab; độ tương phản chữ trên ảnh thấp nhất khoảng 6.60:1. Tab Chrome đang mở tại `localhost:3100` đã hiển thị ảnh mới và giữ bố cục card giữa cùng hai bản xem trước.

## Sửa lỗi CSS trên tab đang mở

Tab Chrome tại `localhost:3100` đang giữ một bộ export CSS Modules cũ sau hot reload: stylesheet mới đã tải nhưng các class của menu, tabs và panel trong DOM bị thiếu. Vì vậy bản mở lâu hiển thị nhiều card nhỏ và tab mất định dạng dù một tab tải mới hiển thị đúng.

Component đã chuyển sang import `solutions-slider.module.css` để tải bộ export mới. Xác minh trực tiếp trên tab bị lỗi sau cập nhật: menu dùng flex, card chính rộng khoảng 920px, nằm giữa viewport và hai panel lân cận có opacity 0.4. Nội dung, ảnh, thứ tự và URL được giữ nguyên.
