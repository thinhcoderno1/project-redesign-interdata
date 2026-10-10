# Trang Liên hệ InterData

Route `/lien-he/` thay thế `/contact` trong ứng dụng Next.js này. Trang nằm ở `src/app/(website)/lien-he/page.tsx`, nhận header/footer và widget liên hệ chung; component, CSS Module và dữ liệu riêng nằm trong `src/components/contact/` và `src/data/contact.ts`.

## Thông tin đã đối chiếu ngày 10/10/2026

[Contact chính thức](https://interdata.vn/contact) xác nhận hai địa điểm, hotline 1900 636 822, số tư vấn 0966 039 166, email info@interdata.vn và giờ làm việc văn phòng Thứ 2–Thứ 7, 9:00–18:00. Email được đối chiếu cả nội dung HTML của trang và footer hiện có.

- Văn phòng giao dịch: Số 211 Đường số 5, Khu đô thị Lakeview City, Phường Bình Trưng, TP. Hồ Chí Minh. Link [Google Maps chính thức từ footer blog](https://maps.app.goo.gl/JdnrU5N9xWYKShqt5) dẫn đến InterData - VPGD, tọa độ 10.7952477, 106.778797.
- Văn phòng đại diện: 240 Nguyễn Đình Chính, Phường Phú Nhuận, TP. Hồ Chí Minh. Link [Google Maps từ Contact](https://maps.app.goo.gl/ZxSPDiAQerFgVw5RA) dẫn đến InterData - Trụ Sở Chính, tọa độ 10.795176, 106.674237. Nhãn trên trang dùng “Văn phòng đại diện” theo nội dung Contact, không tự đổi tên Google Place.
- Zalo và Facebook giữ nguyên URL đã được người dùng cung cấp. Ticket dùng URL hỗ trợ đã có trong source.

Hai địa chỉ không thay thế lẫn nhau: chúng có vai trò riêng được Contact hiện tại ghi rõ. Footer dùng văn phòng đại diện và được giữ nguyên. Giờ làm việc được ghi riêng cho văn phòng, không được diễn đạt thành lịch trực hỗ trợ kỹ thuật.

## Thiết kế và Google Maps

Hero có lời mời trao đổi nhu cầu và panel dành cho khách hàng đang dùng dịch vụ. Bốn card liên hệ liên kết tới điện thoại, email, Zalo và Facebook. Phần soạn yêu cầu đi kèm các thông tin cần chuẩn bị; phần văn phòng có hai nút lựa chọn, địa chỉ, giờ làm việc và Google Maps.

Google Maps dùng iframe tải lazy, trỏ đến tọa độ được lấy từ link Google Place chính thức. Mỗi lần đổi văn phòng, địa chỉ, title iframe, vị trí bản đồ và link chỉ đường thay đổi đồng thời. Có liên kết mở Google Maps độc lập bên dưới iframe khi bản đồ bị chặn hoặc không tải. Iframe có kích thước đặt trước, không cần API key trong source. Không lưu ảnh giả để thay bản đồ.

Không có JavaScript: trang vẫn hiển thị thông tin liên hệ, bản đồ mặc định và link Google Maps của cả hai địa điểm; nút đổi địa điểm bị vô hiệu hóa và địa chỉ thứ hai có fallback riêng.

## Tiếp nhận yêu cầu

Form cũ dùng `action="contact.php"`, không phải API đã có contract xác nhận cho ứng dụng Next.js. Project không có backend tiếp nhận hoặc cấu hình CRM/email. Trang mới vì vậy cung cấp **công cụ soạn email**, không gửi POST sang endpoint cũ và không báo gửi thành công giả.

Người dùng điền họ tên, email, dịch vụ, nội dung; điện thoại và doanh nghiệp tùy chọn. Công cụ kiểm tra dữ liệu, tạo nội dung để xem lại rồi cho phép mở ứng dụng email hoặc sao chép. `mailto:` trỏ tới info@interdata.vn và encode subject/body. Khi chỉnh thông tin, bản nháp cũ được bỏ để tránh gửi sai nội dung. Nếu clipboard bị chặn, nội dung vẫn có thể chọn và sao chép thủ công.

Thông báo ghi rõ yêu cầu chưa được gửi; người dùng phải bấm gửi trong ứng dụng email. Không xác nhận InterData đã nhận thư. Không nhập hay gửi dữ liệu thật trong QA. Không JavaScript: nút soạn nội dung bị vô hiệu hóa, có liên kết email trực tiếp.

Để gửi trực tiếp tại website trong lần triển khai tiếp theo, cần endpoint tiếp nhận/email hoặc CRM được xác nhận và cấu hình runtime tương ứng. Không tự khôi phục POST sang `contact.php` chỉ dựa vào HTML cũ.

## Điều hướng và metadata

- `links.contact` dùng `/lien-he/`, cập nhật CTA và liên kết dùng chung dữ liệu. Header menu và footer hỗ trợ điều hướng nội bộ; các link section giải pháp ở trang con vẫn trở về homepage.
- `/contact` và `/contact/` chuyển hướng vĩnh viễn tới `/lien-he/`, giữ query string. `/lien-he` được chuẩn hóa slash theo cấu hình đã có.
- Metadata title, description, canonical và Open Graph riêng; giữ `noindex,nofollow` của bản review.
- Việc thay trang Contact tại domain công khai cần deploy source mới; thay đổi hiện tại chỉ ở máy cục bộ.

## Kiểm tra

```powershell
npm run lint
npm run build
npm run test:contact
node scripts/verify-topbar.mjs
npm run test:about
npm run test:ui
```

`test:contact` cần server chạy; `TEST_BASE_URL` đổi server, `CONTACT_QA_DIRECTORY` đổi thư mục kết quả. Script kiểm tra 320, 390, 768, 1024, 1440, 1920px; title/canonical, overflow, native validation và khoảng trắng, email chứa dấu tiếng Việt/ký tự &, copy/fallback, đổi bản đồ bằng bàn phím, client navigation, redirect và bản không JavaScript. Các test không mở ứng dụng email hoặc gửi yêu cầu thật.

Audit axe áp dụng UI do project kiểm soát; iframe Google được loại khỏi audit nội dung của bên thứ ba. Title, URL và việc tải nội dung Google Maps được kiểm tra riêng; đã xem bản đồ và pin thật qua screenshot desktop. Google Maps cần kết nối đến Google trên trình duyệt người dùng.

### Kết quả kiểm tra ngày 10/10/2026

- Lint không có warning/error; production build thành công, trang Liên hệ được prerender; Prettier và `git diff --check` đạt.
- `test:contact` đạt cả dev (3100) và production cục bộ (3101), 320–1920px. Không tràn ngang, không page error, không vi phạm axe trong UI do project kiểm soát. Draft, validation, clipboard/fallback, map switching, redirect giữ query string, chuyển trang và bản không JavaScript đạt. Không phát sinh POST từ thao tác soạn yêu cầu.
- `verify-topbar` đạt 320–1440px; kiểm tra tương tác homepage `test:ui` đạt 360–1440px; `test:about` đạt 320–1920px.
- Snapshot nội dung, ảnh, kích thước và computed styles homepage đạt ở 320, 768, 1440px, trên cả dev và production. Chỉ cập nhật href Giới thiệu/Liên hệ trong bản sao baseline theo scope đã duyệt; giữ nguyên baseline gốc.
- Đã xem hero, form và bản đồ trên ảnh chụp desktop/mobile. Google Maps tải và hiển thị pin thật. Screenshot và báo cáo lưu ở `artifacts/contact/qa/` và `artifacts/contact/production-qa/`, không commit.

Chưa deploy lên domain công khai hoặc xác nhận gửi email thực tế. Server production thử nghiệm được dừng sau QA; dev server hiện có vẫn chạy.
