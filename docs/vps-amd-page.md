# Trang dịch vụ VPS AMD

Route `/vps-amd/`, thuộc route group `(website)`, dùng Navigation, Footer,
font Be Vietnam Pro, contact widget và design tokens của project hiện tại.

## Tham chiếu thiết kế

Mẫu người dùng: `C:/Users/interdigi 03/Downloads/KLVN/BlogPost/VPS AMD InterData_ Hiệu Năng Vượt Trội.png`.
Mẫu hướng dẫn bố cục, nhịp section và cách trình bày; không coi giá, số liệu,
khách hàng, đánh giá hay cam kết trong ảnh là dữ liệu dịch vụ.

Bố cục hiện tại:

1. Hero tối giản: breadcrumb, nhãn, tiêu đề, mô tả và hai CTA bên trái;
   chip AMD EPYC nằm trong ảnh nền máy chủ chân thực bên phải. Không còn
   thẻ tính năng, dãy thông tin phụ hoặc giá khởi điểm trong Hero.
2. Thanh thông tin nền tảng, thay các số liệu minh họa chưa xác nhận bằng AMD EPYC,
   NVMe Gen 4, quyền root và kênh ticket.
3. Bảng giá truyền thống: tiêu đề/mô tả căn giữa ở trên, bộ lọc và chu kỳ ở dưới,
   sau đó là bốn thẻ giá trải toàn chiều rộng (hai thẻ trên tablet, một thẻ trên mobile).
4. Section nền ảnh về nền tảng AMD EPYC và thông số CPU vật lý.
5. Năm thẻ ứng dụng có ảnh: Website & App, DevOps, cơ sở dữ liệu, tác vụ nền, hệ thống nội bộ.
6. Bảng so sánh VPS và Shared Hosting, dùng `vps-content.json` → `learning.comparisonRows`.
7. Section hạ tầng nền ảnh với checklist lựa chọn và quy trình đăng ký.
8. Feedback/Báo chí dùng `CustomerProof`, giống homepage và `/thue-vps/`.
9. FAQ hai cột trên desktop, một cột trên mobile; CTA cuối trang nền ảnh.

CSS nằm trong `amd.module.css`; không sửa CSS/layout chung để làm theo mẫu.
Dùng màu thương hiệu, màu chữ/border/surface của `globals.css`, font toàn site,
button pill cùng phong cách project. Header/footer trong ảnh không được sao chép.

### Màu nhấn của trang VPS AMD

Xanh vẫn là màu chủ đạo của ảnh, tab, liên kết, giá và chi tiết kỹ thuật.
Cam hổ phách dùng tiết chế cho CTA ở Hero/cuối trang, thẻ giá thứ hai,
nhãn trên nền tối và vài chỉ dấu nhỏ. Nền bảng giá pha kem nhạt.
Các token `--amd-accent-*` chỉ khai báo trong CSS module của VPS AMD;
không đổi palette toàn site hoặc màu của Feedback/Báo chí dùng chung.

| Vai trò | Màu |
|---|---|
| CTA cam, hover, active | `#FFB547`, `#FFC56C`, `#EFA12E` |
| Chữ trên CTA | `#172033` |
| Chữ nhấn trên nền sáng / nền nhãn | `#925008` / `#FFF3DF` |
| Chữ nhấn trên nền tối / nền nhãn | `#FFCE87` / `#302619` |
| Viền trang trí thẻ nhấn | `#D99A3B` |

Các cặp chữ/nền mới kiểm tra đạt 4,5:1: CTA 9,26:1, hover 10,42:1,
active 7,60:1, nhãn sáng 5,67:1 và nhãn tối 10,18:1.
Focus tiếp tục dùng màu xanh trên nền sáng và trắng trên nền tối theo site.
Không đổi hình ảnh, nội dung, cấu hình, giá, trạng thái lỗi hay hành vi tương tác.

## Nội dung và hình ảnh

Thông tin cốt lõi tham khảo working tree `D:/InterData/vps-amd`, các file
`app/page.js`, `Hero.jsx`, `Features.jsx`, `Benefit.jsx`, `Solution.jsx`,
`Faq.jsx` và `Prices.jsx`. Nội dung được biên tập cho cấu trúc mới.

- Theo yêu cầu ngày 13/10/2026, tạo chín ảnh mới bằng công cụ `image_gen`:
  `hero-server-epyc-v2.webp`, `performance-epyc-board-v3.webp`,
  `infrastructure-datacenter-v2.webp`, `cta-server-aisle-v2.webp` và năm ảnh
  `application-*-v2.webp`, lưu tại `public/images/vps-amd/`.
- Hero và phần CPU có chip gắn trong toàn cảnh của ảnh nền; không còn ảnh CPU
  trong suốt đặt chồng lên nền hoặc glow/drop-shadow cho chip riêng.
  Mobile hiển thị cùng ảnh toàn cảnh trong vùng ảnh riêng giữa các hàng nội dung
  để chip không bị cắt bởi nền dọc. Không tách chip khỏi môi trường xung quanh.
