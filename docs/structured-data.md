# JSON-LD và SEO

## Phạm vi

Schema được render sẵn trong HTML bằng Server Components, không phụ thuộc JavaScript của trình duyệt. Mỗi trang công khai có một graph riêng và một graph nhận diện website. Các entity dùng `@id` ổn định trên domain chính thức `https://interdata.vn` để liên kết với nhau.

| Trang                                        | Schema                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------- |
| Mọi trang trong `(website)`                  | `Organization`, `WebSite`, logo `ImageObject`                                   |
| Homepage                                     | `WebPage`, danh sách dịch vụ/giải pháp `ItemList`                               |
| Giới thiệu                                   | `AboutPage`, `BreadcrumbList`, ảnh đại diện                                     |
| Liên hệ                                      | `ContactPage`, `BreadcrumbList`, hai văn phòng `Place`                          |
| 17 trang dịch vụ/giải pháp                   | `WebPage`, `Service`, `BreadcrumbList`, `FAQPage`, ảnh khi metadata cung cấp    |
| Canh Me, Black Friday                        | `CollectionPage`, `BreadcrumbList`, `FAQPage`                                   |
| Chính sách, điều khoản, hướng dẫn thanh toán | `WebPage`, `BreadcrumbList`                                                     |
| Blog, chuyên mục, phân trang                 | `CollectionPage`, `Blog`, `ItemList`, `BreadcrumbList`                          |
| Tìm kiếm blog                                | `SearchResultsPage`, `Blog`, `ItemList`, `BreadcrumbList`                       |
| Single post                                  | `WebPage`, `BlogPosting`, `Blog`, `BreadcrumbList`, ảnh đại diện nếu CMS có ảnh |

Trang nội bộ `/content-review/` và trang không tồn tại không được gắn schema trang công khai. Các script rời rạc trước đây trong component dịch vụ đã được thay bằng graph thống nhất.

## Nguồn dữ liệu

- `src/data/site-identity.ts`: tên thương hiệu, pháp nhân, MST, địa chỉ đăng ký và logo từ footer; năm social profile đã được người dùng cung cấp và đang hiển thị ở bottom bar. Social UI và schema đọc chung nguồn này.
- `src/data/contact.ts`: hotline, email và hai văn phòng được trang Liên hệ sử dụng.
- `src/data/content.ts`, `src/data/service-catalog.ts`: danh mục dịch vụ/giải pháp.
- `src/data/schema-pages.ts`: chọn loại trang và tái sử dụng chính các mảng FAQ mà giao diện đang render.
- Metadata của từng route: tên trang, mô tả, ảnh và canonical. Homepage được bổ sung canonical còn thiếu; `metadataBase` dùng domain chính thức.

Không tự thêm rating, số review, giải thưởng, ngày thành lập, mã bưu chính hoặc thông tin chưa duyệt. Các gói có nhiều chu kỳ thanh toán và giá API không được biến thành `Product`/`Offer` với một giá tĩnh dễ sai lệch. Đối tượng đang bán là dịch vụ hạ tầng, được mô tả bằng `Service`.

## Bài mới và cập nhật từ CMS

Route `/blog/[slug]/` giữ `generateStaticParams()` rỗng và khai báo `dynamicParams = true`. Slug mới được truy vấn trực tiếp qua WordPress REST API khi có yêu cầu; không có danh sách bài cho phép hay schema viết tay theo từng bài.

`getBlogPost()` trả cùng dữ liệu cho metadata, nội dung và `buildBlogPostSchema()`:

- `title`, `excerpt` → `headline`, `description`;
- `href` → URL canonical, `@id` bài viết và `mainEntityOfPage`;
- `date_gmt`, `modified_gmt` → ISO 8601 có UTC timezone;
- featured media → ảnh bài viết; thiếu ảnh thì bỏ trường, không dùng logo giả làm ảnh bài;
- embedded author → tên tác giả và URL hồ sơ nếu CMS cung cấp URL hợp lệ;
- tác giả tên `InterData` liên kết đến entity tổ chức; tác giả khác dùng `Person`; thiếu tác giả thì không tự bịa;
- category → `articleSection` và breadcrumb;
- thời gian đọc đã tính từ nội dung → `timeRequired`.

