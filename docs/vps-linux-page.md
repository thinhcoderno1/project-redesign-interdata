# Trang VPS Linux

Triển khai local tại đúng `/vps-linux/` để thay thế trang Linux hiện tại khi deploy project. Không tạo URL dịch vụ khác, không chuyển hướng sang Platinum. Dùng layout website, navigation và footer chung; giữ noindex/nofollow hiện có của project.

## Thiết kế và nội dung

Clone thiết kế đang có của `src/components/vps-platinum/`: Hero, dải thông số, bảng giá, phần nền tảng, sáu ứng dụng quanh hình trung tâm, so sánh VPS/Shared Hosting, hạ tầng và quy trình ba bước, năng lực, khách hàng/báo chí/giáo dục, đối tác công nghệ, FAQ và CTA cuối. Component và CSS riêng tại `src/components/vps-linux/`, không sửa trang Platinum hoặc các thay đổi badge đã có của homepage/AMD.

Nội dung riêng tập trung vào Linux, SSH, root, template hệ điều hành, website/API/database, self-host, bảo mật và sao lưu. Không mang CPU Intel Xeon Platinum, model CPU, nhóm FPT/Viettel/Hot Deals hoặc hình ảnh của dịch vụ Platinum/AMD sang. Không coi Linux là một dòng CPU. Danh sách bản phân phối là các lựa chọn cần đối chiếu template lúc đăng ký; không hứa một phiên bản cụ thể luôn có sẵn.

Các phần thông tin công ty dùng component chung và nội dung đã có. Các badge trên heading có icon trang trí `aria-hidden`, bao gồm năng lực và đối tác công nghệ. Badge Hero tiếp tục ẩn theo thiết kế Platinum.

## Nguồn và hợp đồng dữ liệu

Đối chiếu ngày 19/10/2026:

- Trang dịch vụ hiện tại: <https://interdata.vn/vps-linux/>.
- Dữ liệu `__NEXT_DATA__.props.pageProps.prices` và chunk trang hiện tại xác nhận `gid=3`, checkout `/store/cloud-vps/`, quy tắc bỏ slug custom và các sản phẩm không có định dạng plan.
- API trực tiếp: <https://support.interdata.vn/packages.php?gid=3&module>.
- Tài liệu quản trị chính thức: <https://ubuntu.com/server/docs/>.

API khi kiểm tra có 18 sản phẩm. Hiển thị 15 gói chuẩn theo thứ tự gốc: `plan-1-...` đến `plan-15-...`; bỏ gói custom, `custom-plan-16-...` và `test-momo`. Giữ nguyên pid, tên, description, thứ tự, `product_url` và tổng tiền từng chu kỳ. Hiện có sáu chu kỳ 1/3/6/12/24/36 tháng; giá âm biểu thị chu kỳ không cung cấp, không hiển thị thành giá bán. Không quy đổi tiền chu kỳ dài thành giá tháng.

Trang cũ có nhãn tĩnh “IPv4 Private” nhưng API hiện hành ghi “IPv4 Public Global”. Trang mới hiển thị description từ API, không dùng lại nhãn tĩnh mâu thuẫn. Ghi chú ở danh mục chuyển thành “IPv4 theo cấu hình gói”. Thông số CPU, lưu trữ, mạng và IP lấy theo từng gói, không áp model hoặc tốc độ chung cho cả danh sách.

`src/lib/vps-linux-pricing.ts` lấy và kiểm tra dữ liệu server: gid đúng 3, trường bắt buộc, pid nguyên, checkout HTTPS tại `support.interdata.vn` không chứa user/password, giá hữu hạn không âm; timeout 15 giây, revalidate 60 giây. Khi upstream lỗi, nội dung trang vẫn xuất hiện cùng trạng thái bảng giá có nút thử lại. `/api/vps-linux-pricing/` chỉ lấy nhóm Linux cố định, trả 502 khi upstream không khả dụng.

Client hiển thị bốn gói đầu, mở rộng/thu gọn, đổi chu kỳ bằng chuột và bàn phím. Checkout giữ `product_url` và thêm `billingcycle` đúng kỳ đã chọn. Có nhắc kiểm tra thuế, tùy chọn và giá gia hạn trên trang đăng ký. Không JavaScript vẫn có bốn gói và liên kết xem đầy đủ tại cổng đăng ký.

Danh mục `src/data/service-catalog.ts` và link dịch vụ trong `src/data/vps-content.json` trỏ `/vps-linux/`. Navigation, danh mục homepage và liên kết đề xuất dùng cùng dữ liệu đó.

## Hình ảnh

Hai ảnh mới tạo bằng built-in `image_gen`, tối ưu WebP, tổng khoảng 278 KiB:

- `public/images/vps-linux/hero.webp`: datacenter với console Linux bên phải và vùng tối cho nội dung bên trái.
- `public/images/vps-linux/platform.webp`: cận cảnh màn hình quản trị Linux và thiết bị máy chủ.

Prompt, phương pháp và file nguồn: [vps-linux-image-prompts.json](./vps-linux-image-prompts.json). Đây là ảnh minh họa, không phải ảnh xác thực cơ sở InterData. Hình trung tâm dùng asset Linux đã có `public/images/vps/range-v3/linux.webp`; các hình ứng dụng dùng bộ VPS chung phù hợp với Linux, SSH và database. Hạ tầng và CTA dùng ảnh minh họa hạ tầng chung, không dùng ảnh đặc thù AMD/Platinum.

