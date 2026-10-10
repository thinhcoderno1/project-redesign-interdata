# Minh họa card dịch vụ hạ tầng

Mười ảnh 3D riêng cho mười card, tạo bằng công cụ `image_gen` tích hợp ngày 10/10/2026. Mỗi ảnh ghép phần cứng và mặt sàn datacenter thành một cảnh liền khối: sàn nhiều lớp, đường mạch chìm, phối cảnh isometric và bóng tiếp xúc đồng nhất. Sàn kéo nhẹ về bên trái và mờ vào nền trong suốt.

Asset dùng trong project: `public/images/services-3d/<service-id>.webp`. Bản WebP rộng 900px, chất lượng 85, giữ alpha. Ảnh gốc PNG giữ nguyên tại thư mục `generated_images` của Codex. Phần `ServiceArtwork` dùng `next/image`, tải lười và ảnh trang trí `alt=""`.

CSS đặt cả cảnh ở góc dưới bên phải, dùng multiply, nền InterData và mask mềm để hòa mép sàn vào card. Tên dịch vụ hiển thị in hoa qua `text-transform`; dữ liệu gốc, giá, kỳ thanh toán, CTA và liên kết không đổi. Mười ảnh chỉ là minh họa cách điệu, không thể hiện thiết bị thực tế của nhà cung cấp.

## Prompt chung

```text
Use case: stylized-concept. Asset type: a decorative 3D infrastructure illustration for the bottom-right of an InterData service card. Landscape 3:2 composition, genuinely transparent background. Consistent premium miniature isometric 3D rendering: orthographic camera from above at 30 degrees, white porcelain server hardware, icy blue translucent panels, restrained royal blue (#0043ec) accents, smooth bevels, soft bright studio illumination from upper left, gentle ambient occlusion. Main hardware occupies the right half of the composition. It is physically attached to a layered datacenter floor/platform that extends diagonally toward the lower left: three shallow white and pale blue terraces, clean technical floor tiles with fine etched circuit paths, a subtle blue front edge, luminous inset paths. The hardware, plinth, and technical floor form ONE continuous grounded 3D scene with coherent contact shadows and perspective, not a separate icon floating over a flat surface. Floor grows lighter toward the left and its outer edges feather into actual transparency. Preserve substantial transparent margin above and on the left, keep all important hardware visible. Compact readable silhouette even at 200px, few deliberate large forms. No room walls, no busy city, no backdrop rectangle, no text, no letters, no logos, no watermark, no dark dramatic lighting. Subject:
```

## Chủ thể cho từng dịch vụ

### vps-amd

- Asset: `public/images/services-3d/vps-amd.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
a compact three-tier server stack with an upright square microprocessor panel beside it; the panel has a pale blue center and radial pins, emphasizing CPU compute. Small mint status lights. Distinct stack plus chip silhouette.
```

### vps-platinum

- Asset: `public/images/services-3d/vps-platinum.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
a tall single silver-white tower server with a translucent icy blue crystalline hexagonal processor plate beside it, a slim cooling grille and understated blue status lights. Distinct vertical tower and faceted crystal silhouette.
```

### vps-linux

- Asset: `public/images/services-3d/vps-linux.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
two compact white server trays next to an original simple miniature penguin figurine, white and pale-blue body with small dark-blue eyes and restrained pale-yellow beak and feet. Friendly sculptural penguin signals Linux, no trademarks or lettering. Distinct penguin and short server silhouette.
```

### vps-gold

- Asset: `public/images/services-3d/vps-gold.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
a broad white two-tier rack server with two restrained champagne-gold heat-sink plates, one upright square gold-toned processor on the right and three blue indicator lights. Palette predominantly white and icy blue, only small pale-gold accents. Distinct wide server plus golden square silhouette.
```

### vps-n8n

- Asset: `public/images/services-3d/vps-n8n.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
a small server hub connected by thin raised blue cables to three large rounded translucent blue workflow nodes in an orderly branching automation topology. One mint node and two blue nodes. Distinct connected-node silhouette.
```

### vps-vibe-coding

- Asset: `public/images/services-3d/vps-vibe-coding.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
a compact white server with a freestanding translucent blue development console screen, on the screen only two broad sculptural chevron shapes facing outward with no lettering, beside a small glowing pale-blue neural-network orb. Distinct screen and AI orb silhouette.
```

### cloud-amd-gen3

- Asset: `public/images/services-3d/cloud-amd-gen3.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
three compact server towers arranged beneath one substantial translucent pale-blue cloud canopy, connected by three short luminous paths to a square processor in the floor. Distinct clustered servers under cloud silhouette.
```

### cloud-platinum-gen2

- Asset: `public/images/services-3d/cloud-platinum-gen2.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
two tall silver-white server towers joined by a floating icy-blue cloud ring and a translucent layered cube suspended between them, with orderly short blue connections. Distinct twin towers and suspended cube silhouette.
```

### dedicated

- Asset: `public/images/services-3d/dedicated.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
one tall dedicated datacenter rack cabinet with four visibly separate white server shelves, pale-blue front windows, a solid white structural frame and a thin blue cooling grille, alongside one simple small storage cylinder. Distinct full-height rack silhouette.
```

### colocation

- Asset: `public/images/services-3d/colocation.webp`
- Prompt cuối cùng = prompt chung + chủ thể dưới đây.

```text
an isometric pair of white datacenter rack enclosures, one closed blue-glass cabinet and one partially open empty cabinet showing three clean shelf slots, with a short pale-blue floor connection and a small square power module. Distinct twin enclosure and open rack silhouette.
```

## Kiểm tra

Build và lint; browser QA ở 320–1920px; so sánh nội dung/giá/link với snapshot trước khi sửa; xác nhận mỗi card dùng một ảnh khác nhau và tên in hoa; keyboard focus, ảnh tải được, không tràn khung và accessibility. Ảnh chụp/kết quả nằm trong `artifacts/infrastructure/` (Git ignore).
