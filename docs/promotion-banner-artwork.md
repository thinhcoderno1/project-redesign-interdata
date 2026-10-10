# Banner ưu đãi VPS / Cloud Server

- Tạo bằng built-in image_gen; không dùng API/CLI.
- Asset sử dụng: `public/images/promotion/vps-cloud-warm.webp` (2048 × 432).
- Nội dung: SĂN ƯU ĐÃI; VPS / CLOUD SERVER; TỐI ƯU ĐẾN 80% CHI PHÍ. Giữ nội dung của banner trước, không bổ sung giá, mã, thời hạn hay cam kết.
- Tệp tham chiếu ban đầu: `public/images/banner-khuyen-mai.jpg`.
- Bản gốc được giữ lại; chỉ banner đầu tiên đổi sang asset mới.
- Công cụ trả ảnh khoảng 3:1. Bố cục được chỉnh bằng image_gen để tất cả chữ và cụm 3D nằm trong vùng giữa; Sharp chỉ chuẩn hóa kích thước, trích vùng giữa 2048 × 432 và mã hóa WebP (quality 92). Không kéo giãn.

## Prompt ban đầu

Use case: ads-marketing / redesign an existing web promotion banner.
Input image is the OLD BANNER: use it only to preserve the offer wording and the infrastructure subject. Completely redesign its visual presentation.
Create one polished finished panoramic InterData homepage promotion banner, target canvas exactly 2048 x 432 pixels, aspect ratio 128:27 (4.7407:1). Full bleed rectangular artwork, no outer frame, no rounded corners baked into the image, no website screenshot.
Design direction: elegant, bright, warm red-orange-yellow sales accents harmonizing with InterData royal blue #0043EC and deep navy #031677. Avoid the old heavy blue neon tunnel, tilted text plates and clutter. A softly luminous ivory-to-peach background with flowing warm coral, orange and gold light ribbons around the edges and underneath the scene; contrast and generous breathing room. High-end web advertising, restrained premium tech aesthetic.
Left 60% is an extremely legible typography area, right 40% is a single cohesive 3D infrastructure scene: white and cobalt blue server racks, a glossy blue-white cloud, small glowing upward arrow, on a rounded isometric datacenter platform. Warm gold/coral rim light ties the 3D models into the background with realistic soft contact shadows. Add a few subtle orange/gold promotional accents, no scattered coins or meaningless icons.
Text must be EXACTLY these Vietnamese strings with correct diacritics, and no other promotional copy:
"SĂN ƯU ĐÃI"
"VPS / CLOUD SERVER"
"TỐI ƯU ĐẾN"
"80%"
"CHI PHÍ"
Layout: readable flat bold upright Vietnamese sans-serif typography in the spirit of Be Vietnam Pro. Small red pill with white "SĂN ƯU ĐÃI" at upper left. Large navy "VPS / CLOUD SERVER" directly below it, one line. Lower row has navy "TỐI ƯU ĐẾN", a very large orange-to-red "80%" as focal point, and navy "CHI PHÍ". Keep the offer qualifiers together in order "TỐI ƯU ĐẾN 80% CHI PHÍ". No fictitious discount codes, prices, dates, guarantees, logos, CTA buttons, or extra text. Existing offer wording only.
Critical composition: all essential text and full 3D scene stay within the wide horizontal safe region. Leave 90px safe margin at left and right for overlaid carousel arrows, 30px top/bottom. Text is professionally typeset and not extruded chrome, skewed or italic. Bright sophisticated warm accents must be visibly present and balanced with the InterData blues. Output final banner ready to use at 2048x432.

## Điều chỉnh bố cục cho tỷ lệ banner

Edit this generated InterData promotion artwork for a VERY SHALLOW panoramic web banner. Preserve the exact Vietnamese wording, bright ivory/peach background, red offer tag, navy heading, orange-yellow "80%", and blue/white 3D servers/cloud. Correct the composition and typography, not the offer.
DELIVERY COMPOSITION IS CRITICAL: use a 3:1 outer canvas, approximately 2160x720. The final website banner is the CENTRAL 2160x456 band, y=132 through y=588; the top 132 and bottom 132 pixels will be discarded. Put ALL text and ALL essential infrastructure geometry entirely INSIDE this central band with further 25px vertical clearance. Outside this central band show ONLY soft continuous abstract peach/ivory and warm lighting background, no buildings, no text, no server/cloud parts. This is a final production crop-safe design, not a mockup: do not draw crop marks, borders, guides or a framed inset.
Within the central band, left 60%: a SMALL red capsule "SĂN ƯU ĐÃI", then one upright navy heading "VPS / CLOUD SERVER", then a SINGLE lower row "TỐI ƯU ĐẾN 80% CHI PHÍ" with enlarged orange/gold/red 80%. The capsule should be much smaller and quieter than the heading, like a normal promotional badge, not a huge neon billboard. All Vietnamese marks correct. Text must be upright bold sans serif, flat professionally set lettering; no slanted text, skewing or thick extrusion. Exact text only, no CTA/price/date/logo. Left/right safety margins 90px for carousel arrows.
Right 40% INSIDE the central crop band: compress the 3D composition vertically to fit the shallow band with the whole platform and cloud visible, modern white/blue servers, cobalt luminous cloud with upward arrow, gold rim accents. Simplify background: remove the city skyline and excessive towers. Fewer larger well-defined objects are preferable to visual clutter.
Keep the lively red-orange-yellow edge ribbons and warm shadows, but remove excessive sparkles, flares and overly glossy text so it feels refined. The final 4.74:1 center crop must contain a COMPLETE finished promotion banner with a clearly readable type hierarchy and a complete 3D scene.

## Điều chỉnh cuối

Make ONE targeted composition correction to this exact banner image. Preserve all existing Vietnamese text, its spelling, its size and positions, all warm red-orange-yellow colors, and the clean background.
The whole right-hand 3D servers/cloud/platform group is too tall for a shallow panoramic center crop. Reduce the SIZE of the ENTIRE right-hand 3D group by 20 percent and move it slightly down so the top of the tallest server is at 25% of canvas height and the bottom of the whole platform is at 75% of canvas height. Keep this group centered at x=77%, y=50%; keep all its objects, including the full cloud and platform, together. It must be completely within the middle 50% of canvas height. Maintain contact shadows and golden light trails. No cropped racks, no missing bases. Keep EVERYTHING ELSE including the lettering unchanged. Do not stretch the group; uniformly shrink it. Canvas same 3:1 dimensions as input; a central shallow crop to 4.74:1 must contain all the text AND the WHOLE smaller 3D group. No crop guides, no frame.

