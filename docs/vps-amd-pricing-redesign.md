# Bảng giá VPS AMD theo ảnh tham khảo

Cập nhật 13/10/2026. Chỉ tinh chỉnh `#bang-gia` trên `/vps-amd/`.

- Tiêu đề/mô tả căn giữa, nền xanh nhạt, bốn card trên desktop từ 1200px;
  hai cột trên tablet, một cột trên mobile. Gói có slug `plan-3` nền xanh đậm,
  chữ trắng, CTA trắng và tag “Phổ biến” có icon vương miện.
- Chu kỳ 1/3/6/12/24/36 tháng chuyển từ select sang tab, đặt trên card.
  Mobile hiển thị sáu tab thành hai hàng; không giấu chu kỳ sau vùng cuộn.
- Các tab hỗ trợ ArrowLeft/ArrowRight, Home/End, vòng lặp và roving tabindex.
  Bảng giá có nhãn theo chu kỳ đang chọn.
- Bỏ bộ lọc vCPU, nhãn “AMD EPYC / NVMe” và ghi chú tổng tiền/thuế/tùy chọn.
  Mặc định bốn gói, giữ xem tất cả/thu gọn và retry khi API lỗi.
  Đổi chu kỳ giữ trạng thái mở rộng và thứ tự gói.
- Giữ API, tên/thứ tự gói, thông số, giá tổng chu kỳ và link checkout có
  `billingcycle`. Không quy đổi giá/tháng, không nhập giá từ ảnh mẫu.
- Tag “Phổ biến” và nội dung dải tiện ích do người dùng trực tiếp cung cấp
  và yêu cầu đưa vào giao diện, không suy ra từ API hoặc số liệu bán hàng.
  Dải gồm đúng bốn nội dung: Hỗ trợ 24/7 — Luôn sẵn sàng hỗ trợ bạn;
  Triển khai nhanh — Kích hoạt chỉ trong vài phút; Bảo mật toàn diện —
  Chống DDoS, Backup định kỳ; Dễ dàng nâng cấp — Linh hoạt theo nhu cầu sử dụng.
  Không thêm claim khác từ ảnh tham khảo.
- Nút “Xem tất cả các gói VPS AMD” không kèm số lượng. Chữ và icon nhấp nhô
  3px trong chu kỳ 2,8 giây, vùng bấm không di chuyển. Dừng khi hover/focus,
  mở rộng hoặc bật reduced motion.
- Icon thông số dựa trên loại dữ liệu, không sửa chữ từ API.
- Không JavaScript: bốn gói và link đăng ký mặc định vẫn hoạt động.
  Chuyển chu kỳ và mở rộng tiếp tục cần JavaScript.

Validation: `npm run test:vps-amd` đã cập nhật cho tab chu kỳ, đối chiếu
giá và link của mọi gói ở cả sáu chu kỳ, keyboard, giữ trạng thái mở rộng,
responsive và accessibility. Chạy cùng lint, typecheck và build trước bàn giao.

Kết quả local: build, lint, typecheck và `test:vps-amd` đều đạt. Đã đối chiếu
14 gói ở 6 chu kỳ; mở rộng/thu gọn, keyboard, outage/retry/recovery,
no-JavaScript và axe trong main đạt tại 320/390/768/1024/1440/1920px.
Giá 36 tháng trên toàn bộ card mở rộng vừa một dòng ở desktop. Nội dung và
link của các section khác giữ nguyên. Ảnh rà soát: `artifacts/amd-pricing-refresh/`;
kết quả suite: `artifacts/vps-amd/results.json`. Ảnh của lần tinh chỉnh tag,
nút và dải tiện ích: `artifacts/amd-pricing-polish/`. Chưa triển khai production.
