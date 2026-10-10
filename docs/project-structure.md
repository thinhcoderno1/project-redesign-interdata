# Cấu trúc source InterData

Homepage và các trang con sử dụng cùng một ứng dụng Next.js App Router. Mỗi URL có thư mục route riêng; những phần dùng chung được quản lý một lần.

```text
src/
├── app/
│   ├── layout.tsx                 # HTML, font, CSS nền tảng, metadata mặc định
│   ├── globals.css                # Color tokens, UI chung, header/footer, responsive
│   ├── (website)/
│   │   ├── layout.tsx             # Header và footer chung cho website
│   │   ├── (home)/page.tsx        # Route /, metadata và revalidate của homepage
│   │   ├── gioi-thieu/page.tsx    # Route /gioi-thieu/, nội dung Giới thiệu
│   │   └── lien-he/page.tsx       # Route /lien-he/, nội dung Liên hệ
│   └── content-review/page.tsx    # Trang review giữ layout hiện tại
├── components/
│   ├── home/                      # Nội dung và các section chỉ dành cho homepage
│   │   ├── home-page.tsx          # Ghép các section homepage
│   │   └── home.module.css        # CSS homepage giới hạn trong root .home
│   ├── about/                     # Nội dung và CSS riêng của trang Giới thiệu
│   ├── contact/                   # Liên hệ, Google Maps và công cụ soạn email
│   ├── layout/                    # Navigation, footer, liên hệ nổi, link section
│   └── ui/                        # Icon và thành phần có thể tái sử dụng
├── data/                          # Nội dung, danh mục dịch vụ, cấu hình bài viết
└── lib/                           # Kết nối WordPress API và xử lý dữ liệu
```

## Thêm trang con

Trang Giới thiệu và Liên hệ đã triển khai; các trang còn lại dưới đây là ví dụ tổ chức cho những route sẽ tạo tiếp:

```text
app/(website)/
├── (home)/page.tsx                       → /
├── gioi-thieu/page.tsx                   → /gioi-thieu/ (đã triển khai)
├── lien-he/page.tsx                      → /lien-he/ (đã triển khai)
├── (policies)/privacy-policy/page.tsx    → /privacy-policy
├── (policies)/terms-and-condition/page.tsx → /terms-and-condition
└── (services)/thue-vps/page.tsx          → /thue-vps
```

Tên thư mục trong ngoặc là route group, chỉ dùng để tổ chức code, không xuất hiện trong URL. Các slug thực tế phải theo URL được duyệt và đối chiếu link hiện có trước khi tạo trang. Không tạo đồng thời `app/page.tsx` và `(website)/(home)/page.tsx`, vì cả hai cùng đại diện cho `/`.

Mỗi `page.tsx` khai báo metadata của trang và trả về nội dung trong `<main id="noi-dung">` để link bỏ qua điều hướng hoạt động. Header/footer được nhận từ `(website)/layout.tsx`, không cần gọi lại trong trang. Trang đơn giản có thể viết ngay trong file route; khi có nhiều section, đưa component sang `components/about/`, `components/contact/` hoặc `components/services/` tương ứng.

Font và color tokens lấy từ root layout và `globals.css`. CSS riêng của trang dùng CSS Module colocated với component. Chỉ đưa vào `components/ui` những phần thực sự dùng ở nhiều trang. Các template trang dịch vụ hoặc chính sách có thể chia sẻ component, còn nội dung và metadata quản lý riêng theo từng route.

## Ranh giới CSS và điều hướng

`home-page.tsx` áp dụng class `home` từ `home.module.css` lên `<main>`. Các class hiện có của section được giữ nguyên và được scope dưới root này, tránh ảnh hưởng trang con kể cả khi stylesheet còn được giữ sau chuyển trang. `:where(.home)` không tăng specificity. Những selector có specificity khác nhau được viết thành rule riêng: bộ xử lý CSS Module có thể gộp danh sách thành `:is(...)`, khiến specificity thay đổi nếu gộp chúng.

Một số rule `.section` và `.parallax-background` được lặp lại có scope trong module homepage để giữ thứ tự cascade trước đây, bao gồm responsive và reduced motion. Không chuyển các quy tắc riêng của homepage trở lại `globals.css` khi phát triển trang mới.

Các link giải pháp ở header/footer dùng `#section` tại homepage và `/#section` ở trang con. Footer dùng `HomeSectionLink`; navigation lấy pathname hiện tại. Link dịch vụ, CTA và các URL ngoài vẫn dùng dữ liệu hiện có. Widget liên hệ nổi vẫn đặt ở root layout để giữ hành vi trên cả trang review.

`artifacts/` lưu ảnh và bản sao phục vụ QA, được loại khỏi Git và TypeScript build. Không dùng thư mục này làm source ứng dụng.

## Kiểm tra

```powershell
npm run lint
npm run build
npm run test:ui
npm run test:layout
```

`test:layout` cần dev server cục bộ đang chạy. Script tạo một route kiểm thử tạm thời, kiểm tra header/footer chung, điều hướng qua lại và CSS homepage không ảnh hưởng trang con, rồi xóa route trong `finally`. Chạy riêng, tránh song song với build hoặc các kiểm tra UI khác: thay đổi route có thể khiến dev server reload các trang đang được kiểm tra.

`scripts/verify-site-structure.mjs` dùng cho lần refactor này: trước thay đổi chạy với `--baseline`, sau thay đổi chạy lại để so sánh nội dung, link, ảnh, kích thước và computed styles ở 320, 768, 1440px. Baseline được lưu trong `artifacts/site-structure/` của máy thực hiện, không phải fixture được commit. Trước một lần refactor khác, cần chụp baseline mới.
