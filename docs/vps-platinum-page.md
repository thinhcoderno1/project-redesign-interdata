# Trang VPS PLATINUM

Triển khai ngày 16/10/2026 tại `/vps-platinum/`, thay thế URL `/platinum/` bằng chuyển hướng vĩnh viễn HTTP 308, giữ query string. Chưa triển khai lên production.

## Thiết kế và phạm vi

- Clone phiên bản hiện tại của `src/components/vps-amd/amd-page.tsx` và `amd.module.css`: hero, dải thông số, bảng giá, nền tảng CPU, sáu ứng dụng quanh hình máy chủ, bảng VPS/Shared Hosting, hạ tầng và quy trình, thông tin công ty, FAQ, CTA cuối.
- Component và CSS riêng tại `src/components/vps-platinum/`, không sửa trang AMD hoặc các thay đổi đang có của người dùng.
- Dùng layout, header/footer và `CompanyProofSections` chung. Nội dung, logo khách hàng và ảnh báo chí có nguồn được giữ nguyên trong component chung.
- Bảng giá giữ cách trình bày của AMD, bổ sung bộ chọn FPT/Viettel/Hot Deals để bảo toàn các nhóm sản phẩm của PLATINUM cũ. Viettel là lựa chọn mặc định như trang cũ.
- Danh mục dịch vụ, navigation dùng danh mục và link PLATINUM trong trang thuê VPS trỏ về URL mới.

## Nguồn nội dung và hợp đồng dữ liệu

Đối chiếu trang chính thức `https://interdata.vn/platinum/`, source cũ `D:/InterData/platinum/app/page.tsx` và các component `pricing-table.tsx`, `faq.tsx`, `features.tsx`, `infrastructure.tsx`.

Nguồn giá trực tiếp:

| Nhóm | API | Sản phẩm trong API khi kiểm tra | Sản phẩm hiển thị |
| --- | --- | --- | --- |
| FPT | `https://support.interdata.vn/packages.php?gid=29&module` | 16 | 8 gói HCM |
| Viettel HCM | `https://support.interdata.vn/packages.php?gid=101&module` | 8 | 8 |
| Hot Deals | `https://support.interdata.vn/packages.php?gid=100&module` | 3 | 3 |

- Giữ nguyên pid, tên, mô tả cấu hình, thứ tự, `product_url`, tổng giá từng chu kỳ. FPT tiếp tục ẩn tên chứa HN/custom theo quy tắc trang cũ.
- Sáu chu kỳ chuẩn; chỉ hiển thị chu kỳ có giá hợp lệ. Hot Deals hiện có 12/24/36 tháng. Giá âm `-1` biểu thị kỳ không cung cấp, không biến thành giá bán. Không quy đổi giá năm thành giá tháng và không thêm giá gạch ngang.
- API mới `/api/vps-platinum-pricing/?gid=29|101|100`, mặc định 101; gid khác trả 400. Kiểm tra gid, kiểu dữ liệu, giá không âm và checkout HTTPS tại `support.interdata.vn`; timeout 15 giây, revalidate 60 giây. Từng nhóm lỗi độc lập và có nút thử lại.
- Link đặt hàng luôn giữ `product_url` từ API và thêm `billingcycle` được chọn. Giữ thông số mạng ở từng gói, không áp một tốc độ chung cho mọi nhóm.
- Nội dung nền tảng dùng Intel Xeon Platinum, KVM, NVMe, IPv4, root; không chuyển thông số 64 nhân/128 luồng của AMD sang trang mới và không tự chọn model CPU Intel.
- Nội dung giá nhắc kiểm tra tổng tiền, thuế, tùy chọn và giá gia hạn ở trang đăng ký. Backup, nâng cấp và điều kiện hỗ trợ có hướng dẫn xác nhận theo gói.
- SEO title, description, Open Graph, canonical và Service JSON-LD dùng URL mới. Giữ noindex/nofollow hiện có của toàn project.

## Hình ảnh mới

11 ảnh minh họa mới được tạo bằng built-in `image_gen`, tối ưu WebP, tổng khoảng 828 KiB, lưu tại `public/images/vps-platinum/`:

- `hero.webp`, `platform.webp`, `center.webp`, `infrastructure.webp`, `cta.webp`.
- `website.webp`, `development.webp`, `media.webp`, `database.webp`, `agent.webp`, `backup.webp`.

