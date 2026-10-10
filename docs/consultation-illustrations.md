# Minh họa 3D cho section nhu cầu

Bộ ảnh trang trí cho bốn tab của `Consultation`, tạo bằng công cụ `image_gen` tích hợp ngày 10/10/2026. Phong cách lấy cảm hứng từ ảnh tham chiếu người dùng: máy chủ bo góc, màu trắng–xanh pastel, ánh sáng mềm và điểm nhấn mint/vàng. Không thêm chữ hay thương hiệu vào ảnh.

Ảnh PNG gốc có nền trong suốt; bản dùng trong project chuyển sang WebP rộng 768px, giữ kênh alpha và tỷ lệ ảnh. Ảnh tải lười qua `next/image`; lớp CSS đặt ở góc dưới bên phải, giảm độ đậm và mờ dần về phía nội dung. Ảnh trang trí có `alt=""`, `aria-hidden` và không nhận tương tác chuột. Nội dung, CTA và điều hướng tab giữ nguyên.

## Asset và prompt

Tinh chỉnh ngày 10/10/2026: thêm nền chuyển màu trắng–xanh nhạt ở góc dưới bên phải của khung; tăng nhẹ kích thước và đẩy một phần chân đế ra ngoài khung. Mask giao nhau làm mờ các mép trên, trái và chân đế; màu ảnh hòa vào nền bằng chế độ multiply. Giữ nguyên bốn asset, nội dung và CTA.

### website

- Asset: `public/images/needs/website-3d.webp`
- Prompt đã dùng:

```text
Use case: stylized-concept. Asset type: decorative 3D illustration for the lower-right corner of a white Vietnamese hosting website content panel. Create one polished isometric miniature, matching a soft pastel infrastructure illustration: rounded white porcelain-like server blocks, pale sky-blue glass accents, delicate bevels, luminous soft studio lighting, very soft contact shadow, mostly white and icy blue with small restrained mint and warm-yellow accents. Three-quarter view from above, orthographic camera, main assembly centered and fully visible with comfortable transparent margin all around. Compact coherent composition; no background, no surrounding UI, no frame, no text, no letters, no logos, no watermark, no dark dramatic lighting. Genuine transparent background, suitable to fade into a white card with CSS. Subject: a three-tier compact server stack beside a round performance speedometer with a pastel red-yellow-mint arc and pale-blue needle, on one rounded rectangular white-and-blue base. The dial faces the viewer, with the server slightly behind to the left. Broad simple shapes, gentle highlights.
```

### app

- Asset: `public/images/needs/app-3d.webp`
- Prompt đã dùng:

```text
Use case: stylized-concept. Asset type: decorative 3D illustration for the lower-right corner of a white Vietnamese hosting website content panel. Create one polished isometric miniature, matching a soft pastel infrastructure illustration: rounded white porcelain-like server blocks, pale sky-blue glass accents, delicate bevels, luminous soft studio lighting, very soft contact shadow, mostly white and icy blue with small restrained mint and warm-yellow accents. Three-quarter view from above, orthographic camera, main assembly centered and fully visible with comfortable transparent margin all around. Compact coherent composition; no background, no surrounding UI, no frame, no text, no letters, no logos, no watermark, no dark dramatic lighting. Genuine transparent background, suitable to fade into a white card with CSS. Subject: a compact three-tier server stack beside a rounded translucent blue automation hub, connected by fine pale-blue paths to three small rounded node blocks, one small pale-mint neural-network motif floating over the hub. Simple orderly workflow architecture on one rounded white-and-blue base. No robot face or lettering.
```

### virtual

- Asset: `public/images/needs/virtual-3d.webp`
- Prompt đã dùng:

```text
Use case: stylized-concept. Asset type: decorative 3D illustration for the lower-right corner of a white Vietnamese hosting website content panel. Create one polished isometric miniature, matching a soft pastel infrastructure illustration: rounded white porcelain-like server blocks, pale sky-blue glass accents, delicate bevels, luminous soft studio lighting, very soft contact shadow, mostly white and icy blue with small restrained mint and warm-yellow accents. Three-quarter view from above, orthographic camera, main assembly centered and fully visible with comfortable transparent margin all around. Compact coherent composition; no background, no surrounding UI, no frame, no text, no letters, no logos, no watermark, no dark dramatic lighting. Genuine transparent background, suitable to fade into a white card with CSS. Subject: three compact rounded white-and-blue virtual server nodes connected by pale-blue paths around a translucent shield and small connected cube cluster, on one rounded white-and-blue base. Convey a private virtual network with simple orderly topology. No letters or logos.
```

### storage

- Asset: `public/images/needs/storage-3d.webp`
- Prompt đã dùng:

```text
Use case: stylized-concept. Asset type: decorative 3D illustration for the lower-right corner of a white Vietnamese hosting website content panel. Create one polished isometric miniature, matching a soft pastel infrastructure illustration: rounded white porcelain-like server blocks, pale sky-blue glass accents, delicate bevels, luminous soft studio lighting, very soft contact shadow, mostly white and icy blue with small restrained mint and warm-yellow accents. Three-quarter view from above, orthographic camera, main assembly centered and fully visible with comfortable transparent margin all around. Compact coherent composition; no background, no surrounding UI, no frame, no text, no letters, no logos, no watermark, no dark dramatic lighting. Genuine transparent background, suitable to fade into a white card with CSS. Subject: a compact four-tier white-and-blue server tower beside two rounded storage disk cylinders and a small translucent pale-blue cloud, on one rounded white-and-blue base. Simple physical infrastructure and backup storage composition, small mint indicator accent. No letters or logos.
```

Ảnh chụp và kết quả kiểm tra responsive lưu trong `artifacts/consultation/` (bị Git ignore).

