# InterData Color System

## 1. Vai trò của màu

- **Primary blue**: hành động chính, liên kết, tab được chọn và điểm nhấn kỹ thuật.
- **Strong navy**: bề mặt section giải pháp chuyên sâu và footer.
- **Light surfaces**: phân chia hero, nội dung, nhu cầu, tài nguyên và tư vấn bằng các sắc nền nhẹ.
- **Neutral text/border**: tạo phân cấp nội dung, đường phân cách và ranh giới control.
- **Feedback**: đỏ cho lỗi, xanh lá cho thành công; luôn có thông báo bằng chữ.

Palette được tổ chức theo vai trò semantic. Cùng một HEX có thể có nhiều token khi vai trò khác nhau, ví dụ chữ trắng, nền trắng và focus trắng.

## 2. Bảng token màu

### 2.1. Brand

| CSS token | HEX | RGB | Vai trò |
|---|---|---|---|
| `--brand-primary` | `#0043EC` | `0, 67, 236` | CTA chính, link, tab active, icon |
| `--brand-hover` | `#0036C4` | `0, 54, 196` | Hover primary button |
| `--brand-subtle` | `#EEF3FF` | `238, 243, 255` | Nền tư vấn, icon box, hover outline button |
| `--brand-strong` | `#031677` | `3, 22, 119` | Nền solution section và footer |
| `--brand-card` | `#102681` | `16, 38, 129` | Thẻ giải pháp trên nền navy |

### 2.2. Surface

| CSS token | HEX | RGB | Vai trò |
|---|---|---|---|
| `--surface-canvas` | `#FFFFFF` | `255, 255, 255` | Trang, thẻ sáng, form và menu |
| `--surface-subtle` | `#F6F8FB` | `246, 248, 251` | Nhu cầu, tài nguyên, utility bar |
| `--surface-hero` | `#F3F6FC` | `243, 246, 252` | Hero và panel hỗ trợ |

### 2.3. Text

| CSS token | HEX | RGB | Vai trò |
|---|---|---|---|
| `--text-primary` | `#172033` | `23, 32, 51` | Tiêu đề và chữ chính trên nền sáng |
| `--text-secondary` | `#526075` | `82, 96, 117` | Mô tả, helper, nội dung phụ |
| `--text-muted` | `#657188` | `101, 113, 136` | Placeholder, nhãn phụ và số thứ tự |
| `--text-on-brand` | `#FFFFFF` | `255, 255, 255` | Chữ trên CTA/tab xanh và tiêu đề trên navy |
| `--text-on-dark-secondary` | `#CBD5F7` | `203, 213, 247` | Mô tả và link phụ trên nền tối |

### 2.4. Border và focus

| CSS token | HEX | RGB | Vai trò |
|---|---|---|---|
| `--border-default` | `#D7DEE8` | `215, 222, 232` | Viền card và đường phân cách |
| `--border-control` | `#7D899D` | `125, 137, 157` | Ranh giới input/select/textarea |
| `--border-on-dark` | `#4558A4` | `69, 88, 164` | Viền solution card, phân cách footer |
| `--focus-light` | `#0043EC` | `0, 67, 236` | Outline focus trên nền sáng |
| `--focus-dark` | `#FFFFFF` | `255, 255, 255` | Outline focus trong solutions/footer |

Focus hiện tại: outline **3px**, offset **4px**. Viền control dùng token riêng để phân biệt với viền trang trí nhạt.

### 2.5. Feedback

| CSS token | HEX | RGB | Vai trò |
|---|---|---|---|
| `--error` | `#A9222A` | `169, 34, 42` | Chữ, viền input lỗi và notice lỗi |
| `--error-surface` | `#FFF3F3` | `255, 243, 243` | Nền notice lỗi |
| `--success` | `#17633D` | `23, 99, 61` | Chữ và viền notice thành công |
| `--success-surface` | `#EDF8F1` | `237, 248, 241` | Nền notice thành công |

Project có **22 token màu**. Chưa định nghĩa token warning/info riêng; nếu thêm trạng thái này, cần bổ sung vai trò, cặp chữ/nền và kiểm tra contrast trước khi dùng.

