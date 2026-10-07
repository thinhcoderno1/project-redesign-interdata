import fs from "node:fs/promises";
import sharp from "sharp";
await fs.mkdir("artifacts", { recursive: true });
const rgb = (hex) => hex.match(/[0-9a-f]{2}/gi).map((v) => parseInt(v, 16));
const luminance = (color) =>
  color
    .map((c) => {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const pairs = [
  ["CTA", "#FFFFFF", "#0043EC", 4.5],
  ["Text/canvas", "#172033", "#FFFFFF", 4.5],
  ["Secondary/canvas", "#526075", "#FFFFFF", 4.5],
  ["Link/subtle", "#0043EC", "#EEF3FF", 4.5],
  ["Dark card secondary", "#CBD5F7", "#102681", 4.5],
  ["Footer secondary", "#CBD5F7", "#031677", 4.5],
  ["Control border", "#7D899D", "#FFFFFF", 3],
  ["Error", "#A9222A", "#FFF3F3", 4.5],
];
const records = pairs.map(([name, a, b, minimum]) => ({
  name,
  contrast: contrast(rgb(a), rgb(b)),
  minimum,
}));
for (const [photo, samples] of [
  [
    "public/images/hero-datacenter-aisle.webp",
    [
      ["Hero title", "#031677", 0.72, "#FFFFFF"],
      ["Hero description", "#031677", 0.72, "#CBD5F7"],
    ],
  ],
  // Mobile has the lightest overlay behind text (88%); desktop/tablet start at 90%.
  [
    "public/images/viettel-idc.jpg",
    [
      ["Infrastructure headings", "#031677", 0.88, "#FFFFFF"],
      ["Infrastructure secondary", "#031677", 0.88, "#CBD5F7"],
    ],
  ],
]) {
  const { data, info } = await sharp(photo)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (const [name, overlay, alpha, foreground] of samples) {
    const overlayRgb = rgb(overlay);
    let worst = Infinity;
    for (let i = 0; i < data.length; i += info.channels) {
      const background = overlayRgb.map(
        (c, j) => c * alpha + data[i + j] * (1 - alpha),
      );
      worst = Math.min(worst, contrast(rgb(foreground), background));
    }
    records.push({
      name,
      contrast: worst,
      minimum: 4.5,
      method:
        "Every pixel of the actual photo composited with the CSS overlay; conservative bound for all responsive crops.",
    });
  }
}
await fs.writeFile(
  "artifacts/contrast-results.json",
  JSON.stringify(records, null, 2),
);
for (const r of records) {
  console.log(`${r.name}: ${r.contrast.toFixed(2)}:1 (minimum ${r.minimum})`);
  if (r.contrast < r.minimum)
    throw new Error(`Insufficient contrast: ${r.name}`);
}
