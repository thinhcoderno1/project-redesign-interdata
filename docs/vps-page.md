# Trang Thuê VPS

Route: `/thue-vps/`. Trang sử dụng layout website chung, font Be Vietnam Pro,
color tokens hiện tại và contact widget của project.

## Nguồn nội dung

Văn bản, danh sách, FAQ, ảnh, logo và benchmark được lấy từ working tree của
`D:/InterData/thue-vps`. Manifest tại `docs/vps-source-manifest.json` ghi hash
của các tệp nguồn và 49 ảnh/logo đã sao chép. Ảnh nằm tại `public/images/vps/`;
không sử dụng asset prefix của ứng dụng cũ.

Ngoại lệ đã được yêu cầu: Feedback và Báo chí dùng nội dung homepage qua
`src/components/shared/customer-proof.tsx`, chung với `/vps-amd/`. Hai nhóm
nội dung này không còn lấy từ landing page cũ; kiểm tra đồng nhất giữa ba
route bằng `npm run test:vps-amd`.

Nội dung Windows đang ẩn và nhóm Platinum Viettel đang hiển thị theo hai cờ
visibility trong project nguồn. Benchmark AMD Server và máy chủ ảo Intel giữ
nguyên các ghi chú về phạm vi đo. FAQ hiển thị và FAQPage dùng chung dữ liệu.

Đồng bộ lại nội dung từ nguồn khi có thay đổi đã được duyệt:

```powershell
node scripts/import-vps-content.mjs 'D:\InterData\thue-vps'
```

## Bảng giá

Server gọi `https://support.interdata.vn/packages.php?gid=...` song song và
revalidate mỗi 60 giây, giống project nguồn. Các gid: Hot Deals `100`, AMD `67`,
Platinum `29`, Platinum Viettel `101`, Gold `20`, Linux `3`; tab mặc định là `3`.

Giá thường lấy monthly nếu lớn hơn 0, nếu không lấy quarterly và hiển thị
`/ 3 tháng`. Gói Custom không xuất hiện trong bảng giá thường. Mỗi bảng hiển thị
6 gói trước khi mở rộng. Hot Deals giữ chu kỳ 1/2/3 năm, giá gốc được cung cấp
trong project nguồn và không hiển thị badge phần trăm giảm đang bị ẩn ở nguồn.

URL đăng ký lấy từ `product_url`; Hot Deals thêm đúng `billingcycle` đã chọn.
Client tự thử tải các nhóm thiếu qua `/api/vps-pricing/?gid=...`, đồng thời có
nút thử lại khi lỗi. Không sử dụng giá mẫu để thay thế lỗi API.

## Kiểm tra

```powershell
npm run build
npm run lint
npm run test:vps -- 'D:\InterData\thue-vps'
```

`TEST_BASE_URL` mặc định là `http://localhost:3101`. QA đối chiếu nguồn, hash
ảnh, API trực tiếp, giá/chu kỳ/checkout, tương tác, keyboard, no-JavaScript,
responsive và accessibility. Kết quả nằm tại `artifacts/vps/qa/`.

Kiểm chứng local không thay thế triển khai và kiểm chứng trên tên miền chính thức.
