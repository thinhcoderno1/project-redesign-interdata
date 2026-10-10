# CTA tư vấn InterData

CTA giữ nguyên nội dung, nhãn nút và đường dẫn liên hệ; đặt sau nhu cầu và trước tin tức. Khoảng cách ngoài box vẫn là 80px trên desktop và 52px trên mobile.

Thiết kế tham khảo nguyên tắc bố cục của ảnh Vietnix do người dùng cung cấp: visual bên trái, nội dung tư vấn bên phải, nền xanh và nút nổi bật. Bản InterData dùng gradient xanh thương hiệu, minh họa kỹ sư cùng máy chủ, các ô icon và nút trắng; không tái sử dụng asset, câu chữ hoặc bố cục nguyên bản của đối thủ.

## Asset

- File sử dụng: `public/images/cta/consultation-engineer.webp`.
- Minh họa tạo bằng built-in `image_gen`, thông qua skill imagegen; không dùng CLI fallback.
- Nhân vật minh họa trang trí, không đại diện cho một nhân viên hoặc danh tính có thật. `alt` rỗng, visual `aria-hidden` để tránh lặp nội dung.
- WebP được mã hóa từ kết quả PNG, giữ alpha. Bản PNG gốc được giữ tại thư mục generated_images của Codex.
- CSS module: `src/components/home/consultation-cta.module.css`; component: `src/components/home/consultation-cta.tsx`.

## Prompt cuối cùng

Create an original premium 3D editorial illustration for the LEFT visual of a Vietnamese cloud infrastructure website consultation banner. A friendly adult Vietnamese male technology consultant, stylized realistic 3D character (clearly an illustration, not a photographic employee portrait), short neat dark hair, white business casual overshirt over a royal blue shirt, small unobtrusive headset, holding a slim closed silver laptop at waist height and casually gesturing toward a compact pair of modern server towers beside him. Waist-up/three-quarter figure, complete head, complete hands and complete server objects. Calm competent expression. Polished materials, gentle studio lighting, natural anatomy, no exaggerated cartoon proportions. Color palette cobalt blue #0043ec, deep navy #031677, white, silver, a tiny pale cyan accent. The person is the focal point, servers secondary in the lower left. Straight-on with subtle three-quarter angle looking gently toward the viewer/right. COMPOSITION: square 1024x1024 canvas, compact centered grouping filling roughly 85% of canvas height, tight useful silhouette, leave a little breathing room around all edges. Actual transparent alpha background, no solid backdrop, no floor plane, no circular background, no card, no frame, no large glow; subtle small contact shadows contained inside the objects only. No text, no letters, no numbers, no logos, no watermark, no claims, no surrounding floating badges. This is a standalone decorative cutout for a cobalt/deep navy CSS background, not an entire website or banner. Original composition; do not reproduce any competitor's character or illustration.

## Kiểm tra

Đối chiếu content, CTA URL và các section khác với snapshot trước thay đổi. Kiểm tra bố cục, ảnh, bàn phím, contrast và responsive cục bộ tại `artifacts/cta-redesign/`.