## 3. Transparency, overlay và shadow

Các giá trị sau đang nằm trong style component hoặc shadow token:

| Thành phần | Giá trị CSS | Cách dùng |
|---|---|---|
| Drawer backdrop | `rgb(23 32 51 / 55%)` | Phủ lên nội dung khi modal menu mở |
| Image caption hero | `rgb(23 32 51 / 86%)` | Nền tối có chữ trắng trên ảnh |
| Icon tab được chọn | `rgb(255 255 255 / 14%)` | Bề mặt icon trên primary blue |
| Solution icon | `rgb(255 255 255 / 8%)` | Bề mặt icon trên dark card |
| `--shadow-card` | `0 6px 28px rgb(23 32 51 / 5%)` | Card hover và form |
| `--shadow-menu` | `0 16px 48px rgb(23 32 51 / 12%)` | Mega menu và hero visual note |

Button disabled dùng `opacity: .65`, không có màu disabled riêng. Alpha và opacity cần được đánh giá sau khi compositing lên nền thực tế; không suy ra contrast từ màu gốc chưa pha.

Nền navy là style của section cụ thể. Project hiện chưa có palette riêng hoặc cơ chế chuyển đổi light/dark theme.

## 4. Quy tắc phối màu

| Ngữ cảnh | Background | Chữ chính | Chữ phụ | Viền / điểm nhấn |
|---|---|---|---|---|
| Trang và card sáng | `surface-canvas` | `text-primary` | `text-secondary` | `border-default`, `brand-primary` |
| Nhu cầu và tài nguyên | `surface-subtle` | `text-primary` | `text-secondary` | Card con nền canvas |
| Hero và support panel | `surface-hero` | `text-primary` | `text-secondary` | CTA/icon primary |
| Consultation section | `brand-subtle` | `text-primary` | `text-secondary` | Form trắng, CTA primary |
| Solutions section | `brand-strong` | `text-on-brand` | `text-on-dark-secondary` | Card nền brand-card |
| Solution card | `brand-card` | `text-on-brand` | `text-on-dark-secondary` | `border-on-dark` |
| Footer | `brand-strong` | `text-on-brand` | `text-on-dark-secondary` | `border-on-dark`, focus-dark |
| Error notice | `error-surface` | `error` | `error` | Viền error |
| Success notice | `success-surface` | `success` | `success` | Viền success |

Tên trong bảng là phần sau `--` của CSS token. Dùng màu chữ theo bề mặt thực tế; link trên navy dùng trắng hoặc on-dark-secondary theo component, thay vì mặc định lấy primary blue từ nền sáng.

## 5. Màu theo trạng thái component

| Component | Default | Hover / selected / feedback |
|---|---|---|
| Primary button | Nền primary, chữ trắng | Hover nền brand-hover; disabled opacity .65 |
| Outline button | Canvas, text-primary, border-default | Hover brand-subtle, chữ/viền brand-primary |
| Text link sáng | Brand-primary | Hover gạch chân; giữ màu |
| Desktop nav | Text-primary | Hover hoặc menu mở: brand-primary |
| Service card | Canvas, border-default | Hover border-primary, shadow-card |
| Need tab | Canvas, chữ primary/secondary | Selected nền brand-primary, chữ trắng; tab chưa chọn hover viền primary |
| Contact switch | Surface-subtle, text-secondary | Selected nền brand-primary, chữ trắng |
| Solution card | Brand-card, border-on-dark | Hover viền text-on-dark-secondary |
| Solution CTA | Text-on-brand | Hover gạch chân |
| FAQ | Câu hỏi text-primary, sign nền surface-subtle | Mở: câu hỏi brand-primary, sign nền brand-subtle |
| Article title | Text-primary | Hover brand-primary |
| Form field | Canvas, text-primary, border-control | Input/textarea invalid: viền error; lỗi có chữ đi kèm |
| Footer link | Text-on-dark-secondary | Hover text-on-brand và gạch chân |

Không bổ sung màu pressed/active cho button khi project chưa có quy tắc riêng. Các trạng thái selected/open được thể hiện thêm bằng ARIA, nội dung hoặc ký hiệu; phản hồi lỗi/thành công luôn có thông báo.