## Kiểm tra

```powershell
npm run test:vps-linux
npm run lint
npm run typecheck
npm run build
```

`TEST_BASE_URL` mặc định `http://localhost:3100`. `LINUX_QA_DEV_BASE_URL` chọn dev server cho fixture tạm kiểm tra bảng giá lỗi/thử lại; fixture được xóa sau kiểm tra. Chạy build sau khi fixture đã xóa.

Bộ kiểm tra đối chiếu danh sách, mô tả, thứ tự, mọi giá và checkout với API thật; kiểm tra dữ liệu sai, giá âm và checkout ngoài domain; canonical/Service JSON-LD/noindex; mở rộng, chu kỳ và bàn phím, FAQ, CTA cuộn tới giá; không JavaScript; lỗi mạng và phục hồi. Responsive tại 320/390/768/1024/1440/1920px kiểm tra tràn ngang, hai nút Hero bằng kích thước, icon badge, ảnh tải thành công, không dùng ảnh AMD/Platinum và axe WCAG A/AA. Kết quả và ảnh chụp lưu tại `artifacts/vps-linux/`.

Đây là xác thực local. Không thực hiện đặt hàng/thanh toán hoặc deploy lên website công khai.

Kết quả 19/10/2026: `test:vps-linux`, ESLint, TypeScript, Prettier và build production đạt. Đối chiếu 15 gói qua 6 chu kỳ; sáu viewport đạt kiểm tra ảnh, 13 badge/nhãn, hai nút Hero bằng kích thước, không tràn ngang và axe WCAG A/AA. Kiểm tra trạng thái lỗi/thử lại và không JavaScript đạt. Các route homepage, AMD và Platinum tiếp tục trả nội dung đúng; Platinum không có thay đổi source. Toàn bộ bằng chứng nằm trong `artifacts/vps-linux/`.

Production preview local cũng đạt HTTP 200, API 15 gói đúng gid 3, checkout đúng kỳ năm, 320px không tràn ngang và không có lỗi runtime. Server preview tạm đã dừng; dev preview vẫn dùng `http://localhost:3100/vps-linux/`.

## Section triển khai trong 1 Click

Theo yêu cầu bổ sung, tái sử dụng nguyên component `src/components/vps/environments.tsx` ngay sau section `#ung-dung` có badge “PHÙ HỢP VỚI NHIỀU NHU CẦU”, trước section `#so-sanh`. Giữ tiêu đề “Triển Khai Môi Trường Bạn Cần Trong 1 Click”, nội dung, logo, thứ tự năm Linux OS và bốn ứng dụng, hai tab và thao tác Arrow/Home/End của trang Thuê VPS.

Component chung chỉ thêm tùy chọn `className` để nhận các biến typography của section trên trang Linux; trang Thuê VPS không truyền tùy chọn này nên giữ nguyên giao diện. Không sao chép logic tab, dữ liệu hoặc asset sang bản riêng. Section nguồn dùng nhãn mở đầu không có icon; giữ nguyên cách trình bày này khi đưa sang Linux.

`test:vps-linux` bổ sung kiểm tra vị trí section, số thẻ và điều hướng bàn phím của hai tab. Bằng chứng đối chiếu typography, màu sắc, text, logo và hai trạng thái tab với trang Thuê VPS lưu tại `artifacts/vps-linux/one-click/`.

Kiểm tra bổ sung đạt tại 320/390/768/1024/1440/1920px cho cả hai tab: text, logo, font, màu và padding khớp section nguồn; không tràn ngang, logo tải đầy đủ và axe WCAG A/AA không phát hiện lỗi. `test:vps-linux`, build, lint, typecheck và Prettier đều đạt. Build tự thử lại thành công trang Thuê VPS sau một lần timeout khi lấy dữ liệu ngoài. Đối chiếu snapshot xác nhận nội dung và CSS cũ của Linux không đổi ngoài phần tích hợp section.

## Khoảng cách giữa các section

Theo yêu cầu tinh chỉnh tiếp theo, các section nội dung trên Linux dùng chung `--linux-section-padding`: 80px mỗi đầu trên desktop từ 960px, 64px trên tablet 640–959px và 48px trên mobile. Áp dụng cả phần One Click, so sánh, nền tảng, ứng dụng, bảng giá, hạ tầng, thông tin công ty, FAQ và CTA. Hero và dải thông số giữ bố cục mở đầu hiện có.

Gỡ `padding-top: 0` của phần so sánh ở cả ba mức responsive, khắc phục bảng so sánh sát mép section One Click. Quy tắc chỉ nằm trong CSS module của VPS Linux; không sửa padding của component One Click chung hoặc các trang khác. Khoảng đệm dọc của One Click trên Linux hiện theo nhịp trang Linux, còn nội dung, kiểu chữ, logo, thẻ và tương tác giữ nguyên section nguồn.

Đã đo computed style tại 320/390/768/1024/1440/1920px: tất cả 13 section nội dung cùng mức padding ở từng breakpoint, không tràn ngang. Đối chiếu heading và liên kết với snapshot trước sửa tại mobile, tablet và desktop không có thay đổi. Kết quả và ảnh chụp chuyển tiếp One Click → So sánh nằm trong `artifacts/vps-linux/spacing/`; `test:vps-linux`, build, ESLint và Prettier đạt. Build hoàn tất với cảnh báo nguồn blog tuyển dụng không kết nối được; lỗi này không thuộc phần spacing.
