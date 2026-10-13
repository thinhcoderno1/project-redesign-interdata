# Typography trang VPS AMD

Cập nhật 13/10/2026, chỉ trong `/vps-amd/` qua `amd.module.css`.

- Nội dung chính 16–17px; giới thiệu section nhu cầu 18px.
- CTA và link thao tác 16px. Tab chu kỳ 16px desktop, 15px mobile.
- Chữ phụ, đơn vị, ghi chú 13–15px, có giãn dòng phù hợp.
- FAQ: câu hỏi 17px desktop/16px mobile; câu trả lời 16px.
- Bảng so sánh 16px, giữ vùng cuộn ngang trên mobile.
- Quy trình triển khai: tiêu đề bước 17px, mô tả 16px, ghi chú 14px.
- Card thông số nền tảng: tiêu đề 17px, mô tả 16px.
- Card giá: thông số và CTA 16px; giá tổng chu kỳ giữ nguyên cách hiển thị.
- H2 cơ sở 30–40px, các heading đặc thù giữ phân cấp riêng.
- CPU stats dùng ba cột, khoảng cách nhỏ hơn trên mobile; số và GHz cùng dòng.
- Chỉ override typography Feedback/Báo chí dưới class `.page`, không sửa
  component hoặc stylesheet chung của homepage/các trang dịch vụ khác.

Nội dung, giá, thứ tự gói, liên kết, các ảnh và chức năng giữ nguyên.
QA: `artifacts/amd-page-typography/`; suite toàn trang `artifacts/vps-amd/`.
