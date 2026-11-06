import sharp from "sharp";

// Derive delivery assets from the existing artwork, without upscaling it.
const directory = "public/images/home";
const source = `${directory}/hero-globe-racks.webp`;
const { width, height } = await sharp(source).metadata();

for (const targetWidth of [1400, width]) {
  await sharp(source)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .avif({ quality: 60, effort: 6 })
    .toFile(`${directory}/hero-globe-racks-desktop-${targetWidth}.avif`);
}

// A centered square preserves the existing object-fit: cover composition on
// mobile, while retaining the source's full vertical detail in a smaller file.
const mobile = sharp(source).extract({
  left: Math.floor((width - height) / 2),
  top: 0,
  width: height,
  height,
});
await mobile
  .clone()
  .avif({ quality: 65, effort: 6 })
  .toFile(`${directory}/hero-globe-racks-mobile.avif`);
await mobile
  .clone()
  .webp({ quality: 82, effort: 6 })
  .toFile(`${directory}/hero-globe-racks-mobile.webp`);