Fetch CMS và route bài viết tiếp tục dùng revalidation **300 giây**. Bài mới tự có schema sau khi cache liên quan được làm mới và URL được yêu cầu; đây là cơ chế request/ISR, không phải webhook cập nhật tức thì. Không cần build lại để bổ sung slug mới. Bài nháp, bài bảo vệ bằng mật khẩu và slug không tồn tại không được coi là bài đã xuất bản.

Tất cả JSON-LD đi qua `serializeSchema()`: các ký tự `<`, U+2028, U+2029 được escape, tránh dữ liệu CMS đóng thẻ script và chèn HTML/JavaScript.

## Thêm trang mới

Giữ metadata là nguồn mô tả của trang và bọc Server Component mặc định:

```tsx
import { withPageSchema } from "@/components/seo/page-schema";

export const metadata = {
  title: "Tên trang | InterData",
  description: "Mô tả đúng nội dung trang.",
  alternates: { canonical: "https://interdata.vn/duong-dan/" },
};

function Page() {
  return <main>Nội dung trang</main>;
}

export default withPageSchema(Page, { path: "/duong-dan/", metadata });
```

Nếu là dịch vụ mới hoặc có FAQ, bổ sung mapping tương ứng trong `src/data/schema-pages.ts` từ nguồn dữ liệu đang được giao diện sử dụng. Không thêm một script schema thứ hai trong component con. Bài blog mới không cần bước này.

## Kiểm tra

```powershell
npm run lint
npm run typecheck
npm run test:schemas:data
npm run test:blog:data
# Cần dev hoặc production server trên port 3100:
npm run test:schemas
npm run build
```

`test:schemas:data` kiểm tra 17 graph dịch vụ/FAQ, bài CMS mới, cập nhật, ngày UTC, tác giả/ảnh thiếu, URL hồ sơ không an toàn, canonical query và chống chèn script. `test:schemas` đọc HTML server của 34 URL thực tế và kiểm tra nhận diện duy nhất, canonical, nội dung FAQ, BlogPosting từ CMS và loại trừ trang nội bộ. Báo cáo lưu trong `artifacts/schema-verification.json`. Đổi server kiểm tra bằng `TEST_BASE_URL`.

Các bài kiểm tra dịch vụ cũ đọc graph qua `scripts/schema-helpers.mjs` thay vì giả định mỗi script chỉ chứa một entity.

Đợt kiểm tra ngày 24/10/2026: 34 URL đã qua trên cả dev và production; các type/property được đối chiếu với vocabulary chính thức của Schema.org (892 entity, 2.655 property). Điều hướng client trên production thay đúng graph theo trang, không giữ Service cũ hoặc nhân đôi Organization. Lint, TypeScript, kiểm tra dữ liệu CMS và production build đều đạt. Một lượt kiểm tra UI tổng hợp Private Network được dừng ở bước chờ giải mã hai ảnh báo chí `news-2.png`, `lamdong1.jpg` cỡ 3840px; không đánh dấu toàn bộ suite UI là đã hoàn tất. Kiểm tra schema độc lập của trang này đã qua.

## Indexing và công cụ của Google

Project vẫn giữ cấu hình **`noindex, nofollow` của bản review** trong root metadata. Thay đổi schema không tự mở indexing hoặc triển khai website. Khi xuất bản chính thức, cần quyết định cấu hình indexing riêng và kiểm tra URL live bằng [Rich Results Test](https://search.google.com/test/rich-results) / [Schema Markup Validator](https://validator.schema.org/).

JSON-LD hợp lệ giúp máy tìm kiếm hiểu nội dung; không bảo đảm thứ hạng hay rich result. Google đã [ngừng hiển thị FAQ rich results từ ngày 07/05/2026](https://developers.google.com/search/updates#may-2026). `FAQPage` vẫn mô tả nội dung hỏi đáp theo Schema.org; việc có loại schema này không có nghĩa InterData sẽ có FAQ rich result trên Google.

Tài liệu áp dụng: [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld), [Google Article](https://developers.google.com/search/docs/appearance/structured-data/article), [Google Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Google Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [nguyên tắc structured data](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [Schema.org Service](https://schema.org/Service).