- Các banner có tỷ lệ gần 3:1, WebP quality 88; ảnh ứng dụng 3:2,
  rộng 1200px, WebP quality 86. Prompt đầy đủ: `docs/vps-amd-image-prompts.json`.
- Ảnh là minh họa được tạo, không phải ảnh chụp hạ tầng thực tế InterData và
  không chứng minh chứng nhận, hiệu năng hoặc quyền lợi phần mềm của gói VPS.
- Các ảnh AMD cũ trong `public/images/vps-amd/` được giữ nguyên trên đĩa.
- Không dùng screenshot mẫu làm nền hoặc sao chép CSS/component/font của project cũ.

Hero hiện dùng `hero-enterprise-epyc-v3.webp` thay cho `hero-server-epyc-v2.webp`.
Ảnh mới tạo bằng `image_gen`: CPU đặt trong socket của server mở nắp,
vật liệu kim loại/xám tự nhiên, ánh sáng trắng tiết chế và rack máy chủ mờ
ở phía sau. Chip và môi trường là một ảnh thống nhất, không phải chip rời.
Prompt: `docs/vps-amd-hero-image-prompt.json`. Mobile hiển thị toàn cảnh
ngay dưới hai CTA; desktop dùng nền toàn chiều ngang. Các ảnh section khác giữ nguyên.

Nguồn thông số CPU:
https://www.amd.com/en/products/processors/server/epyc/7003-series/amd-epyc-7763.html
64 nhân / 128 luồng, boost tối đa 3,5 GHz và PCIe 4.0 thuộc CPU vật lý EPYC
7763; không coi đó là tài nguyên mỗi VPS. API mô tả vCPU AMD G2&G3, nên
trang yêu cầu xác nhận model CPU thực tế theo gói khi đăng ký.

Không đưa vào trang các số liệu trong mẫu chưa có nguồn xác nhận: 10.000 khách
hàng, 100 Gbps, uptime/Tier III, kích hoạt 1 phút, không giới hạn băng thông,
96 vCore/server, hiệu năng/tiết kiệm điện theo phần trăm và ba khách hàng mẫu.
Chưa có căn cứ để cam kết GPU/AI hoặc quyền lợi phần mềm, backup hay dùng thử.

## Bảng giá

`getAmdProducts()` giữ endpoint cũ:
`https://support.interdata.vn/packages.php?gid=67&module`.
Next fetch revalidate 60 giây, timeout 15 giây, kiểm tra schema, gid, giá và
hostname checkout. Proxy retry: `/api/vps-amd-pricing/`.

Giữ tên, thứ tự, giá, mô tả và `product_url` từ API. Có 6 chu kỳ 1/3/6/12/24/36
tháng. Giá hiển thị là tổng tiền của chu kỳ; không quy đổi thành giá/tháng
hoặc tự dựng mức giảm. Checkout thêm `billingcycle` tương ứng.

Mặc định bốn gói đầu; mở rộng để xem toàn bộ. Bộ lọc dựa trên số vCPU trong
mô tả API: Tất cả, 1–2, 3–8 và từ 10 vCPU. Không gán nhãn “Phổ biến” thiếu
bằng chứng. Đường viền gói thứ hai chỉ là điểm nhấn thị giác. Đổi bộ lọc
thu gọn lại danh sách, vẫn giữ chu kỳ đang chọn. Hỗ trợ ArrowLeft/Right,
Home/End và roving tabindex cho các tab.

Lỗi upstream hiển thị trạng thái lỗi và nút thử lại, không dùng giá giả.
Tình trạng cung cấp, thuế và tùy chọn phải được kiểm tra tại trang đăng ký;
QA không đặt hàng. Khi tắt JavaScript, bốn gói đầu, link đăng ký và FAQ vẫn
đọc được; đổi chu kỳ, lọc, mở rộng và retry cần JavaScript.

Metadata có canonical, Open Graph và Service JSON-LD. Giữ noindex/nofollow
của project; không gán đánh giá homepage hoặc giá cố định vào schema dịch vụ.

## Kiểm tra

`npm run build`, `npm run lint`, `npm run typecheck`.

```powershell
$env:TEST_BASE_URL='http://localhost:3103'
$env:AMD_QA_DEV_BASE_URL='http://localhost:3100'
npm run test:vps-amd
```

QA đối chiếu live API, 6 chu kỳ, giá/specs/checkout, lọc theo vCPU,
mở rộng/thu gọn, keyboard và FAQ; so sánh Feedback/Báo chí trên ba route;
kiểm tra 320/390/768/1024/1440/1920px, hero toàn chiều ngang, overflow,
ảnh hiển thị, axe WCAG A/AA trong main, parallax/reduced motion và no-JavaScript.
Test tạo fixture tạm trên dev để mô phỏng API lỗi/loading/retry/recovery,
xóa fixture trong finally. Kết quả/ảnh: `artifacts/vps-amd/`;
ảnh rà soát theo mẫu: `artifacts/vps-amd-reference/`.

Chưa triển khai lên production; QA local không kiểm thử giao dịch.