Prompt đầy đủ, file nguồn và file đích: [vps-platinum-image-prompts.json](./vps-platinum-image-prompts.json). Ảnh hạ tầng là minh họa tạo bằng AI, không phải ảnh xác thực cơ sở của FPT/Viettel hay một model CPU cụ thể. Không lấy lại hình dịch vụ AMD.

## Kiểm tra

```powershell
npm run typecheck
npm run lint
npm run build
npm run test:vps-platinum
```

`TEST_BASE_URL` chọn server kiểm tra (mặc định `http://localhost:3100`). `PLATINUM_QA_DEV_BASE_URL` chỉ server dev để tạo fixture tạm kiểm tra lỗi mạng/thử lại; fixture tự xóa sau kiểm tra, không thuộc bản build.

Bộ kiểm tra đối chiếu API thật, cấu hình, thứ tự, mọi giá/checkout của ba nhóm và các kỳ hiện có; chuyển nhóm, mở rộng/thu gọn, điều hướng bàn phím, FAQ, CTA, thông tin công ty giống AMD, chuyển hướng URL cũ giữ query, lỗi API và phục hồi, không JavaScript. Kiểm tra 320/390/768/1024/1440/1920px gồm tràn ngang, kích thước hai nút hero, ảnh tải thành công và axe WCAG A/AA. Kết quả cùng ảnh chụp lưu trong `artifacts/vps-platinum/` (không commit).

Đây là xác thực local. Không kiểm tra mua hàng/thanh toán thực tế hoặc triển khai lên domain công khai.

Kết quả 16/10/2026: build, lint, typecheck và `test:vps-platinum` đều đạt. Sáu viewport đạt kiểm tra hình ảnh, tràn ngang, nút hero và axe; 19 gói hiển thị được đối chiếu mọi chu kỳ hiện có. Production preview tại `http://127.0.0.1:3110/vps-platinum/` đạt kiểm tra HTTP 200, redirect 308 giữ query, chuyển nhóm, checkout đúng kỳ, 320px không tràn ngang và không có page error. Dev preview tại `http://localhost:3100/vps-platinum/`.

### Hero có chip Intel Xeon Platinum

Theo yêu cầu tinh chỉnh tiếp theo, Hero desktop và mobile dùng `public/images/vps-platinum/hero-xeon-platinum-v2.webp` (161.552 byte), chỉnh bằng built-in `image_gen` từ ảnh hero ban đầu. Chip ở bên phải, mặt kim loại có chữ Intel Xeon Platinum; giữ nền datacenter và khoảng tối bên trái. Prompt, ảnh tham chiếu và file nguồn lưu tại [vps-platinum-hero-chip-prompt.json](./vps-platinum-hero-chip-prompt.json). Giữ ảnh `hero.webp` ban đầu và metadata hiện có.

Chỉ thay hai tham chiếu ảnh Hero trong component; đối chiếu snapshot xác nhận CSS, nội dung, CTA, metadata và các section còn lại không đổi. Build và ESLint component đạt. Browser QA tại 320/390/768/1024/1440/1920px đạt kiểm tra ảnh, không tràn ngang, kích thước hai nút bằng nhau và axe WCAG A/AA trong Hero; CTA cuộn tới bảng giá, parallax và reduced motion hoạt động. Đã xem ảnh chụp để kiểm tra chip và tên dòng CPU sau khi crop. Bằng chứng tại `artifacts/vps-platinum/hero-chip/`.

### Icon trước nội dung badge

Các badge trên heading dùng icon Lucide 16px, cách text 7px và có `aria-hidden="true"`. Áp dụng cho badge của trang và các phần khách hàng, báo chí, giáo dục; nhãn mở đầu trong panel triển khai cũng có icon. Badge Hero đang ẩn tiếp tục ẩn. Các component chung nhận tùy chọn `withBadgeIcons` mặc định false, chỉ bật tại VPS PLATINUM; CSS căn icon được giới hạn trong trang này.

Build, typecheck, ESLint và QA 320/390/768/1024/1440/1920px đạt; 11 badge/nhãn đang hiển thị đều có icon đứng trước, không tràn ngang, axe WCAG A/AA không phát hiện lỗi. Đối chiếu DOM trước/sau xác nhận text và link PLATINUM không đổi, phần dùng chung tại homepage và VPS AMD giữ nguyên text, link và trạng thái icon. Bằng chứng: `artifacts/vps-platinum/badge-icons/`.