## 6. Contrast của các cặp màu

Bảng dưới tính lại từ các giá trị CSS trên nền màu phẳng, làm tròn hai chữ số. Mốc 4.5:1 dùng cho chữ thường; 3:1 dùng cho ranh giới control trong phép kiểm tra này. Kết quả chỉ áp dụng cho từng cặp, không phải chứng nhận accessibility toàn trang.

| Cặp màu | Foreground | Background | Contrast | Mốc kiểm tra |
|---|---|---|---|---|
| Chữ CTA chính | `#FFFFFF` | `#0043EC` | 6.97:1 | 4.5:1 |
| Chữ chính trên canvas | `#172033` | `#FFFFFF` | 16.27:1 | 4.5:1 |
| Chữ phụ trên canvas | `#526075` | `#FFFFFF` | 6.39:1 | 4.5:1 |
| Link trên brand-subtle | `#0043EC` | `#EEF3FF` | 6.27:1 | 4.5:1 |
| Chữ phụ trên solution card | `#CBD5F7` | `#102681` | 8.91:1 | 4.5:1 |
| Chữ phụ trên footer | `#CBD5F7` | `#031677` | 10.40:1 | 4.5:1 |
| Viền control trên canvas | `#7D899D` | `#FFFFFF` | 3.54:1 | 3:1 |
| Chữ lỗi trên error-surface | `#A9222A` | `#FFF3F3` | 6.57:1 | 4.5:1 |

Viền `border-default` phục vụ phân cách/trang trí; không dùng nó thay `border-control` cho input. Caption ảnh, lớp phủ alpha, focus và trạng thái disabled cần kiểm tra trong ngữ cảnh hiển thị thực tế. Phạm vi QA chi tiết ở [QA.md](QA.md); tính lại tám cặp bằng `node scripts/contrast-check.mjs`.

## 7. CSS token để tham chiếu

Đoạn dưới sao chép từ màu hiện có trong `globals.css`, không tạo một stylesheet mới:

```css
:root {
  --brand-primary: #0043ec;
  --brand-hover: #0036c4;
  --brand-subtle: #eef3ff;
  --brand-strong: #031677;
  --brand-card: #102681;
  --surface-canvas: #ffffff;
  --surface-subtle: #f6f8fb;
  --surface-hero: #f3f6fc;
  --text-primary: #172033;
  --text-secondary: #526075;
  --text-muted: #657188;
  --text-on-brand: #ffffff;
  --text-on-dark-secondary: #cbd5f7;
  --border-default: #d7dee8;
  --border-control: #7d899d;
  --border-on-dark: #4558a4;
  --focus-light: #0043ec;
  --focus-dark: #ffffff;
  --error: #a9222a;
  --error-surface: #fff3f3;
  --success: #17633d;
  --success-surface: #edf8f1;
}
```

Ví dụ dùng token trong component mới:

```css
.example-card {
  background: var(--surface-canvas);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.example-card p { color: var(--text-secondary); }
.example-card a { color: var(--brand-primary); }
```

Màu thanh trình duyệt hiện được khai báo riêng bằng `themeColor: "#0043ec"` trong `layout.tsx`; khi đổi brand-primary, cập nhật cả giá trị này.

## 8. Checklist khi thêm hoặc thay đổi màu

- [ ] Chọn token theo vai trò: brand, surface, text, border, focus hoặc feedback.
- [ ] Dùng `var(--token)` trong style; chỉ thêm HEX mới khi có vai trò chưa được bao phủ.
- [ ] Kiểm tra default, hover, selected/open, focus, disabled và feedback có liên quan.
- [ ] Kiểm tra chữ/icon/viền trên đúng nền thực tế, kể cả alpha hoặc ảnh nền.
- [ ] Giữ label, ký hiệu và thông báo để trạng thái không phụ thuộc riêng vào màu.
- [ ] Giữ màu/tỷ lệ logo theo asset hiện có.
- [ ] Đồng bộ CSS, color system, design system và themeColor nếu token thay đổi.
